import { CARD_ACTIONS, CardAction, CardActionKey } from '@/constants/decks';
import type { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';

/** Uma prova do usuário (Minhas Provas) */
export type Exam = {
  id: string;
  title: string;
  /** Quantidade de questões da prova: derivada da lista de questões dela */
  questionsCount: number;
};

/**
 * Dificuldade de uma questão, definida na própria questão. Não é a dificuldade que o usuário
 * marca na revisão de um deck (Difficulty, em constants/study.ts, com 4 níveis).
 */
export type QuestionDifficulty = 'facil' | 'medio' | 'dificil';

/** Nome exibido de cada dificuldade de questão (configuração única) */
export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

/** Estrelas de cada dificuldade, de 1 a MAX_QUESTION_STARS (configuração única) */
const QUESTION_DIFFICULTY_STARS: Record<QuestionDifficulty, number> = {
  facil: 1,
  medio: 3,
  dificil: 5,
};

export const MAX_QUESTION_STARS = 5;

/** Quantas estrelas preenchidas mostrar para a dificuldade de uma questão */
export function questionStars(difficulty: QuestionDifficulty): number {
  return QUESTION_DIFFICULTY_STARS[difficulty];
}

/** Letras das alternativas, na ordem: vêm da posição da alternativa (não são guardadas) */
export const ALTERNATIVE_LETTERS = ['A', 'B', 'C', 'D', 'E'] as const;

export type AlternativeLetter = (typeof ALTERNATIVE_LETTERS)[number];

/** Uma questão de uma prova */
// TODO: gabarito da questão, quando os requisitos definirem.
export type Question = {
  id: string;
  examId: string;
  /** Disciplina (ex.: "Matemática") e conteúdo (ex.: "Equações do 1º grau") */
  discipline: string;
  topic: string;
  /** Enunciado em texto normal (a lista de questões exibe em caixa alta) */
  statement: string;
  difficulty: QuestionDifficulty;
  /** Textos das 5 alternativas, na ordem das letras A a E */
  alternatives: string[];
};

/** Rótulo "Disciplina - Conteúdo" mostrado no topo do card de uma questão */
export function questionSubjectLabel(question: Question): string {
  return `${question.discipline} - ${question.topic}`;
}

/** Rótulo "Disciplina · Conteúdo" do card de uma questão na realização da prova */
export function examSubjectLabel(question: Question): string {
  return `${question.discipline} · ${question.topic}`;
}

/** Respostas da prova em andamento: id da questão -> letra escolhida (sem chave: sem resposta) */
export type ExamAnswers = Record<string, AlternativeLetter>;

/** Cor do marcador de texto */
export type MarkerColor = 'blue' | 'yellow' | 'red';

export type MarkerConfig = {
  value: MarkerColor;
  /** Rótulo de acessibilidade da bolinha */
  label: string;
  /** Cor da bolinha da barra inferior */
  dotColor: string;
  /** Cor do fundo atrás das palavras marcadas */
  highlightColor: string;
};

/** Cores do marcador, na ordem da barra inferior (configuração única) */
export const MARKER_COLORS: MarkerConfig[] = [
  {
    value: 'blue',
    label: 'Marcador Azul',
    dotColor: Palette.markerBlue,
    highlightColor: Palette.highlightBlue,
  },
  {
    value: 'yellow',
    label: 'Marcador Amarelo',
    dotColor: Palette.markerYellow,
    highlightColor: Palette.highlightYellow,
  },
  {
    value: 'red',
    label: 'Marcador Vermelho',
    dotColor: Palette.markerRed,
    highlightColor: Palette.highlightRed,
  },
];

/** Cor do destaque de cada marcador, para o enunciado */
export const HIGHLIGHT_COLORS = Object.fromEntries(
  MARKER_COLORS.map((marker) => [marker.value, marker.highlightColor]),
) as Record<MarkerColor, string>;

/** Cor que começa ativa (a do mockup) */
export const INITIAL_MARKER_COLOR: MarkerColor = 'yellow';

/** Marcações de uma questão: índice da palavra do enunciado -> cor */
export type QuestionHighlights = Record<number, MarkerColor>;

/** Marcações da prova em andamento, por id da questão */
export type ExamHighlights = Record<string, QuestionHighlights>;

/** Textos da tela Minhas Provas (o título é exibido em caixa alta pelo componente) */
export const EXAMS_CONTENT = {
  title: 'Minhas Provas',
  createLabel: 'Criar Nova Prova',
  entranceExamsLabel: 'Vestibulares',
  studyLabel: 'Estudar por Disciplina',
  emptyMessage: 'Nenhuma Prova Cadastrada Ainda...',
};

/** Palavra da quantidade de questões, no singular e no plural (exibida em caixa alta) */
export const QUESTIONS_COUNT_LABELS = { one: 'Questão', other: 'Questões' };

/** Textos da tela de questões de uma prova (o nome da prova vem dos dados) */
export const EXAM_QUESTIONS_CONTENT = {
  studyLabel: 'Estudar Agora',
  addLabel: 'Adicionar Questão',
  emptyMessage: 'Nenhuma Questão Nesta Prova',
  notFoundMessage: 'Prova Não Encontrada',
};

/** Textos e ícones da realização de uma prova */
export const EXAM_SESSION_CONTENT = {
  exitLabel: 'Sair da prova',
  exitIcon: 'logout' as IconName,
  submitLabel: 'Entregar prova',
  /** Contagem do cabeçalho: "1 de 9 respondidas" (singular quando o total é 1) */
  progressLabels: { of: 'de', one: 'respondida', other: 'respondidas' },
  goToQuestionLabel: (position: number) => `Ir para a questão ${position}`,
  markerIcon: 'pencil' as IconName,
  markerToggleLabel: 'Marcador de texto',
  emptyMessage: EXAM_QUESTIONS_CONTENT.emptyMessage,
  notFoundMessage: EXAM_QUESTIONS_CONTENT.notFoundMessage,
};

/** Textos e ícones do card de uma questão na realização da prova */
export const EXAM_QUESTION_CARD_CONTENT = {
  /** Título do card: a posição da questão na prova, começando em 1 (exibido em caixa alta) */
  title: (position: number) => `Questão ${position}`,
  subjectLabel: examSubjectLabel,
  stars: questionStars,
  maxStars: MAX_QUESTION_STARS,
  starsLabel: (stars: number, max: number) => `Dificuldade: ${stars} de ${max}`,
  starIcon: 'star' as IconName,
  starOutlineIcon: 'star-outline' as IconName,
  letters: ALTERNATIVE_LETTERS,
  highlightColors: HIGHLIGHT_COLORS,
};

export type ExamQuestionCardContent = typeof EXAM_QUESTION_CARD_CONTENT;

/** Modal de "Sair da prova" (o destaque é o nome da prova) */
export const EXIT_EXAM_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Sair da Prova:',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal de "Entregar prova" (o destaque é o nome da prova; embaixo, o resumo das respostas) */
export const SUBMIT_EXAM_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Entregar a Prova:',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
  /** "Foram respondidas 3 de 9 questões." (com o singular de cada parte) */
  summaryLabels: {
    verbOne: 'Foi respondida',
    verbOther: 'Foram respondidas',
    of: 'de',
    one: 'questão',
    other: 'questões',
  },
};

/** Rótulo de acessibilidade de cada botão do card de uma questão */
const QUESTION_ACTION_LABELS: Record<CardActionKey, string> = {
  edit: 'Editar Questão',
  delete: 'Excluir Questão',
  view: 'Visualizar Questão',
};

/** Botões do card de uma questão: os mesmos ícones e a mesma ordem dos cards de um deck */
export const QUESTION_ACTIONS: CardAction[] = CARD_ACTIONS.map((action) => ({
  ...action,
  label: QUESTION_ACTION_LABELS[action.key],
}));
