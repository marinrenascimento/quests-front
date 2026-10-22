import { ExamRecord, Question } from '@/constants/exams';
import { buildMockQuestions, ExamSeed, MOCK_EXAMS } from '@/constants/mockExams';

// TODO: substituir pelos dados do back (banco de vestibulares). Provas prontas de vestibulares,
// fictícias: as mesmas 8 que antes ficavam no fim de Minhas Provas, agora com o nome do
// vestibular e o ano. Uma prova de 1 questão e uma vazia testam o singular e o estado vazio.

const ENTRANCE_EXAM_SEEDS: ExamSeed[] = [
  {
    id: 'enem-2023-dia-1',
    title: 'ENEM 2023 - 1º Dia',
    origin: 'vestibular',
    entranceExam: { name: 'ENEM', year: 2023 },
    size: 90,
  },
  {
    id: 'enem-2023-dia-2',
    title: 'ENEM 2023 - 2º Dia',
    origin: 'vestibular',
    entranceExam: { name: 'ENEM', year: 2023 },
    size: 90,
  },
  {
    id: 'fuvest-2024-fase-1',
    title: 'FUVEST 2024 - 1ª Fase',
    origin: 'vestibular',
    entranceExam: { name: 'FUVEST', year: 2024 },
    size: 90,
  },
  {
    id: 'ita-2023-fase-1',
    title: 'ITA 2023 - 1ª Fase',
    origin: 'vestibular',
    entranceExam: { name: 'ITA', year: 2023 },
    size: 40,
  },
  {
    id: 'unicamp-2024-fase-1',
    title: 'UNICAMP 2024 - 1ª Fase',
    origin: 'vestibular',
    entranceExam: { name: 'UNICAMP', year: 2024 },
    size: 72,
  },
  {
    id: 'uerj-2024-qualificacao',
    title: 'UERJ 2024 - Exame de Qualificação',
    origin: 'vestibular',
    entranceExam: { name: 'UERJ', year: 2024 },
    size: 24,
  },
  {
    id: 'ufsc-2023',
    title: 'UFSC 2023',
    origin: 'vestibular',
    entranceExam: { name: 'UFSC', year: 2023 },
    size: 1,
  },
  {
    id: 'uel-2023',
    title: 'UEL 2023',
    origin: 'vestibular',
    entranceExam: { name: 'UEL', year: 2023 },
    size: 0,
  },
];

/**
 * Questões de cada prova de vestibular, por id da prova. Continuam a numeração de posições das
 * provas do usuário, para cada prova gerar as mesmas questões de antes da separação.
 */
export const MOCK_ENTRANCE_EXAM_QUESTIONS: Record<string, Question[]> = Object.fromEntries(
  ENTRANCE_EXAM_SEEDS.map((seed, index) => [
    seed.id,
    buildMockQuestions(seed, MOCK_EXAMS.length + index),
  ]),
);

/** Provas de vestibular (a quantidade de questões sai das questões de cada uma) */
export const MOCK_ENTRANCE_EXAMS: ExamRecord[] = ENTRANCE_EXAM_SEEDS.map(
  ({ id, title, origin, entranceExam }) => ({ id, title, origin, entranceExam }),
);
