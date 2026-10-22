import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { ExamFormTemplate } from '@/components/templates/ExamFormTemplate';
import { subjectLabel } from '@/constants/decks';
import {
  CANCEL_EXAM_CONFIRM_CONTENT,
  EXAM_FORM_CONTENT,
  QUESTION_ADDED_TOAST,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExamCreation } from '@/hooks/useExamCreation';
import { useExamForm } from '@/hooks/useExamForm';
import { useExams } from '@/hooks/useExams';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useSubjectNames } from '@/hooks/useSubjects';

/** Criar Nova Prova, aberta pelo botão de Minhas Provas */
export default function NewExamScreen() {
  const router = useRouter();
  const form = useExamForm({ nameRequiredMessage: EXAM_FORM_CONTENT.nameRequired });
  const { draftQuestions, addedToastVisible, hideAddedToast, resetDraft } = useExamCreation();
  const { createExam } = useExams();
  const { disciplineNames, contentNames } = useSubjectNames();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Só ter questão adicionada conta como algo a perder (o nome sozinho, não)
  const hasQuestions = draftQuestions.length > 0;
  // Voltar do Android e gesto: com questão adicionada, perguntam como o "Cancelar"
  useLeaveConfirm({ enabled: hasQuestions, onRequestLeave: openConfirm });

  // "Disciplina - Conteúdo" e o título de cada questão do rascunho
  const questionItems = useMemo(
    () =>
      draftQuestions.map((question) => ({
        id: question.id,
        label: subjectLabel(
          disciplineNames.get(question.disciplineId) ?? '',
          contentNames.get(question.contentId) ?? '',
        ),
        title: question.title,
      })),
    [draftQuestions, disciplineNames, contentNames],
  );

  // O Adicionar Questão abre por cima (esta tela continua montada). Ao sair da pilha (voltar,
  // salvar ou cancelar, ou trocar de aba), o rascunho é descartado e a próxima prova começa vazia
  useEffect(() => resetDraft, [resetDraft]);

  const handleLeave = () => {
    // Volta para Minhas Provas; aberta sem histórico na pilha (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/provas');
    }
  };

  return (
    <>
      <ExamFormTemplate
        content={EXAM_FORM_CONTENT}
        form={form}
        // push: Criar Nova Prova fica por baixo e o Adicionar Questão volta para ela
        onAddQuestionPress={() => router.push('/(tabs)/provas/nova/questao')}
        questions={questionItems}
        toast={{ message: QUESTION_ADDED_TOAST, visible: addedToastVisible, onHide: hideAddedToast }}
        // Com questão adicionada, pergunta como o "Cancelar"; sem, sai direto
        onBack={hasQuestions ? openConfirm : handleLeave}
        onSave={() => {
          if (form.validate()) {
            // Cria em memória (Minhas Provas passa a listá-la no início da grade)
            // TODO: salvar a prova e as questões no back.
            createExam({ title: form.name.trim(), questions: draftQuestions });
            handleLeave();
          }
        }}
        onCancel={openConfirm}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={CANCEL_EXAM_CONFIRM_CONTENT.title}
        confirmLabel={CANCEL_EXAM_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={CANCEL_EXAM_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar; o rascunho é descartado ao sair da pilha (efeito acima)
        onConfirm={() => {
          setConfirmVisible(false);
          handleLeave();
        }}
        // Só fecha: o nome e as questões continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
