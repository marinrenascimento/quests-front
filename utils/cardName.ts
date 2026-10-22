import type { DeckCard } from '@/constants/decks';

/** Máximo de caracteres do nome antes das reticências */
const MAX_LENGTH = 30;
/** Três pontos (e não "…"): a fonte pixel dos títulos não tem o caractere de reticências */
const ELLIPSIS = '...';

/**
 * Nome do card mostrado no título do Visualizar Card: o mesmo título da grade de Cards do Deck
 * (nos cards criados no app, é a frente). Só na exibição, é cortado em MAX_LENGTH caracteres com
 * reticências; o título guardado no card não muda.
 */
export function cardName(card: Pick<DeckCard, 'title'>): string {
  const title = card.title.trim();
  return title.length > MAX_LENGTH ? `${title.slice(0, MAX_LENGTH).trimEnd()}${ELLIPSIS}` : title;
}
