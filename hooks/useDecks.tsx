import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { Deck, DeckCard, LinkedCard } from '@/constants/decks';
import { getMockDeckCards } from '@/constants/mockDeckCards';
import { MOCK_DECKS } from '@/constants/mockDecks';
import { slugify } from '@/utils/normalizeSearch';

/** Dados do cadastro de deck no momento de salvar */
type NewDeck = {
  title: string;
  description: string;
  cards: LinkedCard[];
};

type DecksData = {
  /** Decks criados nesta sessão (os mais novos primeiro) seguidos dos fictícios */
  decks: Deck[];
  /**
   * Cards de um deck: os guardados em memória se o deck foi criado aqui ou recebeu cards novos;
   * senão, os fictícios
   */
  getDeckCards: (deck: Deck) => DeckCard[];
  /** Cria o deck em memória com id local único e devolve o deck criado */
  createDeck: (deck: NewDeck) => Deck;
  /**
   * Adiciona um card no fim de um deck que já existe (fictício ou criado) e pede o toast de
   * sucesso em Cards do Deck
   */
  addCardToDeck: (deckId: string, card: Omit<LinkedCard, 'id'>) => void;
  /**
   * Troca a disciplina, o conteúdo, a frente e o verso de um card de qualquer deck (fictício ou
   * criado), mantendo a posição e o id
   */
  updateCard: (deckId: string, cardId: string, card: CardEdit) => void;
  /**
   * Estudo por disciplina em andamento: deck temporário (nome "Disciplina - Conteúdo" e os cards
   * sorteados), que não entra em `decks` nem é salvo. null: nenhum estudo configurado.
   */
  disciplineStudy: DisciplineStudy | null;
  /** Guarda o deck temporário que a revisão do estudo por disciplina vai mostrar */
  startDisciplineStudy: (study: DisciplineStudy) => void;
  /** Deck cujo Cards do Deck deve mostrar o toast "Card Vinculado com Sucesso!" (ou null) */
  cardAddedToastDeckId: string | null;
  hideCardAddedToast: () => void;
};

/** Deck temporário do estudo por disciplina */
export type DisciplineStudy = {
  title: string;
  cards: DeckCard[];
};

const DecksContext = createContext<DecksData | null>(null);

/**
 * Disciplina do deck criado: as dos cards vinculados, sem repetir, na ordem em que aparecem
 * (ex.: "História, Física"). O deck tem uma disciplina só e o rótulo "Disciplina - Tema" é o
 * mesmo em todos os cards.
 */
// TODO: confirmar a regra da disciplina de um deck com cards de disciplinas diferentes.
function deckDiscipline(cards: LinkedCard[]): string {
  return Array.from(new Set(cards.map((card) => card.discipline.name))).join(', ');
}

/** Card de um deck a partir de um card do Novo Flashcard: o título exibido é a frente */
function toDeckCard(deckId: string, position: number, card: Omit<LinkedCard, 'id'>): DeckCard {
  return {
    // Mesmo formato dos ids fictícios (deck-posição): o próximo número nunca se repete
    id: `${deckId}-${position}`,
    deckId,
    title: card.front,
    front: card.front,
    back: card.back,
    disciplineId: card.discipline.id,
    contentId: card.content.id,
  };
}

/** Valores do card que podem ser editados (os do formulário, já conferidos) */
export type CardEdit = Omit<LinkedCard, 'id'>;

/**
 * Lista de cards guardada de um deck ou, se ele ainda não tem lista em memória (deck fictício
 * sem alterações), os cards gerados para ele
 */
function storedCards(cardsByDeck: Record<string, DeckCard[]>, deckId: string): DeckCard[] {
  const mockDeck = MOCK_DECKS.find((deck) => deck.id === deckId);
  return cardsByDeck[deckId] ?? (mockDeck ? getMockDeckCards(mockDeck) : []);
}

type Props = {
  children: ReactNode;
};

/**
 * Fonte única dos decks e cards lidos por Meus Decks, Cards do Deck e a revisão: os fictícios
 * (constants/mock*) mais os criados no cadastro de deck e os cards adicionados depois, tudo em
 * memória. Envolve a pilha de Meus Decks (app/(tabs)/decks/_layout.tsx), que continua montada
 * enquanto o app está aberto.
 */
