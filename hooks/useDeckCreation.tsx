import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { Discipline, DisciplineContent, LinkedCard } from '@/constants/decks';
import { MOCK_DISCIPLINE_CONTENTS, MOCK_DISCIPLINES } from '@/constants/mockSubjects';
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
  /** Disciplinas e conteúdos que podem ser escolhidos (o mock + os criados na hora) */
  disciplines: Discipline[];
  contents: DisciplineContent[];
  /** Criam com o nome digitado e devolvem o item criado, para já selecioná-lo */
  addDiscipline: (name: string) => Discipline;
  addContent: (disciplineId: string, name: string) => DisciplineContent;
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
 * Novo Flashcard (que abre por cima dele): o rascunho do deck, os cards vinculados e o catálogo
 * de disciplinas e conteúdos. Envolve a pilha de Meus Decks (app/(tabs)/decks/_layout.tsx).
 */
// TODO: persistir o deck, os cards e as disciplinas/conteúdos criados quando o back existir.
export function DeckCreationProvider({ children }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [linkedCards, setLinkedCards] = useState<LinkedCard[]>([]);
  const [linkedToastVisible, setLinkedToastVisible] = useState(false);
  const [disciplines, setDisciplines] = useState<Discipline[]>(MOCK_DISCIPLINES);
  const [contents, setContents] = useState<DisciplineContent[]>(MOCK_DISCIPLINE_CONTENTS);

  const addLinkedCard = useCallback((card: Omit<LinkedCard, 'id'>) => {
    setLinkedCards((prev) => [...prev, { ...card, id: createdId('card') }]);
    setLinkedToastVisible(true);
  }, []);

  const hideLinkedToast = useCallback(() => setLinkedToastVisible(false), []);

  const addDiscipline = useCallback((disciplineName: string) => {
    const discipline = { id: createdId(disciplineName), name: disciplineName };
    setDisciplines((prev) => [...prev, discipline]);
    return discipline;
  }, []);

  const addContent = useCallback((disciplineId: string, contentName: string) => {
    const content = { id: createdId(contentName), disciplineId, name: contentName };
    setContents((prev) => [...prev, content]);
    return content;
  }, []);

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
      disciplines,
      contents,
      addDiscipline,
      addContent,
      resetDraft,
    }),
    [
      name,
      description,
      linkedCards,
      addLinkedCard,
      linkedToastVisible,
      hideLinkedToast,
      disciplines,
      contents,
      addDiscipline,
      addContent,
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
