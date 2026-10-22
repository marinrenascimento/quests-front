import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { Discipline, DisciplineContent } from '@/constants/decks';
import { MOCK_DISCIPLINE_CONTENTS, MOCK_DISCIPLINES } from '@/constants/mockSubjects';
import { slugify } from '@/utils/normalizeSearch';

type Subjects = {
  /** Disciplinas e conteúdos que podem ser escolhidos (o mock + os criados na hora) */
  disciplines: Discipline[];
  contents: DisciplineContent[];
  /** Criam com o nome digitado e devolvem o item criado, para já selecioná-lo */
  addDiscipline: (name: string) => Discipline;
  addContent: (disciplineId: string, name: string) => DisciplineContent;
};

const SubjectsContext = createContext<Subjects | null>(null);

/** Id único para um item criado na hora: nome + instante (o back definirá o id real) */
const createdId = (name: string) => `${slugify(name) || 'item'}-${Date.now().toString(36)}`;

type Props = {
  children: ReactNode;
};

/**
 * Catálogo de disciplinas e conteúdos em memória, o mesmo para os cards dos decks e para as
 * questões das provas (RN-047): uma disciplina ou um conteúdo criado num card aparece também ao
 * cadastrar uma questão, e vice-versa. Envolve as abas (app/(tabs)/_layout.tsx), para valer nas
 * pilhas de Meus Decks e de Minhas Provas.
 */
// TODO: substituir pelo catálogo do back e criar nele as disciplinas e conteúdos novos.
export function SubjectsProvider({ children }: Props) {
  const [disciplines, setDisciplines] = useState<Discipline[]>(MOCK_DISCIPLINES);
  const [contents, setContents] = useState<DisciplineContent[]>(MOCK_DISCIPLINE_CONTENTS);

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

  const value = useMemo(
    () => ({ disciplines, contents, addDiscipline, addContent }),
    [disciplines, contents, addDiscipline, addContent],
  );

  return <SubjectsContext.Provider value={value}>{children}</SubjectsContext.Provider>;
}

/** Catálogo de disciplinas e conteúdos. Só funciona dentro do SubjectsProvider. */
export function useSubjects(): Subjects {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error('useSubjects precisa estar dentro do SubjectsProvider.');
  }
  return context;
}

/** Nomes das disciplinas e dos conteúdos por id, para montar rótulos "Disciplina - Conteúdo" */
export function useSubjectNames() {
  const { disciplines, contents } = useSubjects();
  return useMemo(
    () => ({
      disciplineNames: new Map(disciplines.map((item) => [item.id, item.name])),
      contentNames: new Map(contents.map((item) => [item.id, item.name])),
    }),
    [disciplines, contents],
  );
}
