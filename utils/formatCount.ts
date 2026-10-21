import { formatThousands } from '@/utils/formatNumber';

/**
 * Quantidade com a palavra no singular (exatamente 1) ou no plural, com ponto de milhar só a
 * partir de 1.000. Ex.: formatCount(1, { one: 'card', other: 'cards' }) -> "1 card",
 * formatCount(53, ...) -> "53 cards", formatCount(1250, ...) -> "1.250 cards".
 */
export function formatCount(count: number, labels: { one: string; other: string }): string {
  return `${formatThousands(count)} ${count === 1 ? labels.one : labels.other}`;
}
