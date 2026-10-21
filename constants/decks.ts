import type { IconName } from '@/constants/helpContent';

/** Um deck de flashcards do usuário */
export type Deck = {
  id: string;
  title: string;
  description: string;
  /** Disciplina do deck (ex.: "História"), mostrada no rótulo dos cards */
  discipline: string;
  /** Quantidade de cards: fonte única da contagem (os cards fictícios são gerados com ela) */
  cardsCount: number;
};

/** Um flashcard de um deck */
export type DeckCard = {
  id: string;
  deckId: string;
  title: string;
};

/** Rótulo "Disciplina - Tema" mostrado em cada card do deck */
export function deckSubjectLabel(deck: Deck): string {
  return `${deck.discipline} - ${deck.title}`;
}

/** Textos da tela Meus Decks (o título é exibido em caixa alta pelo componente) */
export const DECKS_CONTENT = {
  title: 'Meus decks',
  createLabel: 'Criar Novo Deck',
  studyLabel: 'Estudar por Disciplina',
  emptyMessage: 'Nenhum deck encontrado',
};

/** Palavra da quantidade de cards, no singular e no plural (exibida em caixa alta) */
export const CARDS_COUNT_LABELS = { one: 'card', other: 'cards' };

/** Textos da tela de cards de um deck */
export const DECK_CARDS_CONTENT = {
  studyLabel: 'Estudar Agora',
  addLabel: 'Adicionar Card',
  emptyMessage: 'Nenhum card neste deck',
  notFoundMessage: 'Deck não encontrado',
};

export type CardActionKey = 'edit' | 'delete' | 'view';

export type CardAction = {
  key: CardActionKey;
  icon: IconName;
  /** Rótulo de acessibilidade do botão */
  label: string;
};

/** Botões circulares de cada card, na ordem do mockup */
export const CARD_ACTIONS: CardAction[] = [
  { key: 'edit', icon: 'pencil', label: 'Editar card' },
  { key: 'delete', icon: 'trash-can-outline', label: 'Excluir card' },
  { key: 'view', icon: 'eye-outline', label: 'Visualizar card' },
];
