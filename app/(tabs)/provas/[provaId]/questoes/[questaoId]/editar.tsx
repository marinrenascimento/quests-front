import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { QuestionFormTemplate } from '@/components/templates/QuestionFormTemplate';
import {
  DISCARD_QUESTION_EDIT_CONFIRM_CONTENT,
  EDIT_QUESTION_CONTENT,
  LOCKED_EXAM_MESSAGE,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExams } from '@/hooks/useExams';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useQuestionForm } from '@/hooks/useQuestionForm';

/** Editar Questão, aberto pela caneta em Questões da Prova ou pelo "Editar" do Visualizar */
export default function EditExamQuestionScreen() {
  const router = useRouter();
  const { provaId, questaoId } = useLocalSearchParams<{ provaId: string; questaoId: string }>();
  // TODO: substituir pelos dados do back.
  const { getExam, getExamQuestions, updateQuestion } = useExams();
  const exam = getExam(provaId);
  const question = exam
    ? getExamQuestions(exam.id).find((item) => item.id === questaoId)
    : undefined;
  const form = useQuestionForm({
    requiredMessages: {
      discipline: EDIT_QUESTION_CONTENT.disciplineRequired,
      content: EDIT_QUESTION_CONTENT.contentRequired,
      title: EDIT_QUESTION_CONTENT.titleRequired,
      statement: EDIT_QUESTION_CONTENT.statementRequired,
      difficulty: EDIT_QUESTION_CONTENT.difficultyRequired,
      alternative: EDIT_QUESTION_CONTENT.alternativeRequired,
    },
    // Os campos começam com os valores atuais da questão
    initialValues: question
      ? {
          title: question.title,
          statement: question.statement,
          disciplineId: question.disciplineId,
          contentId: question.contentId,
          difficulty: question.difficulty,
          alternatives: question.alternatives,
        }
      : undefined,
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Voltar do Android e gesto: perguntam só com alteração não salva
  useLeaveConfirm({ enabled: form.hasChanges, onRequestLeave: openConfirm });

  const handleLeave = () => {
    // Volta para a tela de baixo (Questões da Prova ou Visualizar Questão); aberta sem histórico
    // (ex.: link direto), vai para as questões da prova
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/provas/[provaId]', params: { provaId } });
    }
  };

  // Seta e "Cancelar": sem alteração, saem direto; com alteração não salva, perguntam antes
  const requestLeave = form.hasChanges ? openConfirm : handleLeave;

  // Questão inexistente ou prova de vestibular (que não pode ser alterada)
  const notFoundMessage = !question
    ? EDIT_QUESTION_CONTENT.notFoundMessage
    : exam?.origin === 'vestibular'
      ? LOCKED_EXAM_MESSAGE
      : undefined;

  return (
    <>
      <QuestionFormTemplate
        content={EDIT_QUESTION_CONTENT}
        form={form}
        onSave={() => {
          const values = form.submit();
          if (values && exam && question) {
            // Questões da Prova, o Visualizar e a realização já leem a questão alterada
            // TODO: salvar a edição da questão no back.
            updateQuestion(exam.id, question.id, values);
            handleLeave();
          }
        }}
        onCancel={requestLeave}
        onBack={requestLeave}
        notFoundMessage={notFoundMessage}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={DISCARD_QUESTION_EDIT_CONFIRM_CONTENT.title}
        confirmLabel={DISCARD_QUESTION_EDIT_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DISCARD_QUESTION_EDIT_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar; as alterações são descartadas
        onConfirm={() => {
          setConfirmVisible(false);
          handleLeave();
        }}
        // Só fecha: os campos continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
