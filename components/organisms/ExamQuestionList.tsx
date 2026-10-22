import { Ref, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { FlatList, ListRenderItem, Platform, StyleSheet, View, ViewToken } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { ExamQuestionCard } from '@/components/organisms/ExamQuestionCard';
import type {
  ExamAnswers,
  ExamHighlights,
  ExamQuestionCardContent,
  Question,
} from '@/constants/exams';
import type { PendingWord } from '@/hooks/useExamSession';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

/** Ações da lista chamadas por quem a usa (ex.: o navegador de questões) */
export type ExamQuestionListHandle = {
  /** Rola até a questão, alinhada ao topo da lista */
  scrollToQuestion: (index: number) => void;
};

type Props = {
  questions: Question[];
  answers: ExamAnswers;
  highlights: ExamHighlights;
  pending: PendingWord | null;
  markerOn: boolean;
  content: ExamQuestionCardContent;
  emptyMessage: string;
  /** Recebe o id da questão e o da alternativa escolhida */
  onSelectAnswer: (questionId: string, alternativeId: string) => void;
  onWordPress: (questionId: string, wordIndex: number) => void;
  /** Questão atual mudou pela rolagem do usuário (primeiro card com 50% visível) */
  onCurrentChange: (index: number) => void;
  ref?: Ref<ExamQuestionListHandle>;
};

// Medidas do mockup da realização de prova, em px
const CARD_GAP = 16;
const LIST_VERTICAL_PADDING = 16;
const EMPTY_TOP = 24;
// Cards altos: poucos por lote bastam para preencher a tela sem travar a abertura
const INITIAL_CARDS = 3;
const CARDS_PER_BATCH = 3;
/** Telas mantidas montadas (a visível + 2 acima e 2 abaixo) */
const WINDOW_SIZE = 5;
/** Tempo máximo de uma rolagem programática, em ms (depois volta a seguir a visibilidade) */
const PROGRAMMATIC_SCROLL_MS = 700;
const RETRY_DELAY_MS = 100;
const MAX_RETRIES = 3;

/** Questão atual: o primeiro card com pelo menos metade da altura visível */
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 50 };

const keyExtractor = (question: Question) => question.id;

/**
 * Lista das questões da prova, uma abaixo da outra: uma FlatList de coluna única, com as margens
 * das outras telas. Informa a questão atual pela visibilidade dos cards e rola até uma questão
 * quando pedido (ignorando a visibilidade enquanto essa rolagem acontece). Os cards são
 * memorizados e recebem só os dados da própria questão.
 */
export function ExamQuestionList({
  questions,
  answers,
  highlights,
  pending,
  markerOn,
  content,
  emptyMessage,
  onSelectAnswer,
  onWordPress,
  onCurrentChange,
  ref,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const listRef = useRef<FlatList<Question>>(null);
  // Rolagem pedida pelo navegador em andamento: a visibilidade não muda a questão atual
  const programmatic = useRef(false);
  const programmaticTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retries = useRef(0);

  const endProgrammatic = useCallback(() => {
    programmatic.current = false;
    if (programmaticTimer.current) {
      clearTimeout(programmaticTimer.current);
      programmaticTimer.current = null;
    }
  }, []);

  const startProgrammatic = useCallback(() => {
    programmatic.current = true;
    if (programmaticTimer.current) {
      clearTimeout(programmaticTimer.current);
    }
    programmaticTimer.current = setTimeout(endProgrammatic, PROGRAMMATIC_SCROLL_MS);
  }, [endProgrammatic]);

  useImperativeHandle(
    ref,
    () => ({
      scrollToQuestion: (index: number) => {
        retries.current = 0;
        startProgrammatic();
        listRef.current?.scrollToIndex({ index, viewPosition: 0, animated: true });
      },
    }),
    [startProgrammatic],
  );

  // Cards de alturas diferentes: se o destino ainda não foi medido, rola até uma posição
  // estimada (média das alturas medidas) e tenta de novo
  const handleScrollToIndexFailed = useCallback(
    (info: { index: number; averageItemLength: number }) => {
      startProgrammatic();
      listRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: false,
      });
      if (retries.current < MAX_RETRIES) {
        retries.current += 1;
        retryTimer.current = setTimeout(() => {
          listRef.current?.scrollToIndex({ index: info.index, viewPosition: 0, animated: true });
        }, RETRY_DELAY_MS);
      }
    },
    [startProgrammatic],
  );

  useEffect(
    () => () => {
      if (programmaticTimer.current) clearTimeout(programmaticTimer.current);
      if (retryTimer.current) clearTimeout(retryTimer.current);
    },
    [],
  );

  // Estável (o FlatList não aceita trocar esta função depois de montado)
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken<Question>[] }) => {
      if (programmatic.current) {
        return;
      }
      const indexes = viewableItems
        .filter((token) => token.isViewable && token.index !== null)
        .map((token) => token.index as number);
      if (indexes.length > 0) {
        onCurrentChange(Math.min(...indexes));
      }
    },
    [onCurrentChange],
  );

  const renderItem = useCallback<ListRenderItem<Question>>(
    ({ item, index }) => (
      <ExamQuestionCard
        question={item}
        position={index + 1}
        answer={answers[item.id]}
        highlights={highlights[item.id]}
        pendingWord={pending?.questionId === item.id ? pending.wordIndex : null}
        markerOn={markerOn}
        content={content}
        onSelectAnswer={onSelectAnswer}
        onWordPress={onWordPress}
      />
    ),
    [answers, highlights, pending, markerOn, content, onSelectAnswer, onWordPress],
  );

  const renderSeparator = useCallback(
    () => <View style={{ height: scale(CARD_GAP) }} />,
    [scale],
  );

  return (
    <FlatList
      ref={listRef}
      data={questions}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
      ListEmptyComponent={
        <BodyText align="center" style={{ marginTop: scale(EMPTY_TOP) }}>
          {emptyMessage}
        </BodyText>
      }
      viewabilityConfig={VIEWABILITY_CONFIG}
      onViewableItemsChanged={handleViewableItemsChanged}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      // O usuário arrastou: a rolagem programática acabou e a visibilidade volta a valer
      onScrollBeginDrag={endProgrammatic}
      style={styles.list}
      contentContainerStyle={[
        styles.content,
        {
          width: layoutWidth,
          paddingHorizontal,
          paddingVertical: scale(LIST_VERTICAL_PADDING),
        },
      ]}
      initialNumToRender={INITIAL_CARDS}
      maxToRenderPerBatch={CARDS_PER_BATCH}
      windowSize={WINDOW_SIZE}
      removeClippedSubviews={Platform.OS === 'android'}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
  },
});
