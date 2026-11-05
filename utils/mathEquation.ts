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
 * Fácil: somas e subtrações até 20, sem resultado negativo, e multiplicações simples (2 a 5).
 * A subtração usa hífen: a fonte pixel não tem o sinal de menos (U+2212).
 */
function easy(): Pick<MathEquation, 'text' | 'answer'> {
  return pick([
    () => {
      const a = randomInt(1, 10);
      const b = randomInt(1, 10);
      return { text: `${a} + ${b} = ?`, answer: a + b };
    },
    () => {
      const a = randomInt(2, 20);
      const b = randomInt(1, a - 1);
      return { text: `${a} - ${b} = ?`, answer: a - b };
    },
    () => {
      const a = randomInt(2, 5);
      const b = randomInt(2, 5);
      return { text: `${a} × ${b} = ?`, answer: a * b };
    },
  ])();
}

/** Parte de uma conta do Médio: um número sozinho ou uma multiplicação ou divisão exata */
type MediumTerm = { text: string; value: number; numbers: number };

/** Sorteia uma parte da conta, usando no máximo `maxNumbers` números */
function mediumTerm(maxNumbers: number): MediumTerm {
  if (maxNumbers >= 2 && Math.random() < 0.5) {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    return Math.random() < 0.5
      ? { text: `${a} × ${b}`, value: a * b, numbers: 2 }
      : { text: `${a * b} ÷ ${a}`, value: b, numbers: 2 };
  }
  const value = randomInt(1, 20);
  return { text: String(value), value, numbers: 1 };
}

/**
 * Médio: contas de +, -, × e ÷ com 2 a 4 números, sem variáveis, raízes ou potências. Multiplicações
 * e divisões são resolvidas primeiro, como na matemática, e as divisões são sempre exatas. A
 * subtração só entra se o resultado parcial continuar positivo, então a resposta nunca é negativa.
 */
function medium(): Pick<MathEquation, 'text' | 'answer'> {
  let remaining = randomInt(2, 4);
  const first = mediumTerm(remaining);
  remaining -= first.numbers;
  let text = first.text;
  let answer = first.value;
  while (remaining > 0) {
    const term = mediumTerm(remaining);
    remaining -= term.numbers;
    if (Math.random() < 0.5 && answer - term.value > 0) {
      text += ` - ${term.text}`;
      answer -= term.value;
    } else {
      text += ` + ${term.text}`;
      answer += term.value;
    }
  }
  return { text: `${text} = ?`, answer };
}

/** Equação do 1º grau, em que a resposta é o valor de x (sempre inteiro e positivo) */
function firstDegree(): Pick<MathEquation, 'text' | 'answer'> {
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

/** Potência ao quadrado (bases de 2 a 15) ou ao cubo (bases de 2 a 6) */
function power(): Pick<MathEquation, 'text' | 'answer'> {
  if (Math.random() < 0.5) {
    const base = randomInt(2, 15);
    return { text: `${base}² = ?`, answer: base ** 2 };
  }
  const base = randomInt(2, 6);
  return { text: `${base}³ = ?`, answer: base ** 3 };
}

/**
 * Raiz quadrada ou cúbica, sempre exata (o contrário das potências). A raiz cúbica é escrita com
 * "³√": a fonte pixel tem o ³ e o √, mas não o sinal ∛ (U+221B).
 */
function root(): Pick<MathEquation, 'text' | 'answer'> {
  if (Math.random() < 0.5) {
    const answer = randomInt(2, 15);
    return { text: `√${answer ** 2} = ?`, answer };
  }
  const answer = randomInt(2, 6);
  return { text: `³√${answer ** 3} = ?`, answer };
}

/** Difícil: equações do 1º grau, potências e raízes, com a mesma chance cada um */
function hard(): Pick<MathEquation, 'text' | 'answer'> {
  return pick([firstDegree, power, root])();
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
