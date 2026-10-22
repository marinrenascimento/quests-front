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
  /** Disciplina e conteúdo do card (ids do catálogo de constants/mockSubjects + criados no app) */
  disciplineId: string;
  contentId: string;
};

/** Disciplina que pode ser escolhida ao cadastrar um card (ex.: "História") */
export type Discipline = {
  id: string;
  name: string;
};

/** Conteúdo de uma disciplina (ex.: "Guerra Fria", de História) */
export type DisciplineContent = {
  id: string;
  disciplineId: string;
  name: string;
};

/** Card cadastrado no Novo Flashcard e vinculado ao deck em criação */
export type LinkedCard = {
  id: string;
  discipline: Discipline;
  content: DisciplineContent;
  front: string;
  back: string;
};

/** Rótulo "Disciplina - Tema" mostrado em cada card do deck */
export function deckSubjectLabel(deck: Deck): string {
  return `${deck.discipline} - ${deck.title}`;
}

/** Rótulo "Disciplina - Conteúdo" mostrado em cada card vinculado */
export function linkedCardLabel(card: LinkedCard): string {
  return `${card.discipline.name} - ${card.content.name}`;
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
  /** Botões que aparecem depois do primeiro card vinculado */
  saveLabel: 'Salvar',
  cancelLabel: 'Cancelar',
};

/** Modal de confirmação ao cancelar o cadastro de deck: sem texto em destaque */
export const CANCEL_DECK_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Cancelar o Cadastro Desse Deck?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

export type DeckFormContent = typeof DECK_FORM_CONTENT;

/** Toast mostrado no cadastro de deck depois de salvar um card */
export const LINKED_CARD_TOAST = 'Card Vinculado com Sucesso!';

/** Textos da tela Novo Flashcard (o título é exibido em caixa alta pelo componente) */
export const FLASHCARD_FORM_CONTENT = {
  title: 'Novo Flashcard',
  disciplineLabel: 'Disciplina',
  disciplinePlaceholder: 'Pesquise ou Crie uma Disciplina',
  disciplineRequired: 'Informe a Disciplina.',
  /** Ação da lista quando nenhuma disciplina corresponde ao texto digitado */
  createDiscipline: (text: string) => `Criar Disciplina "${text}"`,
  contentLabel: 'Conteúdo',
  contentPlaceholder: 'Pesquise ou Crie um Conteúdo',
  /** Placeholder do conteúdo enquanto nenhuma disciplina foi escolhida */
  contentDisabledPlaceholder: 'Escolha uma Disciplina Primeiro',
  contentRequired: 'Informe o Conteúdo.',
  createContent: (text: string) => `Criar Conteúdo "${text}"`,
  /** Lista aberta sem opções e sem texto digitado (disciplina sem conteúdos) */
  noOptions: 'Nenhum Item Cadastrado. Digite para Criar.',
  frontLabel: 'Frente do Card',
  frontPlaceholder: 'Digite a Pergunta da Frente do Card',
  frontRequired: 'Informe a Frente do Card.',
  // "backSide" para não confundir com o rótulo do botão voltar (BACK_LABEL)
  backSideLabel: 'Verso do Card',
  backSidePlaceholder: 'Digite a Resposta do Verso do Card',
  backSideRequired: 'Informe o Verso do Card.',
  saveLabel: 'Salvar',
  cancelLabel: 'Cancelar',
};

export type FlashcardFormContent = typeof FLASHCARD_FORM_CONTENT;

/**
 * Textos da tela Editar Flashcard: os mesmos campos e botões do Novo Flashcard, com outro título
 * e a mensagem de card inexistente
 */
export const EDIT_FLASHCARD_CONTENT = {
  ...FLASHCARD_FORM_CONTENT,
  title: 'Editar Flashcard',
  notFoundMessage: 'Card Não Encontrado',
};

/** Modal de confirmação ao cancelar (ou voltar de) o Novo Flashcard: sem texto em destaque */
export const CANCEL_CARD_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Cancelar a Criação Desse Card?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

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
