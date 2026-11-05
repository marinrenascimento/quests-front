import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { StudySessionTemplate } from '@/components/templates/StudySessionTemplate';
import {
  COMPLETED_IMAGE,
  DIFFICULTY_OPTIONS,
  END_CONFIRM_CONTENT,
  STUDY_CONTENT,
} from '@/constants/study';
import { useDecks } from '@/hooks/useDecks';
import { useStudySession } from '@/hooks/useStudySession';
import { buildReviewQueue } from '@/utils/reviewQueue';

export default function StudyScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  // TODO: substituir pelos dados do back.
  const { decks, getDeckCards, saveCardDifficulty } = useDecks();
  const deck = decks.find((item) => item.id === deckId);
  // Montada uma vez, ao abrir: o que for marcado agora só muda as próximas revisões
  const [queue] = useState(() => (deck ? buildReviewQueue(getDeckCards(deck)) : []));
  const session = useStudySession(queue, { onSaveDifficulty: saveCardDifficulty });
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleEnd = () => {
    // Volta para os cards do deck (que ficam por baixo na pilha); aberta sem histórico na pilha
    // de Meus Decks (ex.: link direto), vai para eles
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/decks/[deckId]', params: { deckId } });
    }
  };

  return (
    <>
      <StudySessionTemplate
        title={deck?.title ?? ''}
        content={STUDY_CONTENT}
        difficultyOptions={DIFFICULTY_OPTIONS}
        notFound={!deck}
        session={session}
        completedImage={COMPLETED_IMAGE}
        // Com um card na tela (revisão em andamento) pede confirmação; no fim ("Voltar para o
        // Início") ou com o deck inexistente, sai direto
        onEnd={session.card ? () => setConfirmVisible(true) : handleEnd}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={END_CONFIRM_CONTENT.title}
        highlight={deck?.title ?? ''}
        confirmLabel={END_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={END_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
        onConfirm={() => {
          setConfirmVisible(false);
          session.saveMark();
          handleEnd();
        }}
        // Só fecha: o card, o lado e a dificuldade continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
