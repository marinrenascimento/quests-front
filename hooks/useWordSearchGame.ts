import { useCallback, useEffect, useReducer } from 'react';

import {
  WORD_SEARCH_CONFIG,
  type WordSearchLevel,
  type WordSearchQuestion,
} from '@/constants/games';
import { shuffle } from '@/utils/shuffle';
import { buildPuzzle, takeQuestions, type WordSearchPuzzle } from '@/utils/wordSearch';

/**
 * Em que momento o caça-palavras está:
 * - 'searching': o jogador está procurando; as seleções valem.
 * - 'completed': achou as 3 respostas; o aviso fica na tela e depois vem o próximo.
 */
export type WordSearchPhase = 'searching' | 'completed';

export type WordSearchState = {
  puzzle: WordSearchPuzzle;
  /** Muda a cada caça-palavras: é o que faz a grade recomeçar sem nada selecionado */
  puzzleId: number;
  /** Próximas perguntas do nível */
  queue: WordSearchQuestion[];
  /** Respostas já achadas neste caça-palavras (como aparecem na grade) */
  foundLetters: string[];
  /** Casas das respostas achadas (ficam verdes) */
  foundCells: number[];
  /** Casas da última seleção errada (ficam vermelhas por um instante) */
  missCells: number[];
  /** Caça-palavras completos nesta partida */
  completed: number;
  phase: WordSearchPhase;
};

type Action =
  | { type: 'select'; cells: number[] }
  | { type: 'clearMiss' }
  | { type: 'next'; puzzle: WordSearchPuzzle; queue: WordSearchQuestion[] };

/** Partida nova */
export function initialWordSearchState(
  puzzle: WordSearchPuzzle,
  queue: WordSearchQuestion[],
): WordSearchState {
  return {
    puzzle,
    puzzleId: 0,
    queue,
    foundLetters: [],
    foundCells: [],
    missCells: [],
    completed: 0,
    phase: 'searching',
  };
}

/**
 * Regras da partida (RN-306 e RN-308), sem nada de tela. Vale qualquer seleção cujas letras formem
 * uma resposta, nos dois sentidos: não importa em que lugar ela foi escondida, porque o jogador não
 * tem como saber se as letras do preenchimento formaram a mesma palavra em outro lugar.
 */
export function wordSearchReducer(state: WordSearchState, action: Action): WordSearchState {
  switch (action.type) {
    case 'select': {
      if (state.phase !== 'searching') {
        return state;
      }
      const letters = action.cells.map((cell) => state.puzzle.letters[cell]);
      const forward = letters.join('');
      const backward = [...letters].reverse().join('');
      const match = state.puzzle.questions.find(
        (item) =>
          !state.foundLetters.includes(item.letters) &&
          (item.letters === forward || item.letters === backward),
      );
      if (!match) {
        return { ...state, missCells: action.cells };
      }
      const foundLetters = [...state.foundLetters, match.letters];
      const isComplete = foundLetters.length === state.puzzle.questions.length;
      return {
        ...state,
        foundLetters,
        foundCells: [...state.foundCells, ...action.cells],
        missCells: [],
        completed: isComplete ? state.completed + 1 : state.completed,
        phase: isComplete ? 'completed' : 'searching',
      };
    }
    case 'clearMiss':
      return state.missCells.length > 0 ? { ...state, missCells: [] } : state;
    case 'next':
      return state.phase === 'completed'
        ? {
            ...initialWordSearchState(action.puzzle, action.queue),
            puzzleId: state.puzzleId + 1,
            completed: state.completed,
          }
        : state;
  }
}

/**
 * Estado e regras de uma partida do Caça-Palavras. Não há vidas nem tempo: ela só termina quando o
 * jogador sai. Ao achar as 3 respostas, vem o próximo caça-palavras sozinho. Nada é salvo: a partida
 * existe só enquanto a tela está aberta (RN-308).
 */
export function useWordSearchGame(bank: WordSearchQuestion[], level: WordSearchLevel) {
  const [state, dispatch] = useReducer(wordSearchReducer, null, () => {
    const { questions, queue } = takeQuestions(
      shuffle(bank),
      bank,
      WORD_SEARCH_CONFIG.questionsPerPuzzle,
    );
    return initialWordSearchState(buildPuzzle(questions, level), queue);
  });
  const { phase, queue, missCells } = state;

  const selectCells = useCallback((cells: number[]) => dispatch({ type: 'select', cells }), []);

  // Seleção errada: fica vermelha por um instante
  useEffect(() => {
    if (missCells.length === 0) {
      return;
    }
    const timer = setTimeout(
      () => dispatch({ type: 'clearMiss' }),
      WORD_SEARCH_CONFIG.missFlashMs,
    );
    return () => clearTimeout(timer);
  }, [missCells]);

  // Caça-palavras completo: o aviso fica na tela e vem o próximo
  useEffect(() => {
    if (phase !== 'completed') {
      return;
    }
    const timer = setTimeout(() => {
      const next = takeQuestions(queue, bank, WORD_SEARCH_CONFIG.questionsPerPuzzle);
      dispatch({ type: 'next', puzzle: buildPuzzle(next.questions, level), queue: next.queue });
    }, WORD_SEARCH_CONFIG.completedPauseMs);
    return () => clearTimeout(timer);
  }, [phase, queue, bank, level]);

  return {
    ...state,
    /** Algo seria perdido ao sair: resposta achada ou caça-palavras completo (RN-307) */
    hasProgress: state.completed > 0 || state.foundLetters.length > 0,
    selectCells,
  };
}
