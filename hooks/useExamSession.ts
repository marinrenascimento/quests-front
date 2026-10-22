import { useCallback, useMemo, useReducer } from 'react';

import {
  AlternativeLetter,
  ExamAnswers,
  ExamHighlights,
  INITIAL_MARKER_COLOR,
  MarkerColor,
  Question,
  QuestionHighlights,
} from '@/constants/exams';

/** Primeiro toque do marcador, à espera do segundo (que fecha o trecho) */
export type PendingWord = { questionId: string; wordIndex: number };

type State = {
  answers: ExamAnswers;
  /** Posição (índice) da questão atual */
  currentIndex: number;
  markerColor: MarkerColor;
  markerOn: boolean;
  highlights: ExamHighlights;
  pending: PendingWord | null;
};

type Action =
  | { type: 'answer'; questionId: string; letter: AlternativeLetter }
  | { type: 'current'; index: number }
  | { type: 'color'; color: MarkerColor }
  | { type: 'toggleMarker' }
  | { type: 'word'; questionId: string; wordIndex: number };

const INITIAL_STATE: State = {
  answers: {},
  currentIndex: 0,
  markerColor: INITIAL_MARKER_COLOR,
  markerOn: false,
  highlights: {},
  pending: null,
};

/**
 * Marca o trecho de `from` a `to` (inclusive) com a cor. Se o trecho inteiro já estiver com essa
 * cor, desmarca; se tiver outra cor (ou partes sem cor), passa todo para a cor.
 */
function markRange(
  current: QuestionHighlights | undefined,
  from: number,
  to: number,
  color: MarkerColor,
): QuestionHighlights {
  const next: QuestionHighlights = { ...current };
  let allSameColor = true;
  for (let index = from; index <= to; index++) {
    if (next[index] !== color) {
      allSameColor = false;
    }
  }
  for (let index = from; index <= to; index++) {
    if (allSameColor) {
      delete next[index];
    } else {
      next[index] = color;
    }
  }
  return next;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'answer': {
      // Tocar de novo na escolhida desmarca (a questão volta a não respondida)
      const answers = { ...state.answers };
      if (answers[action.questionId] === action.letter) {
        delete answers[action.questionId];
      } else {
        answers[action.questionId] = action.letter;
      }
      return { ...state, answers };
    }
    case 'current':
      // Mudar de questão cancela o primeiro toque pendente do marcador
      return action.index === state.currentIndex
        ? state
        : { ...state, currentIndex: action.index, pending: null };
    case 'color':
      // Escolher uma cor também liga o modo marcador
      return { ...state, markerColor: action.color, markerOn: true, pending: null };
    case 'toggleMarker':
      return { ...state, markerOn: !state.markerOn, pending: null };
    case 'word': {
      if (!state.markerOn) {
        return state;
      }
      const { pending } = state;
      // Primeiro toque (ou toque numa questão diferente da do primeiro): só guarda a palavra
      if (!pending || pending.questionId !== action.questionId) {
        return {
          ...state,
          pending: { questionId: action.questionId, wordIndex: action.wordIndex },
        };
      }
      // Segundo toque: marca do primeiro ao segundo, em qualquer ordem
      const from = Math.min(pending.wordIndex, action.wordIndex);
      const to = Math.max(pending.wordIndex, action.wordIndex);
      const marked = markRange(state.highlights[action.questionId], from, to, state.markerColor);
      const highlights = { ...state.highlights };
      if (Object.keys(marked).length === 0) {
        delete highlights[action.questionId];
      } else {
        highlights[action.questionId] = marked;
      }
      return { ...state, highlights, pending: null };
    }
  }
}

/**
 * Estado e regras da realização de uma prova: respostas (uma por questão, que pode ser trocada
 * ou desmarcada), questão atual, marcador de texto (cor, modo e marcações por questão) e o
 * primeiro toque pendente do marcador. As ações são estáveis (cards memorizados não
 * re-renderizam à toa). Nada é salvo: tudo existe só enquanto a tela está aberta.
 */
// TODO: enviar as respostas ao back na entrega e salvar as marcações, se os requisitos pedirem.
export function useExamSession(questions: Question[]) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const selectAnswer = useCallback(
    (questionId: string, letter: AlternativeLetter) =>
      dispatch({ type: 'answer', questionId, letter }),
    [],
  );
  const setCurrentIndex = useCallback((index: number) => dispatch({ type: 'current', index }), []);
  const selectMarkerColor = useCallback(
    (color: MarkerColor) => dispatch({ type: 'color', color }),
    [],
  );
  const toggleMarker = useCallback(() => dispatch({ type: 'toggleMarker' }), []);
  const pressWord = useCallback(
    (questionId: string, wordIndex: number) => dispatch({ type: 'word', questionId, wordIndex }),
    [],
  );

  /** Respondida ou não, por posição (navegador de questões) */
  const answeredFlags = useMemo(
    () => questions.map((question) => state.answers[question.id] !== undefined),
    [questions, state.answers],
  );

  return {
    ...state,
    total: questions.length,
    answeredCount: answeredFlags.filter(Boolean).length,
    answeredFlags,
    selectAnswer,
    setCurrentIndex,
    selectMarkerColor,
    toggleMarker,
    pressWord,
  };
}

export type ExamSession = ReturnType<typeof useExamSession>;