// TODO: substituir pelos decks e cards do back e persistir os decks e cards criados.
export function DecksProvider({ children }: Props) {
  const [createdDecks, setCreatedDecks] = useState<Deck[]>([]);
  // Lista completa de cards dos decks criados ou alterados, por id do deck. Cada lista só muda
  // quando o deck recebe um card (referência estável para as telas)
  const [cardsByDeck, setCardsByDeck] = useState<Record<string, DeckCard[]>>({});
  const [cardAddedToastDeckId, setCardAddedToastDeckId] = useState<string | null>(null);
  // TODO: registrar a sessão de estudo por disciplina no back.
  const [disciplineStudy, setDisciplineStudy] = useState<DisciplineStudy | null>(null);

  // A contagem continua derivada da lista de cards quando o deck tem cards em memória
  const decks = useMemo(
    () =>
      [...createdDecks, ...MOCK_DECKS].map((deck) => {
        const cards = cardsByDeck[deck.id];
        return cards && cards.length !== deck.cardsCount
          ? { ...deck, cardsCount: cards.length }
          : deck;
      }),
    [createdDecks, cardsByDeck],
  );

  const getDeckCards = useCallback(
    (deck: Deck) => cardsByDeck[deck.id] ?? getMockDeckCards(deck),
    [cardsByDeck],
  );

  const createDeck = useCallback(({ title, description, cards }: NewDeck) => {
    const id = `deck-${slugify(title) || 'novo'}-${Date.now().toString(36)}`;
    const deck: Deck = {
      id,
      title,
      description,
      discipline: deckDiscipline(cards),
      // Derivada da lista: fonte única da contagem, como nos decks fictícios
      cardsCount: cards.length,
    };
    setCreatedDecks((prev) => [deck, ...prev]);
    setCardsByDeck((prev) => ({
      ...prev,
      [id]: cards.map((card, index) => toDeckCard(id, index + 1, card)),
    }));
    return deck;
  }, []);

  const addCardToDeck = useCallback((deckId: string, card: Omit<LinkedCard, 'id'>) => {
    setCardsByDeck((prev) => {
      // Primeiro card novo de um deck fictício: parte dos cards gerados para ele
      const current = storedCards(prev, deckId);
      return { ...prev, [deckId]: [...current, toDeckCard(deckId, current.length + 1, card)] };
    });
    setCardAddedToastDeckId(deckId);
  }, []);

  const updateCard = useCallback((deckId: string, cardId: string, card: CardEdit) => {
    setCardsByDeck((prev) => ({
      ...prev,
      [deckId]: storedCards(prev, deckId).map((item) =>
        item.id === cardId
          ? {
              ...item,
              // Card sem título próprio (criado no app: o título é a frente) acompanha a frente;
              // os fictícios mantêm o título deles
              // TODO: confirmar a regra do título do card editado.
              title: item.title === item.front ? card.front : item.title,
              front: card.front,
              back: card.back,
              disciplineId: card.discipline.id,
              contentId: card.content.id,
            }
          : item,
      ),
    }));
  }, []);

  const hideCardAddedToast = useCallback(() => setCardAddedToastDeckId(null), []);

  const value = useMemo(
    () => ({
      decks,
      getDeckCards,
      createDeck,
      addCardToDeck,
      updateCard,
      disciplineStudy,
      startDisciplineStudy: setDisciplineStudy,
      cardAddedToastDeckId,
      hideCardAddedToast,
    }),
    [
      decks,
      getDeckCards,
      createDeck,
      addCardToDeck,
      updateCard,
      disciplineStudy,
      cardAddedToastDeckId,
      hideCardAddedToast,
    ],
  );

  return <DecksContext.Provider value={value}>{children}</DecksContext.Provider>;
}

/** Decks e cards em memória. Só funciona dentro do DecksProvider. */
export function useDecks(): DecksData {
  const context = useContext(DecksContext);
  if (!context) {
    throw new Error('useDecks precisa estar dentro do DecksProvider.');
  }
  return context;
}
