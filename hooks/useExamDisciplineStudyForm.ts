import { useMemo, useState } from 'react';

import { subjectLabel } from '@/constants/decks';
import {
  ALL_DIFFICULTIES_ID,
  QUESTION_DIFFICULTIES,
  QUESTION_DIFFICULTY_LABELS,
  QuestionDifficulty,
} from '@/constants/exams';
import { STUDY_QUANTITY_OPTIONS } from '@/constants/study';
import { ExamDisciplineStudy, useExams } from '@/hooks/useExams';
import { useSubjects } from '@/hooks/useSubjects';
import { shuffle } from '@/utils/shuffle';

/** Campos que podem mostrar erro: os obrigatórios e a dificuldade (sem questões) */
type Field = 'discipline' | 'quantity' | 'difficulty';
type Errors = Partial<Record<Field, string>>;

type Options = {
  /**
   * Mensagens de obrigatório (disciplina e quantidade) e a da combinação sem nenhuma questão,
   * mostradas ao tocar em "Estudar Agora"
   */
  messages: { discipline: string; quantity: string; noQuestions: string };
  /** Nome da opção "todas as dificuldades" */
  allDifficultiesLabel: string;
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'pt-BR');

/** Chave de um par disciplina + conteúdo */
const pairKey = (disciplineId: string, contentId: string) => `${disciplineId}|${contentId}`;

/**
 * Campos de Configurar Prova por Disciplina, no padrão de Configurar Deck por Disciplina: só
 * aparecem disciplinas e conteúdos com pelo menos 1 questão, considerando todas as questões do
 * sistema (das provas do usuário e das de vestibular). Disciplina e quantidade são obrigatórias;
 * conteúdo e dificuldade são opcionais (sem escolha, entram todos). O sorteio não repete questão
 * e, com menos questões do que a quantidade, entram todas.
 */
export function useExamDisciplineStudyForm({ messages, allDifficultiesLabel }: Options) {
  const { allQuestions } = useExams();
  const { disciplines, contents } = useSubjects();
  const [disciplineId, setDisciplineId] = useState<string | undefined>(undefined);
  const [contentId, setContentId] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<Errors>({});

  const { disciplinesWithQuestions, pairsWithQuestions } = useMemo(
    () => ({
      disciplinesWithQuestions: new Set(allQuestions.map((question) => question.disciplineId)),
      pairsWithQuestions: new Set(
        allQuestions.map((question) => pairKey(question.disciplineId, question.contentId)),
      ),
    }),
    [allQuestions],
  );

  const discipline = disciplines.find((item) => item.id === disciplineId);
  const content = contents.find((item) => item.id === contentId);

  function clearError(field: Field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return {
    disciplineOptions: disciplines
      .filter((item) => disciplinesWithQuestions.has(item.id))
      .sort(byName)
      .map((item) => ({ id: item.id, label: item.name })),
    /** Vazio enquanto nenhuma disciplina foi escolhida */
    contentOptions: contents
      .filter(
        (item) =>
          item.disciplineId === disciplineId &&
          pairsWithQuestions.has(pairKey(item.disciplineId, item.id)),
      )
      .sort(byName)
      .map((item) => ({ id: item.id, label: item.name })),
    /** "Todas as dificuldades" e as 3 dificuldades, da mais fácil para a mais difícil */
    difficultyOptions: [
      { id: ALL_DIFFICULTIES_ID, label: allDifficultiesLabel },
      ...QUESTION_DIFFICULTIES.map((value) => ({
        id: value,
        label: QUESTION_DIFFICULTY_LABELS[value],
      })),
    ],
    quantityOptions: STUDY_QUANTITY_OPTIONS.map((value) => ({
      id: String(value),
      label: String(value),
    })),
    disciplineId,
    contentId,
    /** Sem escolha, o campo fica vazio (o placeholder diz que entram todas) */
    difficultyId: difficulty,
    quantityId: quantity === undefined ? undefined : String(quantity),
    errors,
    /** Alguma escolha feita (a seta e o voltar do Android pedem confirmação antes de sair) */
    hasChoices:
      disciplineId !== undefined ||
      contentId !== undefined ||
      difficulty !== undefined ||
      quantity !== undefined,
    selectDiscipline: (id: string) => {
      if (id !== disciplineId) {
        setContentId(undefined);
      }
      setDisciplineId(id);
      clearError('discipline');
      clearError('difficulty');
    },
    selectContent: (id: string) => {
      setContentId(id);
      clearError('difficulty');
    },
    selectDifficulty: (id: string) => {
      setDifficulty(id === ALL_DIFFICULTIES_ID ? undefined : (id as QuestionDifficulty));
      clearError('difficulty');
    },
    selectQuantity: (id: string) => {
      setQuantity(Number(id));
      clearError('quantity');
    },
    /**
     * Confere os campos obrigatórios e mostra os erros. Com tudo certo, monta a prova
     * temporária: as questões da disciplina (e do conteúdo e da dificuldade, se escolhidos),
     * sorteadas sem repetir e limitadas à quantidade. Sem nenhuma questão na combinação, mostra
     * o erro na dificuldade. Senão, devolve null.
     */
    submit: (): ExamDisciplineStudy | null => {
      const nextErrors: Errors = {};
      if (!discipline) nextErrors.discipline = messages.discipline;
      if (quantity === undefined) nextErrors.quantity = messages.quantity;

      if (!discipline || quantity === undefined) {
        setErrors(nextErrors);
        return null;
      }
      const matching = allQuestions.filter(
        (question) =>
          question.disciplineId === discipline.id &&
          (!content || question.contentId === content.id) &&
          (!difficulty || question.difficulty === difficulty),
      );
      if (matching.length === 0) {
        setErrors({ difficulty: messages.noQuestions });
        return null;
      }
      setErrors({});
      return {
        // Sem conteúdo, o cabeçalho mostra só a disciplina (como no estudo dos decks)
        // TODO: confirmar o nome da prova sem conteúdo escolhido (RN-173).
        title: content ? subjectLabel(discipline.name, content.name) : discipline.name,
        questions: shuffle(matching).slice(0, quantity),
      };
    },
  };
}

export type ExamDisciplineStudyFormState = ReturnType<typeof useExamDisciplineStudyForm>;
