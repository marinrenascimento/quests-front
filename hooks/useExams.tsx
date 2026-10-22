import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import {
  DISCIPLINE_STUDY_EXAM_ID,
  DraftQuestion,
  Exam,
  ExamRecord,
  Question,
  questionsSubjects,
  QuestionValues,
} from '@/constants/exams';
import { MOCK_ENTRANCE_EXAM_QUESTIONS, MOCK_ENTRANCE_EXAMS } from '@/constants/mockEntranceExams';
import { MOCK_EXAM_QUESTIONS, MOCK_EXAMS } from '@/constants/mockExams';
import { slugify } from '@/utils/normalizeSearch';

/** Dados de Criar Nova Prova no momento de salvar */
type NewExam = {
  title: string;
  questions: DraftQuestion[];
};

/** Prova temporária do estudo por disciplina (não entra em Minhas Provas nem é salva) */
export type ExamDisciplineStudy = {
  title: string;
  questions: Question[];
};

type ExamsData = {
  /** Minhas Provas: as criadas nesta sessão (as mais novas primeiro) seguidas das fictícias */
  exams: Exam[];
  /** Provas prontas de vestibular (não podem ser alteradas) */
  entranceExams: Exam[];
  /** Qualquer prova pelo id: do usuário, de vestibular ou a do estudo por disciplina */
  getExam: (examId: string) => Exam | undefined;
  /** Questões de uma prova (lista vazia se a prova não existir) */
  getExamQuestions: (examId: string) => Question[];
  /** Todas as questões do sistema: das provas do usuário e das de vestibular */
  allQuestions: Question[];
  /** Cria a prova em memória (com as questões do rascunho) e devolve a prova criada */
  createExam: (exam: NewExam) => Exam;
  /** Adiciona uma questão no fim de uma prova e pede o toast de sucesso em Questões da Prova */
  addQuestion: (examId: string, values: QuestionValues) => void;
  /** Troca os campos de uma questão, mantendo a posição e o id */
  updateQuestion: (examId: string, questionId: string, values: QuestionValues) => void;
  /**
   * Exclui uma questão. A prova não pode ficar sem questões: com uma questão só, nada é excluído
   * e devolve false.
   */
  deleteQuestion: (examId: string, questionId: string) => boolean;
  /** Estudo por disciplina em andamento (null: nenhum estudo configurado) */
  disciplineStudy: ExamDisciplineStudy | null;
  startDisciplineStudy: (study: ExamDisciplineStudy) => void;
  /** Prova cujo Questões da Prova deve mostrar o toast "Questão Adicionada com Sucesso!" */
  questionAddedToastExamId: string | null;
  hideQuestionAddedToast: () => void;
};

const ExamsContext = createContext<ExamsData | null>(null);

/** Lista vazia estável (prova inexistente) */
const NO_QUESTIONS: Question[] = [];

/** Questões fictícias de uma prova (do usuário ou de vestibular) */
const mockQuestions = (examId: string): Question[] =>
  MOCK_EXAM_QUESTIONS[examId] ?? MOCK_ENTRANCE_EXAM_QUESTIONS[examId] ?? NO_QUESTIONS;

/** Prova com a quantidade, as disciplinas e os conteúdos derivados das questões */
function toExam(record: ExamRecord, questions: Question[]): Exam {
  return { ...record, questionsCount: questions.length, ...questionsSubjects(questions) };
}

/** Id único de um item criado agora (o back definirá o id real) */
const createdKey = () => Date.now().toString(36);

type Props = {
  children: ReactNode;
};

/**
 * Fonte única das provas e questões lidas por Minhas Provas, Vestibulares, Questões da Prova, as
 * telas de questão e a realização da prova: as fictícias (constants/mock*) mais as criadas,
 * editadas e excluídas no app, tudo em memória. Envolve a pilha de Minhas Provas
 * (app/(tabs)/provas/_layout.tsx), que continua montada enquanto o app está aberto.
 */
