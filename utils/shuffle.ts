/**
 * Cópia da lista em ordem aleatória (embaralhamento de Fisher-Yates), sem alterar a original e
 * sem repetir itens. Ex.: shuffle([1, 2, 3]) -> [3, 1, 2].
 */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
