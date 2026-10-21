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
  /** Frente do card na revisão: uma pergunta curta */
  front: string;
  /** Verso do card na revisão: a resposta */
  back: string;
};

/** Rótulo "Disciplina - Tema" mostrado em cada card do deck */
export function deckSubjectLabel(deck: Deck): string {
  return `${deck.discipline} - ${deck.title}`;
}

/** Textos da tela Meus Decks (o título é exibido em caixa alta pelo componente) */
export const DECKS_CONTENT = {
  title: 'Meus Decks',
  createLabel: 'Criar Novo Deck',
  studyLabel: 'Estudar por Disciplina',
  emptyMessage: 'Nenhum Deck Encontrado',
};

/** Palavra da quantidade de cards, no singular e no plural (exibida em caixa alta) */
export const CARDS_COUNT_LABELS = { one: 'Card', other: 'Cards' };

/** Textos da tela de cards de um deck */
export const DECK_CARDS_CONTENT = {
  studyLabel: 'Estudar Agora',
  addLabel: 'Adicionar Card',
  emptyMessage: 'Nenhum Card Neste Deck',
  notFoundMessage: 'Deck Não Encontrado',
};

/** Textos da tela de cadastro de deck (o título é exibido em caixa alta pelo componente) */
export const DECK_FORM_CONTENT = {
  title: 'Cadastro de Deck',
  addCardLabel: 'Cadastrar Novo Card +',
  nameLabel: 'Nome do Deck',
  namePlaceholder: 'Digite o Nome do Deck',
  nameRequired: 'Informe o Nome do Deck.',
  descriptionLabel: 'Descrição do Deck',
  descriptionPlaceholder: 'Descreva o Conteúdo do Deck',
  linkedCardsLabel: 'Cards Vinculados',
  linkedCardsEmpty: 'Nenhum Card Foi Cadastrado Ainda...',
};

export type DeckFormContent = typeof DECK_FORM_CONTENT;

/** Modal de confirmação ao tocar na lixeira de um card (o destaque é o título do card) */
export const DELETE_CARD_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Excluir o Card:',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
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
  { key: 'edit', icon: 'pencil', label: 'Editar Card' },
  { key: 'delete', icon: 'trash-can-outline', label: 'Excluir Card' },
  { key: 'view', icon: 'eye-outline', label: 'Visualizar Card' },
];
