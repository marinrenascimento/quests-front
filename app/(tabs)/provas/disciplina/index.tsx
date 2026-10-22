import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DisciplineStudyTemplate } from '@/components/templates/DisciplineStudyTemplate';
import {
  CANCEL_EXAM_DISCIPLINE_STUDY_CONFIRM_CONTENT,
  DISCIPLINE_STUDY_EXAM_ID,
  EXAM_DISCIPLINE_STUDY_CONTENT,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExamDisciplineStudyForm } from '@/hooks/useExamDisciplineStudyForm';
import { useExams } from '@/hooks/useExams';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';

/** Configurar Prova por Disciplina, aberto pelo "Estudar por Disciplina" de Minhas Provas */
export default function ExamDisciplineStudyConfigScreen() {
  const router = useRouter();
  const { startDisciplineStudy } = useExams();
  const form = useExamDisciplineStudyForm({
    messages: {
      discipline: EXAM_DISCIPLINE_STUDY_CONTENT.disciplineRequired,
      quantity: EXAM_DISCIPLINE_STUDY_CONTENT.quantityRequired,
      noQuestions: EXAM_DISCIPLINE_STUDY_CONTENT.noQuestions,
    },
    allDifficultiesLabel: EXAM_DISCIPLINE_STUDY_CONTENT.allDifficultiesLabel,
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Voltar do Android e gesto: perguntam só se alguma escolha foi feita
  useLeaveConfirm({ enabled: form.hasChoices, onRequestLeave: openConfirm });

  const handleLeave = () => {
    // Volta para Minhas Provas (que fica por baixo na pilha); aberta sem histórico, vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/provas');
    }
  };

  return (
    <>
      <DisciplineStudyTemplate
        content={EXAM_DISCIPLINE_STUDY_CONTENT}
        form={form}
        difficulty={{
          label: EXAM_DISCIPLINE_STUDY_CONTENT.difficultyLabel,
          placeholder: EXAM_DISCIPLINE_STUDY_CONTENT.difficultyPlaceholder,
          options: form.difficultyOptions,
          selectedId: form.difficultyId,
          onSelect: form.selectDifficulty,
          emptyMessage: EXAM_DISCIPLINE_STUDY_CONTENT.difficultyEmpty,
          error: form.errors.difficulty,
        }}
        onStudy={() => {
          const study = form.submit();
          if (study) {
            // Prova temporária: fica só em memória, fora de Minhas Provas
            startDisciplineStudy(study);
            // push: a configuração fica por baixo e sair/entregar a prova volta para ela
            router.push({
              pathname: '/(tabs)/provas/[provaId]/estudar',
              params: { provaId: DISCIPLINE_STUDY_EXAM_ID },
            });
          }
        }}
        onCancel={openConfirm}
        // Sem nenhuma escolha, não há nada a perder: sai direto
        onBack={form.hasChoices ? openConfirm : handleLeave}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={CANCEL_EXAM_DISCIPLINE_STUDY_CONFIRM_CONTENT.title}
        confirmLabel={CANCEL_EXAM_DISCIPLINE_STUDY_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={CANCEL_EXAM_DISCIPLINE_STUDY_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
        onConfirm={() => {
          setConfirmVisible(false);
          handleLeave();
        }}
        // Só fecha: as escolhas continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
