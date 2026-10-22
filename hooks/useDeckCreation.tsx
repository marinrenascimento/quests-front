import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { LinkedCard } from '@/constants/decks';
import { slugify } from '@/utils/normalizeSearch';

type DeckCreation = {
  /** Rascunho do deck em criação (campos do cadastro de deck) */
  name: string;
  description: string;
  setName: (text: string) => void;
  setDescription: (text: string) => void;
  /** Cards salvos no Novo Flashcard, na ordem em que foram criados */
  linkedCards: LinkedCard[];
  /** Vincula o card ao rascunho e pede o toast de sucesso no cadastro de deck */
  addLinkedCard: (card: Omit<LinkedCard, 'id'>) => void;
  /** Toast "Card Vinculado com Sucesso!" pendente: o cadastro de deck mostra e chama hide */
  linkedToastVisible: boolean;
  hideLinkedToast: () => void;
  /** Descarta o rascunho (nome, descrição, cards e toast); as disciplinas criadas continuam */
  resetDraft: () => void;
};

const DeckCreationContext = createContext<DeckCreation | null>(null);

/** Id único para um item criado na hora: nome + instante (o back definirá o id real) */
const createdId = (name: string) => `${slugify(name) || 'item'}-${Date.now().toString(36)}`;

type Props = {
  children: ReactNode;
};

/**
 * Estado em memória do fluxo de criação de deck, compartilhado entre o cadastro de deck e o
 * Novo Flashcard (que abre por cima dele): o rascunho do deck e os cards vinculados. O catálogo
 * de disciplinas e conteúdos fica no SubjectsProvider (compartilhado com as provas). Envolve a
 * pilha de Meus Decks (app/(tabs)/decks/_layout.tsx).
 */
// TODO: persistir o deck e os cards criados quando o back existir.
export function DeckCreationProvider({ children }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linkedCards, setLinkedCards] = useState<LinkedCard[]>([]);
  const [linkedToastVisible, setLinkedToastVisible] = useState(false);

  const addLinkedCard = useCallback((card: Omit<LinkedCard, 'id'>) => {
    setLinkedCards((prev) => [...prev, { ...card, id: createdId('card') }]);
    setLinkedToastVisible(true);
  }, []);

  const hideLinkedToast = useCallback(() => setLinkedToastVisible(false), []);

  const resetDraft = useCallback(() => {
    setName('');
    setDescription('');
    setLinkedCards([]);
    setLinkedToastVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      name,
      description,
      setName,
      setDescription,
      linkedCards,
      addLinkedCard,
      linkedToastVisible,
      hideLinkedToast,
      resetDraft,
    }),
    [
      name,
      description,
      linkedCards,
      addLinkedCard,
      linkedToastVisible,
      hideLinkedToast,
      resetDraft,
    ],
  );

  return <DeckCreationContext.Provider value={value}>{children}</DeckCreationContext.Provider>;
}

/** Estado do fluxo de criação de deck. Só funciona dentro do DeckCreationProvider. */
export function useDeckCreation(): DeckCreation {
  const context = useContext(DeckCreationContext);
  if (!context) {
    throw new Error('useDeckCreation precisa estar dentro do DeckCreationProvider.');
  }
  return context;
}
