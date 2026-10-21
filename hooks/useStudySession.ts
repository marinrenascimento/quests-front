import { useState } from 'react';

import type { DeckCard } from '@/constants/decks';
import type { Difficulty } from '@/constants/study';

/**
 * Estado e regras da revisão de um deck: card atual (na ordem da lista), lado visível e
 * dificuldade marcada. Começa no primeiro card, de frente e sem dificuldade. Avançar mostra
 * sempre a frente do próximo card e limpa a dificuldade; depois do último, a revisão termina.
 * Nada é salvo: o progresso existe só enquanto a tela está aberta.
 */
export function useStudySession(cards: DeckCard[]) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const finished = index >= cards.length;

  return {
    /** Card atual (null quando a revisão terminou ou o deck não tem cards) */
    card: finished ? null : cards[index],
    /** Posição do card atual; ao terminar, é a quantidade de cards revisados */
    index,
    total: cards.length,
    /** true: mostrando o verso */
    flipped,
    difficulty,
    finished,
    // TODO: animação de virar o card.
    flip: () => setFlipped((current) => !current),
    /** Marca a dificuldade (só uma por vez); tocar na já marcada desmarca */
    // TODO: salvar a dificuldade escolhida de cada card (back).
    selectDifficulty: (value: Difficulty) =>
      setDifficulty((current) => (current === value ? null : value)),
    // TODO: salvar o progresso da revisão (back).
    next: () => {
      setIndex((current) => Math.min(current + 1, cards.length));
      setFlipped(false);
      setDifficulty(null);
    },
  };
}

export type StudySession = ReturnType<typeof useStudySession>;
