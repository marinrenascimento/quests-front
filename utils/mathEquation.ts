import { MATH_GAME_CONFIG, type GameDifficulty } from '@/constants/games';
import { shuffle } from '@/utils/shuffle';

/** Uma equação do Elfo Matemático: o texto mostrado, a resposta e as opções de resposta */
export type MathEquation = {
  /** Ex.: "7 + 5 = ?" ou "3x + 4 = 19" */
  text: string;
  answer: number;
  /** A resposta certa e as erradas, em ordem aleatória e sem repetir */
  options: number[];
};

/** Maior distância entre uma resposta errada e a certa (erradas próximas não dão a resposta) */
const MAX_WRONG_DISTANCE = 4;

/** Número inteiro aleatório de min a max, incluindo os dois */
function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

/** Uma das opções, ao acaso */
function pick<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

/**
 * Fácil: somas e subtrações até 20, sem resultado negativo.
 * A subtração usa hífen: a fonte pixel não tem o sinal de menos (U+2212).
 */
function easy(): Pick<MathEquation, 'text' | 'answer'> {
  if (Math.random() < 0.5) {
    const a = randomInt(1, 10);
    const b = randomInt(1, 10);
    return { text: `${a} + ${b} = ?`, answer: a + b };
  }
  const a = randomInt(2, 20);
  const b = randomInt(1, a - 1);
  return { text: `${a} - ${b} = ?`, answer: a - b };
}

/** Médio: tabuada (× e ÷, com divisão exata) ou somas e subtrações com dois algarismos, até 99 */
function medium(): Pick<MathEquation, 'text' | 'answer'> {
  return pick([
    () => {
      const a = randomInt(2, 9);
      const b = randomInt(2, 9);
      return { text: `${a} × ${b} = ?`, answer: a * b };
    },
    () => {
      const divisor = randomInt(2, 9);
      const answer = randomInt(2, 9);
      return { text: `${divisor * answer} ÷ ${divisor} = ?`, answer };
    },
    () => {
      const a = randomInt(10, 60);
      const b = randomInt(10, 39);
      return { text: `${a} + ${b} = ?`, answer: a + b };
    },
    () => {
      const a = randomInt(20, 99);
      const b = randomInt(10, a - 1);
      return { text: `${a} - ${b} = ?`, answer: a - b };
    },
  ])();
}

/** Difícil: equações do 1º grau, em que a resposta é o valor de x (sempre inteiro e positivo) */
function hard(): Pick<MathEquation, 'text' | 'answer'> {
  const a = randomInt(2, 9);
  const answer = randomInt(2, 12);
  if (Math.random() < 0.5) {
    const b = randomInt(1, 20);
    return { text: `${a}x + ${b} = ${a * answer + b}`, answer };
  }
  // O lado direito não fica negativo nem zero
  const b = randomInt(1, Math.min(20, a * answer - 1));
  return { text: `${a}x - ${b} = ${a * answer - b}`, answer };
}

const GENERATORS: Record<GameDifficulty, () => Pick<MathEquation, 'text' | 'answer'>> = {
  facil: easy,
  medio: medium,
  dificil: hard,
};

/** A resposta certa e as erradas, próximas dela e sem números negativos, em ordem aleatória */
function buildOptions(answer: number): number[] {
  const distances = Array.from({ length: MAX_WRONG_DISTANCE }, (_, index) => index + 1);
  const wrong = shuffle(distances.flatMap((distance) => [answer - distance, answer + distance]))
    .filter((value) => value >= 0)
    .slice(0, MATH_GAME_CONFIG.optionsCount - 1);
  return shuffle([answer, ...wrong]);
}

/**
 * Sorteia uma equação do nível. `previousText` é a equação do monstro anterior: ela não se repete
 * logo em seguida.
 */
export function generateEquation(difficulty: GameDifficulty, previousText?: string): MathEquation {
  let equation = GENERATORS[difficulty]();
  while (equation.text === previousText) {
    equation = GENERATORS[difficulty]();
  }
  return { ...equation, options: buildOptions(equation.answer) };
}
