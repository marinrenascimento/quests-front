import { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import {
  QUESTION_NUMBER_RING,
  QUESTION_NUMBER_SIZE,
  QuestionNumberButton,
} from '@/components/atoms/QuestionNumberButton';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Respondida ou não, por posição da questão */
  answered: boolean[];
  /** Posição da questão atual */
  currentIndex: number;
  onSelect: (index: number) => void;
  /** Rótulo de acessibilidade de cada botão, pela posição (começando em 1) */
  getAccessibilityLabel: (position: number) => string;
};

/** Botões que cabem exatamente na largura útil (o vão entre eles sai daí) */
const VISIBLE_BUTTONS = 9;

/**
 * Linha de botões numerados da prova, um por questão, nas mesmas margens das outras telas. Com
 * mais botões do que cabem, vira uma rolagem horizontal (sem barra) que rola sozinha para deixar
 * a questão atual no centro. FlatList de itens com tamanho fixo (getItemLayout), para provas
 * grandes.
 */
export function QuestionNavigator({
  answered,
  currentIndex,
  onSelect,
  getAccessibilityLabel,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const listRef = useRef<FlatList<boolean>>(null);
  const size = scale(QUESTION_NUMBER_SIZE);
  const ring = scale(QUESTION_NUMBER_RING);
  // 9 botões preenchem a largura útil em qualquer tela
  const gap = (layoutWidth - paddingHorizontal * 2 - VISIBLE_BUTTONS * size) / (VISIBLE_BUTTONS - 1);
  const pitch = size + gap;

  useEffect(() => {
    const contentWidth = paddingHorizontal * 2 + answered.length * pitch - gap;
    const maxOffset = Math.max(0, contentWidth - layoutWidth);
    // Botão atual no centro, sem passar das pontas da linha
    const centered = paddingHorizontal + currentIndex * pitch + size / 2 - layoutWidth / 2;
    listRef.current?.scrollToOffset({
      offset: Math.min(maxOffset, Math.max(0, centered)),
      animated: true,
    });
  }, [currentIndex, answered.length, pitch, gap, size, paddingHorizontal, layoutWidth]);

  // Um toque estável por posição: ao mudar a questão atual, só os botões que mudaram re-renderizam
  const handlers = useMemo(
    () => Array.from({ length: answered.length }, (_, index) => () => onSelect(index)),
    [answered.length, onSelect],
  );

  const renderItem = useCallback<ListRenderItem<boolean>>(
    ({ item, index }) => (
      <QuestionNumberButton
        label={String(index + 1)}
        answered={item}
        current={index === currentIndex}
        onPress={handlers[index]}
        accessibilityLabel={getAccessibilityLabel(index + 1)}
      />
    ),
    [currentIndex, handlers, getAccessibilityLabel],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<boolean> | null | undefined, index: number) => ({
      length: pitch,
      offset: paddingHorizontal + index * pitch,
      index,
    }),
    [pitch, paddingHorizontal],
  );

  const renderSeparator = useCallback(() => <View style={{ width: gap }} />, [gap]);

  return (
    <FlatList
      ref={listRef}
      horizontal
      data={answered}
      keyExtractor={(_, index) => String(index)}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      ItemSeparatorComponent={renderSeparator}
      extraData={currentIndex}
      // Espaço em volta para o anel amarelo (por fora do botão) não ser cortado
      contentContainerStyle={{ paddingHorizontal, paddingVertical: ring + 1 }}
      style={styles.list}
      showsHorizontalScrollIndicator={false}
      bounces={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flexGrow: 0,
  },
});
