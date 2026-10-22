import { Deck } from '@/constants/decks';

// TODO: substituir pelos dados do back. Decks fictícios: os 6 primeiros são os do mockup, na
// ordem dele (esquerda para a direita, de cima para baixo); os demais servem para testar a
// rolagem, o número ímpar de cards (o último fica sozinho na linha), o singular ("1 CARD") e
// o separador de milhar ("1.250 CARDS").
// O deck não tem disciplina (os cards têm). Aqui cada deck fictício guarda só a disciplina dos
// cards gerados para ele (todos da mesma), que não faz parte do deck: o tema do deck (o título)
// vira o conteúdo desses cards. As disciplinas seguem a lista definida para a tela de cards;
// Tabela Periódica, Leis de Newton, Ecologia, Modernismo e Inglês: Verb Tenses não estavam nela e
// foram escolhidas por coerência.

/** Deck fictício com a disciplina dos cards gerados para ele */
type MockDeckSeed = Deck & { discipline: string };

const MOCK_DECK_SEEDS: MockDeckSeed[] = [
  {
    id: 'substantivos-adjetivos',
    title: 'Substantivos e Adjetivos',
    description: 'Questões sobre substantivos e adjetivos',
    discipline: 'Português',
    cardsCount: 53,
  },
  {
    id: 'sistema-nervoso',
    title: 'Sistema Nervoso',
    description: 'Cards de biologia sobre o sistema nervoso',
    discipline: 'Biologia',
    cardsCount: 15,
  },
  {
    id: 'primeira-guerra',
    title: 'Primeira Guerra Mundial',
    description: 'Contexto e causas da Primeira Guerra Mundial',
    discipline: 'História',
    cardsCount: 27,
  },
  {
    id: 'renascimento',
    title: 'Renascimento',
    description: 'Exercícios de artes de vestibular sobre o Renascimento',
    discipline: 'Artes',
    cardsCount: 231,
  },
  {
    id: 'radiciacao-potenciacao',
    title: 'Radiciação e Potenciação',
    description: 'Matemática básica: Radiciação e potenciação',
    discipline: 'Matemática',
    cardsCount: 5,
  },
  {
    id: 'guerra-fria',
    title: 'Guerra Fria',
    description: 'Contexto da Guerra Fria e suas consequências',
    discipline: 'História',
    cardsCount: 38,
  },
  {
    id: 'funcoes-primeiro-grau',
    title: 'Funções do 1º Grau',
    description: 'Exercícios de matemática sobre funções do primeiro grau',
    discipline: 'Matemática',
    cardsCount: 42,
  },
  {
    id: 'tabela-periodica',
    title: 'Tabela Periódica',
    description: 'Elementos, famílias e propriedades periódicas',
    discipline: 'Química',
    cardsCount: 64,
  },
  {
    id: 'leis-de-newton',
    title: 'Leis de Newton',
    description: 'Questões de física sobre as três leis de Newton',
    discipline: 'Física',
    cardsCount: 19,
  },
  {
    id: 'brasil-colonia',
    title: 'Brasil Colônia',
    description: 'Ciclos econômicos e sociedade no Brasil Colônia',
    discipline: 'História',
    cardsCount: 33,
  },
  {
    id: 'ecologia',
    title: 'Ecologia',
    description: 'Cadeias alimentares, ciclos e relações ecológicas',
    discipline: 'Biologia',
    cardsCount: 1,
  },
  {
    id: 'modernismo',
    title: 'Modernismo',
    description: 'Semana de 22 e as fases do Modernismo brasileiro',
    discipline: 'Literatura',
    cardsCount: 48,
  },
  {
    id: 'geometria-plana',
    title: 'Geometria Plana',
    description: 'Áreas, perímetros e semelhança de triângulos',
    discipline: 'Matemática',
    cardsCount: 1250,
  },
  {
    id: 'revolucao-industrial',
    title: 'Revolução Industrial',
    description: 'Causas e consequências da Revolução Industrial',
    discipline: 'História',
    cardsCount: 26,
  },
  {
    id: 'verb-tenses',
    title: 'Inglês: Verb Tenses',
    description: 'Revisão dos tempos verbais em inglês',
    discipline: 'Inglês',
    cardsCount: 12,
  },
];

/** Decks fictícios, sem a disciplina (ela é dos cards) */
export const MOCK_DECKS: Deck[] = MOCK_DECK_SEEDS.map(({ discipline: _discipline, ...deck }) => deck);

/** Disciplina dos cards fictícios de um deck fictício (vazia para outros decks) */
export function mockDeckDiscipline(deckId: string): string {
  return MOCK_DECK_SEEDS.find((deck) => deck.id === deckId)?.discipline ?? '';
}

/** Disciplinas dos cards fictícios, sem repetir, na ordem dos decks */
export const MOCK_CARD_DISCIPLINES: string[] = Array.from(
  new Set(MOCK_DECK_SEEDS.map((deck) => deck.discipline)),
);
