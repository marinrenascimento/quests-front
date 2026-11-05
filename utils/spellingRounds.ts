import type { SpellingWord } from '@/constants/games';
import { shuffle } from '@/utils/shuffle';

/** Uma rodada do Goblin Ortográfico: a palavra e as 3 opções, já em ordem aleatória */
export type SpellingRound = {
  correct: string;
  shown: string;
  options: string[];
};

/**
 * Todas as palavras em ordem aleatória, cada uma uma vez, com as opções embaralhadas. Quando a lista
 * acaba, a partida pede outra. `previousCorrect` é a última palavra da lista anterior: ela não abre
 * a lista nova, para a mesma palavra não vir duas vezes seguidas.
 */
export function buildRounds(words: SpellingWord[], previousCorrect?: string): SpellingRound[] {
  const order = shuffle(words);
  if (order.length > 1 && order[0].correct === previousCorrect) {
    [order[0], order[1]] = [order[1], order[0]];
  }
  return order.map(({ correct, shown, wrong }) => ({
    correct,
    shown,
    options: shuffle([correct, ...wrong]),
  }));
}
