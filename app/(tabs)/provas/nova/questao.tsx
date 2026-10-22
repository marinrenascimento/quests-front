import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { QuestionFormTemplate } from '@/components/templates/QuestionFormTemplate';
import { CANCEL_QUESTION_CONFIRM_CONTENT, QUESTION_FORM_CONTENT } from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExamCreation } from '@/hooks/useExamCreation';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useQuestionForm } from '@/hooks/useQuestionForm';

/** Adicionar Questão aberto por Criar Nova Prova: a questão vai para o rascunho da prova */
export default function NewExamQuestionScreen() {
  const router = useRouter();
  const { addDraftQuestion } = useExamCreation();
  const form = useQuestionForm({
    requiredMessages: {
      discipline: QUESTION_FORM_CONTENT.disciplineRequired,
      content: QUESTION_FORM_CONTENT.contentRequired,
      title: QUESTION_FORM_CONTENT.titleRequired,
      statement: QUESTION_FORM_CONTENT.statementRequired,
      difficulty: QUESTION_FORM_CONTENT.difficultyRequired,
      alternative: QUESTION_FORM_CONTENT.alternativeRequired,
    },
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Voltar do Android e gesto: perguntam só com texto no título, no enunciado ou numa alternativa
  useLeaveConfirm({ enabled: form.hasChanges, onRequestLeave: openConfirm });

  const handleLeave = () => {
    // Volta para Criar Nova Prova (que fica por baixo na pilha); aberta sem histórico (ex.: link
    // direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/provas/nova');
    }
  };

  return (
    <>
      <QuestionFormTemplate
        content={QUESTION_FORM_CONTENT}
        form={form}
        onSave={() => {
          const question = form.submit();
          if (question) {
            // Entra no rascunho da prova, que mostra o toast de sucesso ao voltar
            // TODO: salvar a questão no back junto com a prova.
            addDraftQuestion(question);
            handleLeave();
          }
        }}
        onCancel={openConfirm}
        // Sem nada escrito, não há nada a perder: sai direto
        onBack={form.hasChanges ? openConfirm : handleLeave}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={CANCEL_QUESTION_CONFIRM_CONTENT.title}
        confirmLabel={CANCEL_QUESTION_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={CANCEL_QUESTION_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
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
