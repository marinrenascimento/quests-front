import { useCallback, useEffect, useReducer } from 'react';

import { SPELLING_GAME_CONFIG, type SpellingWord } from '@/constants/games';
import { buildRounds, type SpellingRound } from '@/utils/spellingRounds';

/**
 * Em que momento a partida está:
 * - 'choosing': o jogador está escolhendo; as opções valem.
 * - 'correct': acertou; a opção fica verde por um instante, antes da próxima palavra.
 * - 'over': acabaram as vidas.
 */
export type SpellingGamePhase = 'choosing' | 'correct' | 'over';

export type SpellingGameState = {
  lives: number;
  /** Palavras corrigidas nesta partida */
  score: number;
  round: SpellingRound;
  /** Próximas rodadas da lista atual */
  queue: SpellingRound[];
  /** Opções erradas já tocadas nesta palavra (ficam vermelhas e sem toque) */
  wrongOptions: string[];
  phase: SpellingGamePhase;
};

type Action =
  | { type: 'answer'; value: string }
  /** `freshRounds` só é usada se a lista atual tiver acabado */
  | { type: 'next'; freshRounds: SpellingRound[] }
  | { type: 'restart'; freshRounds: SpellingRound[] };

/** Partida nova: todas as vidas e contagem zerada */
export function initialSpellingState(rounds: SpellingRound[]): SpellingGameState {
  const [round, ...queue] = rounds;
  return {
    lives: SPELLING_GAME_CONFIG.lives,
    score: 0,
    round,
    queue,
    wrongOptions: [],
    phase: 'choosing',
  };
}

/** Regras da partida (RN-293 e RN-294), sem nada de tela. Cada ação só vale na fase certa. */
export function spellingGameReducer(state: SpellingGameState, action: Action): SpellingGameState {
  switch (action.type) {
    case 'answer': {
      if (state.phase !== 'choosing' || state.wrongOptions.includes(action.value)) {
        return state;
      }
      if (action.value === state.round.correct) {
        return { ...state, score: state.score + 1, phase: 'correct' };
      }
      const lives = state.lives - 1;
      return {
        ...state,
        lives,
        wrongOptions: [...state.wrongOptions, action.value],
        // Errar não troca a palavra: com vidas, o jogador tenta de novo (RN-293)
        phase: lives === 0 ? 'over' : 'choosing',
      };
    }
    case 'next': {
      if (state.phase !== 'correct') {
        return state;
      }
      const [round, ...queue] = state.queue.length > 0 ? state.queue : action.freshRounds;
      return { ...state, round, queue, wrongOptions: [], phase: 'choosing' };
    }
    case 'restart':
      return initialSpellingState(action.freshRounds);
  }
}

/**
 * Estado e regras de uma partida do Goblin Ortográfico. Não há tempo correndo: a partida só anda
 * quando o jogador toca. Nada é salvo: ela existe só enquanto a tela está aberta (RN-296).
 */
export function useSpellingGame(words: SpellingWord[]) {
  const [state, dispatch] = useReducer(spellingGameReducer, words, (list) =>
    initialSpellingState(buildRounds(list)),
  );
  const currentWord = state.round.correct;

  const selectOption = useCallback((value: string) => dispatch({ type: 'answer', value }), []);
  const restart = useCallback(
    () => dispatch({ type: 'restart', freshRounds: buildRounds(words, currentWord) }),
    [words, currentWord],
  );

  // Depois de acertar: a resposta fica verde por um instante e vem a próxima palavra
  useEffect(() => {
    if (state.phase !== 'correct') {
      return;
    }
    const timer = setTimeout(
      () => dispatch({ type: 'next', freshRounds: buildRounds(words, currentWord) }),
      SPELLING_GAME_CONFIG.correctPauseMs,
    );
    return () => clearTimeout(timer);
  }, [state.phase, words, currentWord]);

  return {
    ...state,
    /** Algo seria perdido ao sair: palavra corrigida ou vida perdida (RN-295) */
    hasProgress: state.score > 0 || state.lives < SPELLING_GAME_CONFIG.lives,
    selectOption,
    restart,
  };
}