// TODO: substituir pelas provas e questões do back e persistir o que for criado, editado e
// excluído.
export function ExamsProvider({ children }: Props) {
  const [createdExams, setCreatedExams] = useState<ExamRecord[]>([]);
  // Lista completa de questões das provas criadas ou alteradas, por id da prova
  const [questionsByExam, setQuestionsByExam] = useState<Record<string, Question[]>>({});
  const [questionAddedToastExamId, setQuestionAddedToastExamId] = useState<string | null>(null);
  // TODO: registrar a sessão de estudo por disciplina no back.
  const [disciplineStudy, setDisciplineStudy] = useState<ExamDisciplineStudy | null>(null);

  const getExamQuestions = useCallback(
    (examId: string) => {
      if (examId === DISCIPLINE_STUDY_EXAM_ID) {
        return disciplineStudy?.questions ?? NO_QUESTIONS;
      }
      return questionsByExam[examId] ?? mockQuestions(examId);
    },
    [questionsByExam, disciplineStudy],
  );

  const exams = useMemo(
    () =>
      [...createdExams, ...MOCK_EXAMS].map((record) =>
        toExam(record, questionsByExam[record.id] ?? mockQuestions(record.id)),
      ),
    [createdExams, questionsByExam],
  );

  // Provas de vestibular não são alteradas: as questões são sempre as do mock
  const entranceExams = useMemo(
    () => MOCK_ENTRANCE_EXAMS.map((record) => toExam(record, mockQuestions(record.id))),
    [],
  );

  const allQuestions = useMemo(
    () => [...exams, ...entranceExams].flatMap((exam) => getExamQuestions(exam.id)),
    [exams, entranceExams, getExamQuestions],
  );

  const getExam = useCallback(
    (examId: string) => {
      if (examId === DISCIPLINE_STUDY_EXAM_ID) {
        return disciplineStudy
          ? toExam(
              { id: DISCIPLINE_STUDY_EXAM_ID, title: disciplineStudy.title, origin: 'usuario' },
              disciplineStudy.questions,
            )
          : undefined;
      }
      return (
        exams.find((exam) => exam.id === examId) ??
        entranceExams.find((exam) => exam.id === examId)
      );
    },
    [exams, entranceExams, disciplineStudy],
  );

  const createExam = useCallback(({ title, questions }: NewExam) => {
    const id = `prova-${slugify(title) || 'nova'}-${createdKey()}`;
    const record: ExamRecord = { id, title, origin: 'usuario' };
    const examQuestions = questions.map((question, index) => ({
      ...question,
      id: `${id}-q${index + 1}`,
      examId: id,
    }));
    setCreatedExams((prev) => [record, ...prev]);
    setQuestionsByExam((prev) => ({ ...prev, [id]: examQuestions }));
    return toExam(record, examQuestions);
  }, []);

  const addQuestion = useCallback((examId: string, values: QuestionValues) => {
    setQuestionsByExam((prev) => {
      const current = prev[examId] ?? mockQuestions(examId);
      const question = { ...values, id: `${examId}-q-${createdKey()}`, examId };
      return { ...prev, [examId]: [...current, question] };
    });
    setQuestionAddedToastExamId(examId);
  }, []);

  const updateQuestion = useCallback(
    (examId: string, questionId: string, values: QuestionValues) => {
      setQuestionsByExam((prev) => ({
        ...prev,
        [examId]: (prev[examId] ?? mockQuestions(examId)).map((question) =>
          question.id === questionId ? { ...question, ...values } : question,
        ),
      }));
    },
    [],
  );

  const deleteQuestion = useCallback(
    (examId: string, questionId: string) => {
      const current = questionsByExam[examId] ?? mockQuestions(examId);
      if (current.length <= 1) {
        return false;
      }
      setQuestionsByExam((prev) => ({
        ...prev,
        [examId]: current.filter((question) => question.id !== questionId),
      }));
      return true;
    },
    [questionsByExam],
  );

  const hideQuestionAddedToast = useCallback(() => setQuestionAddedToastExamId(null), []);

  const value = useMemo(
    () => ({
      exams,
      entranceExams,
      getExam,
      getExamQuestions,
      allQuestions,
      createExam,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      disciplineStudy,
      startDisciplineStudy: setDisciplineStudy,
      questionAddedToastExamId,
      hideQuestionAddedToast,
    }),
    [
      exams,
      entranceExams,
      getExam,
      getExamQuestions,
      allQuestions,
      createExam,
      addQuestion,
      updateQuestion,
      deleteQuestion,
      disciplineStudy,
      questionAddedToastExamId,
      hideQuestionAddedToast,
    ],
  );

  return <ExamsContext.Provider value={value}>{children}</ExamsContext.Provider>;
}

/** Provas e questões em memória. Só funciona dentro do ExamsProvider. */
export function useExams(): ExamsData {
  const context = useContext(ExamsContext);
  if (!context) {
    throw new Error('useExams precisa estar dentro do ExamsProvider.');
  }
  return context;
}
