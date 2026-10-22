import type { DeckCard } from '@/constants/decks';

/** Máximo de caracteres do nome antes das reticências */
const MAX_LENGTH = 30;
/** Três pontos (e não "…"): a fonte pixel dos títulos não tem o caractere de reticências */
const ELLIPSIS = '...';

/**
 * Nome curto para o título das telas de visualização: cortado em MAX_LENGTH caracteres com
 * reticências (só na exibição; o texto guardado não muda).
 */
export function shortName(text: string): string {
  const name = text.trim();
  return name.length > MAX_LENGTH ? `${name.slice(0, MAX_LENGTH).trimEnd()}${ELLIPSIS}` : name;
}

/** Nome do card mostrado no título do Visualizar Card: a frente, já que o card não tem título */
export function cardName(card: Pick<DeckCard, 'front'>): string {
  return shortName(card.front);
}
