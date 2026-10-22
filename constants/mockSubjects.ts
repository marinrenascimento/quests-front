import { Discipline, DisciplineContent } from '@/constants/decks';
import { MOCK_CARD_DISCIPLINES, MOCK_DECKS, mockDeckDiscipline } from '@/constants/mockDecks';
import { normalizeSearch, slugify } from '@/utils/normalizeSearch';

// TODO: substituir pelos dados do back. Catálogo fictício de disciplinas e conteúdos, o mesmo para
// os cards dos decks e para as questões das provas (RN-047). Junta duas fontes, sem repetir nome
// dentro da mesma disciplina:
// 1. os cards dos decks fictícios: cada disciplina dos cards vira uma disciplina e o tema de cada
//    deck (o título), um conteúdo dela, como no rótulo "Disciplina - Conteúdo" dos cards;
// 2. os conteúdos por disciplina das questões fictícias (MOCK_CONTENTS_BY_DISCIPLINE).

/** Conteúdos de cada disciplina usados pelas questões fictícias das provas */
// TODO: substituir pelos dados do back.
const MOCK_CONTENTS_BY_DISCIPLINE: Record<string, string[]> = {
  Matemática: [
    'Aritmética',
    'Geometria',
    'Porcentagem',
    'Equações do 1º grau',
    'Probabilidade',
    'Funções do 2º grau',
    'Progressões',
    'Trigonometria',
    'Estatística',
  ],
  Português: ['Concordância verbal', 'Figuras de linguagem', 'Classes de palavras'],
  História: ['Revolução Francesa', 'Era Vargas', 'Guerra Fria'],
  Geografia: ['Climas do Brasil', 'Urbanização', 'Cartografia'],
  Física: ['Cinemática', 'Eletrodinâmica', 'Leis de Newton'],
  Química: ['Estequiometria', 'Tabela periódica', 'Soluções'],
  Biologia: ['Citologia', 'Genética', 'Ecologia'],
};

const sameName = (a: string, b: string) => normalizeSearch(a) === normalizeSearch(b);

function buildCatalog() {
  const disciplines: Discipline[] = MOCK_CARD_DISCIPLINES.map((name) => ({
    id: slugify(name),
    name,
  }));
  const contents: DisciplineContent[] = MOCK_DECKS.map((deck) => ({
    id: deck.id,
    disciplineId: slugify(mockDeckDiscipline(deck.id)),
    name: deck.title,
  }));

  for (const [disciplineName, contentNames] of Object.entries(MOCK_CONTENTS_BY_DISCIPLINE)) {
    let discipline = disciplines.find((item) => sameName(item.name, disciplineName));
    if (!discipline) {
      discipline = { id: slugify(disciplineName), name: disciplineName };
      disciplines.push(discipline);
    }
    const disciplineId = discipline.id;
    for (const contentName of contentNames) {
      // O mesmo conteúdo dos decks (ex.: História - Guerra Fria) é um conteúdo só
      const exists = contents.some(
        (item) => item.disciplineId === disciplineId && sameName(item.name, contentName),
      );
      if (!exists) {
        contents.push({
          id: `${disciplineId}-${slugify(contentName)}`,
          disciplineId,
          name: contentName,
        });
      }
    }
  }
  return { disciplines, contents };
}

const CATALOG = buildCatalog();

export const MOCK_DISCIPLINES: Discipline[] = CATALOG.disciplines;

export const MOCK_DISCIPLINE_CONTENTS: DisciplineContent[] = CATALOG.contents;

/**
 * Ids do catálogo para uma disciplina e um conteúdo pelo nome (sem diferenciar maiúsculas nem
 * acentos). Usado pelas questões fictícias, escritas com os nomes.
 */
export function mockSubjectIds(
  disciplineName: string,
  contentName: string,
): { disciplineId: string; contentId: string } {
  const discipline = MOCK_DISCIPLINES.find((item) => sameName(item.name, disciplineName));
  const content = MOCK_DISCIPLINE_CONTENTS.find(
    (item) => item.disciplineId === discipline?.id && sameName(item.name, contentName),
  );
  if (!discipline || !content) {
    throw new Error(`Disciplina ou conteúdo fora do catálogo fictício: ${disciplineName} - ${contentName}`);
  }
  return { disciplineId: discipline.id, contentId: content.id };
}
