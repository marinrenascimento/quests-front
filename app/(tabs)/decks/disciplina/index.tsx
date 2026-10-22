import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DisciplineStudyTemplate } from '@/components/templates/DisciplineStudyTemplate';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import {
  CANCEL_DISCIPLINE_STUDY_CONFIRM_CONTENT,
  DISCIPLINE_STUDY_CONTENT,
} from '@/constants/study';
import { useDecks } from '@/hooks/useDecks';
import { useDisciplineStudyForm } from '@/hooks/useDisciplineStudyForm';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';

/** Configurar Deck por Disciplina, aberto pelo "Estudar por Disciplina" de Meus Decks */
export default function DisciplineStudyConfigScreen() {
  const router = useRouter();
  const { startDisciplineStudy } = useDecks();
  const form = useDisciplineStudyForm({
    requiredMessages: {
      discipline: DISCIPLINE_STUDY_CONTENT.disciplineRequired,
      quantity: DISCIPLINE_STUDY_CONTENT.quantityRequired,
    },
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Voltar do Android e gesto: perguntam só se alguma escolha foi feita
  useLeaveConfirm({ enabled: form.hasChoices, onRequestLeave: openConfirm });

  const handleLeave = () => {
    // Volta para Meus Decks (que fica por baixo na pilha); aberta sem histórico, vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/decks');
    }
  };

  return (
    <>
      <DisciplineStudyTemplate
        content={DISCIPLINE_STUDY_CONTENT}
        form={form}
        onStudy={() => {
          const study = form.submit();
          if (study) {
            // Deck temporário: fica só em memória, fora de Meus Decks
            startDisciplineStudy(study);
            // push: a configuração fica por baixo e o encerrar da revisão volta para ela
            router.push('/(tabs)/decks/disciplina/estudar');
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
        title={CANCEL_DISCIPLINE_STUDY_CONFIRM_CONTENT.title}
        confirmLabel={CANCEL_DISCIPLINE_STUDY_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={CANCEL_DISCIPLINE_STUDY_CONFIRM_CONTENT.cancelLabel}
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
