import { ReactElement, useCallback } from 'react';
import { FlatList, ListRenderItem, Pressable, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { FlashcardContent } from '@/components/molecules/FlashcardContent';
import { InfoCard } from '@/components/molecules/InfoCard';
import {
  CARD_HEIGHT_RATIO,
  CARD_PADDING,
  INITIAL_ROWS,
  ROWS_PER_BATCH,
  WINDOW_SIZE,
} from '@/components/organisms/FlashcardGrid';
import { CardAction, CardActionKey } from '@/constants/decks';
import { useGridLayout } from '@/hooks/useGridLayout';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

/** Textos prontos de um card de questão (montados fora da lista, não no renderItem) */
export type QuestionCardItem = {
  id: string;
  /** "Disciplina - Conteúdo" */
  label: string;
  /** Título da questão (o "nome" dela na grade) */
  title: string;
  /** Nome da dificuldade (ex.: "Médio") */
  difficultyLabel: string;
};

type Props = {
  questions: QuestionCardItem[];
  /** Conteúdo acima da grade, que rola junto com ela (cabeçalho e botões) */
  header: ReactElement;
  emptyMessage: string;
  actions: CardAction[];
  onAction: (action: CardActionKey, questionId: string) => void;
  /** Toque no cartão (fora dos botões): recebe o id da questão. Estável. */
  onPress: (questionId: string) => void;
};

/** Cartões por linha */
const COLUMNS = 2;
const EMPTY_TOP = 24;

const keyExtractor = (question: QuestionCardItem) => question.id;

/**
 * Grade de questões de uma prova em 2 colunas, irmã da grade de flashcards (FlashcardGrid):
 * mesmo cartão e mesma proporção (altura de ~80% da largura, medida no mockup), mesmo conteúdo (FlashcardContent, com o rótulo em 1 linha e a dificuldade ao
 * lado dos botões), mesmas margens e a mesma configuração de lista grande. Uma FlatList só (o
 * cabeçalho entra como ListHeaderComponent), cartões de largura e altura fixas (o último de uma
 * linha ímpar não estica), item memorizado e callbacks estáveis. Tocar no cartão (fora dos
 * botões) abre a questão.
 */
export function QuestionGrid({
  questions,
  header,
  emptyMessage,
  actions,
  onAction,
  onPress,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { gap, itemWidth, contentContainerStyle } = useGridLayout(COLUMNS);
  const itemHeight = itemWidth * CARD_HEIGHT_RATIO;

  const renderItem = useCallback<ListRenderItem<QuestionCardItem>>(
    ({ item }) => (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.label}`}
        onPress={() => onPress(item.id)}
        style={({ pressed }) => [{ width: itemWidth, height: itemHeight }, pressed && styles.pressed]}>
        <InfoCard padding={CARD_PADDING} style={styles.fill}>
          <FlashcardContent
            cardId={item.id}
            label={item.label}
            title={item.title}
            actions={actions}
            onAction={onAction}
            labelLines={1}
            labelWeight="medium"
            footerLabel={item.difficultyLabel}
          />
        </InfoCard>
      </Pressable>
    ),
    [itemWidth, itemHeight, actions, onAction, onPress],
  );

  const renderSeparator = useCallback(() => <View style={{ height: gap }} />, [gap]);

  return (
    <FlatList
      data={questions}
      keyExtractor={keyExtractor}
      numColumns={COLUMNS}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <BodyText align="center" style={{ marginTop: scale(EMPTY_TOP) }}>
          {emptyMessage}
        </BodyText>
      }
      ItemSeparatorComponent={renderSeparator}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      initialNumToRender={INITIAL_ROWS}
      maxToRenderPerBatch={ROWS_PER_BATCH}
      windowSize={WINDOW_SIZE}
      // TODO: carregar mais questões (onEndReached) ao integrar com o back.
      bounces={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
  },
  fill: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
