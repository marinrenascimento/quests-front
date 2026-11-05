import type { DeckCard } from '@/constants/decks';
import { REVIEW_APPEARANCES } from '@/constants/study';

/** Quantas vezes o card aparece na revisão, pela dificuldade salva nele (sem ela: 1 vez) */
function appearances(card: DeckCard): number {
  return (card.difficulty && REVIEW_APPEARANCES[card.difficulty]) ?? 1;
}

/**
 * Posição da fila onde o card entra sem ficar ao lado de outra cópia dele: a primeira depois de
 * `from` ou, se não houver, a mais próxima antes. A posição 0 fica de fora (é sempre a do primeiro
 * card da lista). Sem nenhuma, devolve -1.
 */
function findGap(queue: DeckCard[], cardId: string, from: number): number {
  const fits = (position: number) =>
    queue[position - 1].id !== cardId && queue[position]?.id !== cardId;
  for (let position = from + 1; position <= queue.length; position += 1) {
    if (fits(position)) {
      return position;
    }
  }
  for (let position = from; position >= 1; position -= 1) {
    if (fits(position)) {
      return position;
    }
  }
  return -1;
}

/**
 * Fila da revisão de um deck (RN-171): cada card entra quantas vezes a dificuldade salva nele
 * manda, a ordem base é a da lista e as repetições ficam espalhadas pela revisão inteira.
 *
 * Cada aparição ganha uma posição relativa (de 0 a 1): as de um card ficam a intervalos iguais, e
 * os cards que aparecem uma vez só mantêm a ordem da lista. A revisão sempre começa pelo primeiro
 * card da lista (RN-070). Depois, a cópia que ficou logo depois de outra igual muda para um lugar
 * entre outros cards; sem nenhum, ela vai para o fim e o card vem seguido, porque as repetições
 * não são descartadas. Ex.: A, B (Difícil), C -> A, B, C, B, B.
 */
export function buildReviewQueue(cards: DeckCard[]): DeckCard[] {
  if (cards.every((card) => appearances(card) === 1)) {
    return cards;
  }

  const queue = cards
    .flatMap((card, listIndex) => {
      const total = appearances(card);
      return Array.from({ length: total }, (_, copy) => ({
        card,
        // O primeiro card da lista abre a revisão
        position:
          listIndex === 0 && copy === 0 ? -1 : (copy + (listIndex + 0.5) / cards.length) / total,
      }));
    })
    .sort((a, b) => a.position - b.position)
    .map((item) => item.card);

  for (let index = 1; index < queue.length; index += 1) {
    if (queue[index].id === queue[index - 1].id) {
      const [copy] = queue.splice(index, 1);
      const gap = findGap(queue, copy.id, index);
      queue.splice(gap === -1 ? queue.length : gap, 0, copy);
      if (gap !== -1) {
        // Outro card veio para esta posição: confere de novo
        index -= 1;
      }
    }
  }
  return queue;
}
