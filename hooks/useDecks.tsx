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
   * Exclui um card de qualquer deck. Se era o último, o deck também é excluído (não existe deck
   * sem cards); nesse caso devolve true, para a tela voltar a Meus Decks.
   */
  deleteCard: (deckId: string, cardId: string) => boolean;
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

/** Card de um deck a partir de um card do Novo Flashcard (o id é único dentro do deck) */
function toDeckCard(deckId: string, cardKey: string, card: Omit<LinkedCard, 'id'>): DeckCard {
  return {
    id: `${deckId}-${cardKey}`,
    deckId,
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
// TODO: substituir pelos decks e cards do back e persistir os decks e cards criados, editados e
// excluídos.
export function DecksProvider({ children }: Props) {
  const [createdDecks, setCreatedDecks] = useState<Deck[]>([]);
  // Decks fictícios excluídos (ao excluir o último card deles)
  const [deletedDeckIds, setDeletedDeckIds] = useState<string[]>([]);
  // Lista completa de cards dos decks criados ou alterados, por id do deck. Cada lista só muda
  // quando o deck recebe um card (referência estável para as telas)
  const [cardsByDeck, setCardsByDeck] = useState<Record<string, DeckCard[]>>({});
  const [cardAddedToastDeckId, setCardAddedToastDeckId] = useState<string | null>(null);
  // TODO: registrar a sessão de estudo por disciplina no back.
  const [disciplineStudy, setDisciplineStudy] = useState<DisciplineStudy | null>(null);

  // A contagem continua derivada da lista de cards quando o deck tem cards em memória
  const decks = useMemo(
    () =>
      [...createdDecks, ...MOCK_DECKS]
        .filter((deck) => !deletedDeckIds.includes(deck.id))
        .map((deck) => {
          const cards = cardsByDeck[deck.id];
          return cards && cards.length !== deck.cardsCount
            ? { ...deck, cardsCount: cards.length }
            : deck;
        }),
    [createdDecks, deletedDeckIds, cardsByDeck],
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
      // Derivada da lista: fonte única da contagem, como nos decks fictícios
      cardsCount: cards.length,
    };
    setCreatedDecks((prev) => [deck, ...prev]);
    setCardsByDeck((prev) => ({
      ...prev,
      // Mesmo formato dos ids fictícios (deck-posição)
      [id]: cards.map((card, index) => toDeckCard(id, String(index + 1), card)),
    }));
    return deck;
  }, []);

  const addCardToDeck = useCallback((deckId: string, card: Omit<LinkedCard, 'id'>) => {
    setCardsByDeck((prev) => {
      // Primeiro card novo de um deck fictício: parte dos cards gerados para ele
      const current = storedCards(prev, deckId);
      // A posição pode se repetir depois de uma exclusão: o id usa o instante da criação
      const added = toDeckCard(deckId, `novo-${Date.now().toString(36)}`, card);
      return { ...prev, [deckId]: [...current, added] };
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
              front: card.front,
              back: card.back,
              disciplineId: card.discipline.id,
              contentId: card.content.id,
            }
          : item,
      ),
    }));
  }, []);

  const deleteCard = useCallback(
    (deckId: string, cardId: string) => {
      const remaining = storedCards(cardsByDeck, deckId).filter((card) => card.id !== cardId);
      if (remaining.length > 0) {
        setCardsByDeck((prev) => ({ ...prev, [deckId]: remaining }));
        return false;
      }
      // Era o último card: o deck sai de Meus Decks
      setCreatedDecks((prev) => prev.filter((deck) => deck.id !== deckId));
      setDeletedDeckIds((prev) => (prev.includes(deckId) ? prev : [...prev, deckId]));
      setCardsByDeck((prev) => {
        const next = { ...prev };
        delete next[deckId];
        return next;
      });
      return true;
    },
    [cardsByDeck],
  );

  const hideCardAddedToast = useCallback(() => setCardAddedToastDeckId(null), []);

  const value = useMemo(
    () => ({
      decks,
      getDeckCards,
      createDeck,
      addCardToDeck,
      updateCard,
      deleteCard,
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
      deleteCard,
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
