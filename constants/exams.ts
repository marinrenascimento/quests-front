import { CARD_ACTIONS, CardAction, CardActionKey } from '@/constants/decks';
import type { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';

/**
 * Origem de uma prova: criada pelo usuário (Minhas Provas) ou prova pronta de um vestibular
 * (Vestibulares, que não pode ser alterada)
 */
export type ExamOrigin = 'usuario' | 'vestibular';

/** Vestibular de origem de uma prova pronta (ex.: ENEM 2023) */
export type EntranceExamInfo = {
  /** Nome do vestibular (ex.: "ENEM", "ITA") */
  name: string;
  year: number;
};

/**
 * Uma prova. Disciplinas, conteúdos e quantidade de questões não são guardados: saem das
 * questões dela (uma prova pode ter várias disciplinas e vários conteúdos).
 */
export type Exam = {
  id: string;
  title: string;
  origin: ExamOrigin;
  /** Só nas provas de vestibular */
  entranceExam?: EntranceExamInfo;
  /** Quantidade de questões da prova: derivada da lista de questões dela */
  questionsCount: number;
  /** Disciplinas e conteúdos das questões da prova, sem repetir (ids do catálogo) */
  disciplineIds: string[];
  contentIds: string[];
};

/** Dados guardados de uma prova (o resto sai das questões) */
export type ExamRecord = Pick<Exam, 'id' | 'title' | 'origin' | 'entranceExam'>;

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

/** Dificuldades na ordem da tela (da mais fácil para a mais difícil) */
export const QUESTION_DIFFICULTIES: QuestionDifficulty[] = ['facil', 'medio', 'dificil'];

/**
 * Letra de uma alternativa pela posição (0 -> A, 1 -> B...). Não é guardada: ao remover uma
 * alternativa, as letras das seguintes se reajustam. Depois do Z, segue AA, AB...
 */
export function alternativeLetter(index: number): string {
  let letters = '';
  let rest = index;
  do {
    letters = String.fromCharCode(65 + (rest % 26)) + letters;
    rest = Math.floor(rest / 26) - 1;
  } while (rest >= 0);
  return letters;
}

/** Uma alternativa de uma questão. Toda questão tem exatamente uma alternativa correta. */
export type Alternative = {
  id: string;
  text: string;
  correct: boolean;
};

/**
 * Uma questão de uma prova. Todas são de assinalar (múltipla escolha), com quantas alternativas
 * quem criou quiser e exatamente uma correta (o gabarito, que não aparece durante a prova).
 */
export type Question = {
  id: string;
  examId: string;
  title: string;
  /** Enunciado em texto normal */
  statement: string;
  /** Disciplina e conteúdo (ids do catálogo de disciplinas e conteúdos, o mesmo dos cards) */
  disciplineId: string;
  contentId: string;
  /** Escolhida por quem cria a questão */
  difficulty: QuestionDifficulty;
  /** Na ordem das letras (A, B, C...) */
  alternatives: Alternative[];
};

/** Campos de uma questão preenchidos no formulário (sem os ids da questão e da prova) */
export type QuestionValues = Omit<Question, 'id' | 'examId'>;

/** Questão adicionada à prova em criação (ainda um rascunho, sem prova) */
export type DraftQuestion = QuestionValues & { id: string };

/** Disciplinas e conteúdos de uma lista de questões, sem repetir, na ordem em que aparecem */
export function questionsSubjects(questions: Pick<Question, 'disciplineId' | 'contentId'>[]) {
  return {
    disciplineIds: Array.from(new Set(questions.map((question) => question.disciplineId))),
    contentIds: Array.from(new Set(questions.map((question) => question.contentId))),
  };
}

/** Rótulo "Disciplina · Conteúdo" do card de uma questão na realização da prova */
export function examSubjectLabel(disciplineName: string, contentName: string): string {
  return `${disciplineName} · ${contentName}`;
}

/**
 * Respostas da prova em andamento: id da questão -> id da alternativa escolhida (sem chave: sem
 * resposta)
 */
export type ExamAnswers = Record<string, string>;

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

/** Toast depois de salvar uma questão (na prova em criação ou numa prova que já existe) */
export const QUESTION_ADDED_TOAST = 'Questão Adicionada com Sucesso!';

/** Toast ao tentar excluir a única questão de uma prova (a prova não fica sem questões) */
export const LAST_QUESTION_TOAST = 'A Prova Precisa de Pelo Menos 1 Questão.';

/** Mensagem das telas de questão quando a prova não pode ser alterada (vestibular) */
export const LOCKED_EXAM_MESSAGE = 'Provas de Vestibular Não Podem Ser Alteradas';

/** Textos da tela Criar Nova Prova (o título é exibido em caixa alta pelo componente) */
export const EXAM_FORM_CONTENT = {
  title: 'Criar Nova Prova',
  nameLabel: 'Nome da Prova',
  namePlaceholder: 'Digite o Nome da Prova',
  nameRequired: 'Informe o Nome da Prova.',
  addQuestionLabel: 'Adicionar Questão +',
  questionsLabel: 'Questões Adicionadas',
  questionsEmpty: 'Nenhuma Questão Foi Adicionada Ainda...',
  /** Botões que aparecem depois da primeira questão adicionada */
  saveLabel: 'Salvar',
  cancelLabel: 'Cancelar',
};

export type ExamFormContent = typeof EXAM_FORM_CONTENT;

/** Modal ao cancelar (ou voltar de) Criar Nova Prova com questão adicionada */
export const CANCEL_EXAM_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Cancelar a Criação Dessa Prova?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Textos da tela Adicionar Questão (o título é exibido em caixa alta pelo componente) */
export const QUESTION_FORM_CONTENT = {
  title: 'Adicionar Questão',
  disciplineLabel: 'Disciplina',
  disciplinePlaceholder: 'Pesquise ou Crie uma Disciplina',
  disciplineRequired: 'Informe a Disciplina.',
  createDiscipline: (text: string) => `Criar Disciplina "${text}"`,
  contentLabel: 'Conteúdo',
  contentPlaceholder: 'Pesquise ou Crie um Conteúdo',
  contentDisabledPlaceholder: 'Escolha uma Disciplina Primeiro',
  contentRequired: 'Informe o Conteúdo.',
  createContent: (text: string) => `Criar Conteúdo "${text}"`,
  noOptions: 'Nenhum Item Cadastrado. Digite para Criar.',
  titleLabel: 'Título',
  titlePlaceholder: 'Digite o Título da Questão',
  titleRequired: 'Informe o Título.',
  statementLabel: 'Enunciado',
  statementPlaceholder: 'Digite o Enunciado da Questão',
  statementRequired: 'Informe o Enunciado.',
  difficultyLabel: 'Nível de Dificuldade',
  difficultyRequired: 'Informe o Nível de Dificuldade.',
  /** Opções de dificuldade com as estrelas da realização da prova (RN-156) */
  difficultyOptions: QUESTION_DIFFICULTIES.map((value) => ({
    value,
    label: QUESTION_DIFFICULTY_LABELS[value],
    stars: questionStars(value),
    accessibilityLabel: `Dificuldade ${QUESTION_DIFFICULTY_LABELS[value]}, ${questionStars(value)} de ${MAX_QUESTION_STARS} estrelas`,
  })),
  maxStars: MAX_QUESTION_STARS,
  alternativesLabel: 'Alternativas',
  alternativesEmpty: 'Nenhuma Alternativa Foi Adicionada Ainda...',
  addAlternativeLabel: 'Adicionar Alternativa +',
  alternativePlaceholder: 'Digite o Texto da Alternativa',
  alternativeRequired: 'Informe o Texto da Alternativa.',
  /** Rótulo do campo de texto de uma alternativa, lido pelo leitor de tela */
  alternativeLabel: (letter: string) => `Alternativa ${letter}`,
  correctLabel: 'Correta',
  removeAlternativeLabel: (letter: string) => `Remover Alternativa ${letter}`,
  removeAlternativeIcon: 'trash-can-outline' as IconName,
  starIcon: 'star' as IconName,
  starOutlineIcon: 'star-outline' as IconName,
  saveLabel: 'Salvar',
  cancelLabel: 'Cancelar',
};

export type QuestionFormContent = typeof QUESTION_FORM_CONTENT & {
  /** Questão inexistente ou prova que não pode ser alterada (Editar Questão) */
  notFoundMessage?: string;
};

/** Textos da tela Editar Questão: o mesmo formulário, com outro título */
export const EDIT_QUESTION_CONTENT: QuestionFormContent = {
  ...QUESTION_FORM_CONTENT,
  title: 'Editar Questão',
  notFoundMessage: 'Questão Não Encontrada',
};

/** Modal ao cancelar (ou voltar de) Adicionar Questão com algo escrito */
export const CANCEL_QUESTION_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Cancelar a Criação Dessa Questão?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal ao sair do Editar Questão com alteração não salva */
export const DISCARD_QUESTION_EDIT_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Sair sem Salvar as Alterações Dessa Questão?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal ao excluir uma questão (o destaque é o título da questão) */
export const DELETE_QUESTION_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Excluir a Questão:',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Textos da tela Visualizar Questão (somente leitura) */
export const VIEW_QUESTION_CONTENT = {
  title: (name: string) => `Questão "${name}"`,
  titleLabel: QUESTION_FORM_CONTENT.titleLabel,
  disciplineLabel: QUESTION_FORM_CONTENT.disciplineLabel,
  contentLabel: QUESTION_FORM_CONTENT.contentLabel,
  difficultyLabel: QUESTION_FORM_CONTENT.difficultyLabel,
  statementLabel: QUESTION_FORM_CONTENT.statementLabel,
  alternativesLabel: QUESTION_FORM_CONTENT.alternativesLabel,
  /** Lido pelo leitor de tela junto com a alternativa correta */
  correctLabel: 'Correta',
  starIcon: 'star' as IconName,
  starOutlineIcon: 'star-outline' as IconName,
  editLabel: 'Editar',
  deleteLabel: 'Excluir',
  notFoundMessage: 'Questão Não Encontrada',
  viewIcon: 'eye-outline' as IconName,
};

export type ViewQuestionContent = typeof VIEW_QUESTION_CONTENT;

/** Textos da tela Vestibulares (o título é exibido em caixa alta pelo componente) */
export const ENTRANCE_EXAMS_CONTENT = {
  title: 'Vestibulares',
  emptyMessage: 'Nenhum Vestibular Encontrado',
  /** Linha abaixo do nome da prova: vestibular e ano (ex.: "ENEM · 2023") */
  description: (info: EntranceExamInfo) => `${info.name} · ${info.year}`,
};

/** Id reservado da prova temporária do estudo por disciplina (fora de Minhas Provas) */
export const DISCIPLINE_STUDY_EXAM_ID = 'estudo-por-disciplina';

/** Opção "todas as dificuldades" do estudo por disciplina (a dificuldade é opcional) */
export const ALL_DIFFICULTIES_ID = 'todas';

/** Textos de Configurar Prova por Disciplina (o título é exibido em caixa alta) */
export const EXAM_DISCIPLINE_STUDY_CONTENT = {
  title: 'Configurar Prova por Disciplina',
  disciplineLabel: 'Disciplina',
  disciplinePlaceholder: 'Pesquise uma Disciplina',
  disciplineRequired: 'Informe a Disciplina.',
  disciplineNoResults: 'Nenhuma Disciplina Encontrada',
  disciplineEmpty: 'Nenhuma Disciplina com Questões',
  contentLabel: 'Conteúdo',
  contentPlaceholder: 'Todos os Conteúdos (Opcional)',
  contentDisabledPlaceholder: 'Escolha uma Disciplina Primeiro',
  contentNoResults: 'Nenhum Conteúdo Encontrado',
  contentEmpty: 'Nenhum Conteúdo com Questões',
  difficultyLabel: 'Nível de Dificuldade',
  difficultyPlaceholder: 'Todas as Dificuldades (Opcional)',
  allDifficultiesLabel: 'Todas as Dificuldades',
  difficultyEmpty: 'Nenhuma Dificuldade Disponível',
  /** Disciplina, conteúdo e dificuldade sem nenhuma questão em comum */
  noQuestions: 'Nenhuma Questão com Esse Nível de Dificuldade.',
  quantityLabel: 'Quantidade de Questões',
  quantityPlaceholder: 'Escolha a Quantidade',
  quantityRequired: 'Informe a Quantidade de Questões.',
  quantityEmpty: 'Nenhuma Quantidade Disponível',
  cancelLabel: 'Cancelar',
  studyLabel: 'Estudar Agora',
};

/** Modal ao cancelar (ou voltar de) Configurar Prova por Disciplina */
export const CANCEL_EXAM_DISCIPLINE_STUDY_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Cancelar a Configuração do Estudo?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
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

/**
 * Textos e ícones do card de uma questão na realização da prova. O rótulo "Disciplina ·
 * Conteúdo" (subjectLabel) depende do catálogo e é completado pela tela.
 */
export const EXAM_QUESTION_CARD_CONTENT = {
  /** Título do card: a posição da questão na prova, começando em 1 (exibido em caixa alta) */
  title: (position: number) => `Questão ${position}`,
  stars: questionStars,
  maxStars: MAX_QUESTION_STARS,
  starsLabel: (stars: number, max: number) => `Dificuldade: ${stars} de ${max}`,
  starIcon: 'star' as IconName,
  starOutlineIcon: 'star-outline' as IconName,
  letter: alternativeLetter,
  highlightColors: HIGHLIGHT_COLORS,
};

export type ExamQuestionCardContent = typeof EXAM_QUESTION_CARD_CONTENT & {
  /** "Disciplina · Conteúdo" de uma questão */
  subjectLabel: (question: Question) => string;
};

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
