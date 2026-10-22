import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { StudySessionTemplate } from '@/components/templates/StudySessionTemplate';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import {
  COMPLETED_IMAGE,
  DIFFICULTY_OPTIONS,
  END_CONFIRM_CONTENT,
  STUDY_CONTENT,
} from '@/constants/study';
import { useDecks } from '@/hooks/useDecks';
import { useStudySession } from '@/hooks/useStudySession';

export default function StudyScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  // TODO: substituir pelos dados do back.
  const { decks, getDeckCards } = useDecks();
  const deck = decks.find((item) => item.id === deckId);
  const session = useStudySession(deck ? getDeckCards(deck) : []);
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
        // Início"), com o deck vazio ou inexistente, sai direto
        onEnd={session.card ? () => setConfirmVisible(true) : handleEnd}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
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
          handleEnd();
        }}
        // Só fecha: o card, o lado e a dificuldade continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
