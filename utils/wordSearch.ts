import type { WordSearchLevel, WordSearchQuestion } from '@/constants/games';
import { normalizeSearch } from '@/utils/normalizeSearch';
import { shuffle } from '@/utils/shuffle';

/** Uma pergunta na grade: `letters` é a resposta como aparece nela */
export type PuzzleQuestion = WordSearchQuestion & { letters: string };

/** Um caça-palavras: as letras ficam numa lista só, linha por linha (`size` x `size`) */
export type WordSearchPuzzle = {
  size: number;
  letters: string[];
  questions: PuzzleQuestion[];
};

/** Letras do preenchimento: o alfabeto sem K, W e Y, raras em português */
const FILL_LETTERS = 'ABCDEFGHIJLMNOPQRSTUVXZ';
/** Tentativas de achar lugar para uma palavra antes de recomeçar a grade */
const TRIES_PER_WORD = 200;
/** Grades recomeçadas antes de desistir (só acontece com uma resposta maior que a grade) */
const MAX_GRIDS = 50;

const randomInt = (max: number) => Math.floor(Math.random() * max);

/** A resposta como aparece na grade: maiúsculas e sem acentos. Ex.: "coração" -> "CORACAO" */
export function answerLetters(answer: string): string {
  return normalizeSearch(answer).toUpperCase();
}

/**
 * Tenta colocar a palavra na grade: sorteia a direção e o começo, e aceita se couber sem brigar com
 * as letras que já estão lá (palavras podem se cruzar numa letra igual).
 */
function placeWord(grid: (string | null)[], word: string, level: WordSearchLevel): boolean {
  const { size, directions } = level;
  for (let attempt = 0; attempt < TRIES_PER_WORD; attempt += 1) {
    const [rowStep, columnStep] = directions[randomInt(directions.length)];
    const row = randomInt(size);
    const column = randomInt(size);
    const lastRow = row + rowStep * (word.length - 1);
    const lastColumn = column + columnStep * (word.length - 1);
    if (lastRow < 0 || lastRow >= size || lastColumn < 0 || lastColumn >= size) {
      continue;
    }
    const cells = Array.from(
      { length: word.length },
      (_, index) => (row + rowStep * index) * size + column + columnStep * index,
    );
    if (cells.every((cell, index) => grid[cell] === null || grid[cell] === word[index])) {
      cells.forEach((cell, index) => {
        grid[cell] = word[index];
      });
      return true;
    }
  }
  return false;
}

/** Monta um caça-palavras com as perguntas: as respostas escondidas e o resto com letras ao acaso */
export function buildPuzzle(
  questions: WordSearchQuestion[],
  level: WordSearchLevel,
): WordSearchPuzzle {
  const withLetters = questions.map((item) => ({ ...item, letters: answerLetters(item.answer) }));
  // As maiores primeiro: são as mais difíceis de encaixar
  const words = withLetters.map((item) => item.letters).sort((a, b) => b.length - a.length);

  for (let attempt = 0; attempt < MAX_GRIDS; attempt += 1) {
    const grid: (string | null)[] = Array.from({ length: level.size ** 2 }, () => null);
    if (words.every((word) => placeWord(grid, word, level))) {
      return {
        size: level.size,
        letters: grid.map((letter) => letter ?? FILL_LETTERS[randomInt(FILL_LETTERS.length)]),
        questions: withLetters,
      };
    }
  }
  throw new Error(`Não coube na grade de ${level.size}: ${words.join(', ')}`);
}

/**
 * Tira da fila as perguntas do próximo caça-palavras. Quando ela acaba, a lista inteira volta em
 * outra ordem, sem repetir uma pergunta dentro do mesmo caça-palavras.
 */
export function takeQuestions(
  queue: WordSearchQuestion[],
  bank: WordSearchQuestion[],
  count: number,
): { questions: WordSearchQuestion[]; queue: WordSearchQuestion[] } {
  const available =
    queue.length >= count
      ? queue
      : [...queue, ...shuffle(bank.filter((item) => !queue.includes(item)))];
  return { questions: available.slice(0, count), queue: available.slice(count) };
}

/**
 * Casas de uma linha reta entre duas casas, em direção à segunda: horizontal, vertical ou diagonal,
 * a que estiver mais perto do que o dedo fez. Ex.: arrastar quase na horizontal dá uma linha
 * horizontal. A linha nunca sai da grade.
 */
export function lineCells(from: number, to: number, size: number): number[] {
  const fromRow = Math.floor(from / size);
  const fromColumn = from % size;
  const rows = Math.floor(to / size) - fromRow;
  const columns = to % size - fromColumn;
  const absRows = Math.abs(rows);
  const absColumns = Math.abs(columns);

  let rowStep = Math.sign(rows);
  let columnStep = Math.sign(columns);
  if (absColumns >= absRows * 2) {
    rowStep = 0;
  } else if (absRows >= absColumns * 2) {
    columnStep = 0;
  }

  const cells = [from];
  let row = fromRow;
  let column = fromColumn;
  for (let step = 0; step < Math.max(absRows, absColumns); step += 1) {
    row += rowStep;
    column += columnStep;
    if (row < 0 || row >= size || column < 0 || column >= size) {
      break;
    }
    cells.push(row * size + column);
  }
  return cells;
}
