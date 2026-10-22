import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { StudySessionTemplate } from '@/components/templates/StudySessionTemplate';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import {
  COMPLETED_IMAGE,
  DIFFICULTY_OPTIONS,
  DISCIPLINE_STUDY_SESSION_CONTENT,
  END_CONFIRM_CONTENT,
} from '@/constants/study';
import { useDecks } from '@/hooks/useDecks';
import { useStudySession } from '@/hooks/useStudySession';

/**
 * Revisão do estudo por disciplina: a mesma revisão de um deck (template, hook e modal), com o
 * deck temporário montado em Configurar Deck por Disciplina (nome "Disciplina - Conteúdo" e os
 * cards sorteados). Encerrar e "Voltar para o Início" voltam para a configuração.
 */
export default function DisciplineStudyScreen() {
  const router = useRouter();
  const { disciplineStudy } = useDecks();
  const session = useStudySession(disciplineStudy?.cards ?? []);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleEnd = () => {
    // Volta para a configuração (que fica por baixo na pilha, com as escolhas); aberta sem
    // histórico (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/decks/disciplina');
    }
  };

  return (
    <>
      <StudySessionTemplate
        title={disciplineStudy?.title ?? ''}
        content={DISCIPLINE_STUDY_SESSION_CONTENT}
        difficultyOptions={DIFFICULTY_OPTIONS}
        // Sem estudo configurado: "Nenhum Estudo Configurado" e só o botão de encerrar
        notFound={!disciplineStudy}
        session={session}
        completedImage={COMPLETED_IMAGE}
        // Com um card na tela (revisão em andamento) pede confirmação; no fim ("Voltar para o
        // Início") ou sem estudo configurado, sai direto
        onEnd={session.card ? () => setConfirmVisible(true) : handleEnd}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={END_CONFIRM_CONTENT.title}
        highlight={disciplineStudy?.title ?? ''}
        confirmLabel={END_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={END_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
        onConfirm={() => {
          setConfirmVisible(false);
          handleEnd();
        }}
        // Só fecha: o card, o lado e a dificuldade continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
