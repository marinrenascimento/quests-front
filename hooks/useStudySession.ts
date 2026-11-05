import { useState } from 'react';

import type { DeckCard } from '@/constants/decks';
import type { Difficulty } from '@/constants/study';

type Options = {
  /** Guarda no card a dificuldade que ficou marcada nele */
  onSaveDifficulty: (card: DeckCard, difficulty: Difficulty) => void;
};

/**
 * Estado e regras da revisão: card atual (na ordem da fila recebida, que não muda durante a
 * revisão), lado visível e dificuldade marcada. Começa no primeiro card, de frente e sem
 * dificuldade. Avançar mostra sempre a frente do próximo card e limpa a dificuldade; depois do
 * último, a revisão termina. O que fica marcado ao sair do card é guardado nele (saveMark); o
 * progresso da revisão existe só enquanto a tela está aberta.
 */
export function useStudySession(cards: DeckCard[], { onSaveDifficulty }: Options) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const finished = index >= cards.length;
  const card = finished ? null : cards[index];

  const saveMark = () => {
    if (card && difficulty) {
      onSaveDifficulty(card, difficulty);
    }
  };

  return {
    /** Card atual (null quando a revisão terminou) */
    card,
    /** Posição do card atual; ao terminar, é a quantidade de cards revisados */
    index,
    /** true: mostrando o verso */
    flipped,
    difficulty,
    finished,
    // TODO: animação de virar o card.
    flip: () => setFlipped((current) => !current),
    /** Marca a dificuldade (só uma por vez); tocar na já marcada desmarca */
    selectDifficulty: (value: Difficulty) =>
      setDifficulty((current) => (current === value ? null : value)),
    /** Guarda a dificuldade marcada no card atual; chamado também ao sair da revisão no meio */
    saveMark,
    // TODO: salvar o progresso da revisão (back).
    next: () => {
      saveMark();
      setIndex((current) => Math.min(current + 1, cards.length));
      setFlipped(false);
      setDifficulty(null);
    },
  };
}

export type StudySession = ReturnType<typeof useStudySession>;
