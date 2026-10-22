import { Discipline, DisciplineContent } from '@/constants/decks';
import { MOCK_DECKS } from '@/constants/mockDecks';
import { slugify } from '@/utils/normalizeSearch';

// TODO: substituir pelos dados do back. Disciplinas e conteúdos fictícios do Novo Flashcard,
// tirados dos decks fictícios (sem repetir a lista): cada disciplina dos decks vira uma
// disciplina e o tema de cada deck (o título), um conteúdo dela, como no rótulo
// "Disciplina - Tema" dos cards.

export const MOCK_DISCIPLINES: Discipline[] = Array.from(
  new Set(MOCK_DECKS.map((deck) => deck.discipline)),
  (name) => ({ id: slugify(name), name }),
);

export const MOCK_DISCIPLINE_CONTENTS: DisciplineContent[] = MOCK_DECKS.map((deck) => ({
  id: deck.id,
  disciplineId: slugify(deck.discipline),
  name: deck.title,
}));
