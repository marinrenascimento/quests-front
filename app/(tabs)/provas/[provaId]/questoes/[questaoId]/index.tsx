import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { QuestionViewTemplate } from '@/components/templates/QuestionViewTemplate';
import {
  alternativeLetter,
  DELETE_QUESTION_CONFIRM_CONTENT,
  LAST_QUESTION_TOAST,
  MAX_QUESTION_STARS,
  Question,
  QUESTION_DIFFICULTY_LABELS,
  questionStars,
  VIEW_QUESTION_CONTENT,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExams } from '@/hooks/useExams';
import { useSubjectNames } from '@/hooks/useSubjects';
import { shortName } from '@/utils/cardName';

/**
 * Visualizar Questão, aberto pelo olho ou pelo toque numa questão em Questões da Prova. Só lê;
 * nas provas do usuário, dá acesso a Editar e Excluir.
 */
export default function ViewExamQuestionScreen() {
  const router = useRouter();
  const { provaId, questaoId } = useLocalSearchParams<{ provaId: string; questaoId: string }>();
  // TODO: substituir pelos dados do back.
  const { getExam, getExamQuestions, deleteQuestion } = useExams();
  const { disciplineNames, contentNames } = useSubjectNames();
  const exam = getExam(provaId);
  const questions = exam ? getExamQuestions(exam.id) : [];
  const found = questions.find((item) => item.id === questaoId);
  // Questão excluída aqui: continua na tela enquanto ela sai (sem piscar "Não Encontrada")
  const [removedQuestion, setRemovedQuestion] = useState<Question | null>(null);
  const question = found ?? removedQuestion ?? undefined;
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [lastQuestionWarning, setLastQuestionWarning] = useState(false);
  const hideLastQuestionWarning = useCallback(() => setLastQuestionWarning(false), []);

  const handleBack = () => {
    // Volta para as questões da prova (que ficam por baixo na pilha); aberta sem histórico
    // (ex.: link direto), vai para elas
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/provas/[provaId]', params: { provaId } });
    }
  };

  const handleDelete = () => {
    // A prova não fica sem questões: com uma só, só avisa
    if (questions.length <= 1) {
      setLastQuestionWarning(true);
    } else {
      setDeleteVisible(true);
    }
  };

  const stars = question ? questionStars(question.difficulty) : 0;

  return (
    <>
      <QuestionViewTemplate
        title={question ? VIEW_QUESTION_CONTENT.title(shortName(question.title)) : undefined}
        details={
          question
            ? {
                title: { label: VIEW_QUESTION_CONTENT.titleLabel, value: question.title },
                discipline: {
                  label: VIEW_QUESTION_CONTENT.disciplineLabel,
                  value: disciplineNames.get(question.disciplineId) ?? '',
                },
                content: {
                  label: VIEW_QUESTION_CONTENT.contentLabel,
                  value: contentNames.get(question.contentId) ?? '',
                },
                difficulty: {
                  label: VIEW_QUESTION_CONTENT.difficultyLabel,
                  value: QUESTION_DIFFICULTY_LABELS[question.difficulty],
                  stars: {
                    filled: stars,
                    total: MAX_QUESTION_STARS,
                    icon: VIEW_QUESTION_CONTENT.starIcon,
                    emptyIcon: VIEW_QUESTION_CONTENT.starOutlineIcon,
                    accessibilityLabel: `${QUESTION_DIFFICULTY_LABELS[question.difficulty]}, ${stars} de ${MAX_QUESTION_STARS}`,
                  },
                },
                statement: {
                  label: VIEW_QUESTION_CONTENT.statementLabel,
                  value: question.statement,
                },
                alternatives: {
                  label: VIEW_QUESTION_CONTENT.alternativesLabel,
                  correctLabel: VIEW_QUESTION_CONTENT.correctLabel,
                  items: question.alternatives.map((alternative, index) => ({
                    id: alternative.id,
                    letter: alternativeLetter(index),
                    text: alternative.text,
                    correct: alternative.correct,
                  })),
                },
              }
            : undefined
        }
        notFoundMessage={VIEW_QUESTION_CONTENT.notFoundMessage}
        viewIcon={VIEW_QUESTION_CONTENT.viewIcon}
        // Provas de vestibular não podem ser alteradas: sem Editar nem Excluir
        actions={
          found && exam?.origin === 'usuario'
            ? {
                editLabel: VIEW_QUESTION_CONTENT.editLabel,
                deleteLabel: VIEW_QUESTION_CONTENT.deleteLabel,
                // push: o Visualizar fica por baixo e o Editar Questão volta para ele, já com os
                // valores novos
                onEdit: () =>
                  router.push({
                    pathname: '/(tabs)/provas/[provaId]/questoes/[questaoId]/editar',
                    params: { provaId, questaoId },
                  }),
                onDelete: handleDelete,
              }
            : undefined
        }
        toast={{
          message: LAST_QUESTION_TOAST,
          visible: lastQuestionWarning,
          onHide: hideLastQuestionWarning,
        }}
        onBack={handleBack}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={deleteVisible}
        title={DELETE_QUESTION_CONFIRM_CONTENT.title}
        highlight={question?.title ?? ''}
        confirmLabel={DELETE_QUESTION_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DELETE_QUESTION_CONFIRM_CONTENT.cancelLabel}
        onConfirm={() => {
          // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
          setDeleteVisible(false);
          if (exam && found) {
            // TODO: excluir a questão no back.
            setRemovedQuestion(found);
            deleteQuestion(exam.id, found.id);
            handleBack();
          }
        }}
        // Só fecha: a questão continua na prova
        onCancel={() => setDeleteVisible(false)}
      />
    </>
  );
}
