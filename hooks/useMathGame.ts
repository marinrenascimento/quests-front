import { useCallback, useReducer } from 'react';

import { MATH_GAME_CONFIG, type GameDifficulty } from '@/constants/games';
import { generateEquation, type MathEquation } from '@/utils/mathEquation';

/**
 * Em que momento o monstro atual está:
 * - 'walking': caminhando na direção do elfo; as respostas valem.
 * - 'leaving': foi derrotado ou alcançou o elfo e está sumindo; as respostas não valem.
 * - 'over': acabaram as vidas e a partida terminou; não há monstro.
 */
export type MathGamePhase = 'walking' | 'leaving' | 'over';

export type MathGameState = {
  lives: number;
  /** Monstros derrotados nesta partida */
  score: number;
  /** Muda a cada monstro novo: é o que faz a tela recomeçar a caminhada */
  monsterId: number;
  equation: MathEquation;
  /** Respostas erradas já tocadas neste monstro (ficam vermelhas e desabilitadas) */
  wrongOptions: number[];
  phase: MathGamePhase;
};

type Action =
  | { type: 'answer'; value: number }
  | { type: 'monsterReached' }
  | { type: 'monsterGone'; nextEquation: MathEquation }
  | { type: 'restart'; nextEquation: MathEquation };

/** Partida nova: todas as vidas, sem monstros derrotados */
export function initialMathGameState(equation: MathEquation): MathGameState {
  return {
    lives: MATH_GAME_CONFIG.lives,
    score: 0,
    monsterId: 0,
    equation,
    wrongOptions: [],
    phase: 'walking',
  };
}

/**
 * Regras da partida (RN-280 a RN-284), sem nada de tela. Cada ação só vale na fase certa: isso
 * resolve o caso de uma resposta certa chegar no mesmo instante em que o monstro alcança o elfo
 * (vale a que chegar primeiro, e a outra é ignorada).
 */
export function mathGameReducer(state: MathGameState, action: Action): MathGameState {
  switch (action.type) {
    case 'answer':
      if (state.phase !== 'walking' || state.wrongOptions.includes(action.value)) {
        return state;
      }
      return action.value === state.equation.answer
        ? { ...state, score: state.score + 1, phase: 'leaving' }
        : // Resposta errada não tira vida: só gasta o tempo do monstro (RN-281)
          { ...state, wrongOptions: [...state.wrongOptions, action.value] };
    case 'monsterReached':
      return state.phase === 'walking'
        ? { ...state, lives: state.lives - 1, phase: 'leaving' }
        : state;
    case 'monsterGone':
      if (state.phase !== 'leaving') {
        return state;
      }
      return state.lives === 0
        ? { ...state, phase: 'over' }
        : {
            ...state,
            monsterId: state.monsterId + 1,
            equation: action.nextEquation,
            wrongOptions: [],
            phase: 'walking',
          };
    case 'restart':
      return { ...initialMathGameState(action.nextEquation), monsterId: state.monsterId + 1 };
  }
}

/**
 * Estado e regras de uma partida do Elfo Matemático. A caminhada do monstro fica na tela
 * (useMonsterWalk), que avisa aqui quando ele alcançou o elfo e quando terminou de sumir. Nada é
 * salvo: a partida existe só enquanto a tela está aberta (RN-286).
 */
export function useMathGame(difficulty: GameDifficulty) {
  const [state, dispatch] = useReducer(mathGameReducer, difficulty, (level) =>
    initialMathGameState(generateEquation(level)),
  );
  const currentText = state.equation.text;

  const selectAnswer = useCallback((value: number) => dispatch({ type: 'answer', value }), []);
  const monsterReached = useCallback(() => dispatch({ type: 'monsterReached' }), []);
  const monsterGone = useCallback(
    () =>
      dispatch({ type: 'monsterGone', nextEquation: generateEquation(difficulty, currentText) }),
    [difficulty, currentText],
  );
  const restart = useCallback(
    () => dispatch({ type: 'restart', nextEquation: generateEquation(difficulty, currentText) }),
    [difficulty, currentText],
  );

  return {
    ...state,
    /** Algo seria perdido ao sair: monstro derrotado ou vida perdida (RN-285) */
    hasProgress: state.score > 0 || state.lives < MATH_GAME_CONFIG.lives,
    selectAnswer,
    monsterReached,
    monsterGone,
    restart,
  };
}
