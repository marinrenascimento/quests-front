import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { FlashcardFormTemplate } from '@/components/templates/FlashcardFormTemplate';
import { DISCARD_CARD_EDIT_CONFIRM_CONTENT, EDIT_FLASHCARD_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';
import { useFlashcardForm } from '@/hooks/useFlashcardForm';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';

/** Editar Flashcard, aberto pela caneta de um card em Cards do Deck */
export default function EditDeckCardScreen() {
  const router = useRouter();
  const { deckId, cardId } = useLocalSearchParams<{ deckId: string; cardId: string }>();
  const { decks, getDeckCards, updateCard } = useDecks();
  // TODO: substituir pelos dados do back.
  const deck = decks.find((item) => item.id === deckId);
  const card = deck ? getDeckCards(deck).find((item) => item.id === cardId) : undefined;
  const form = useFlashcardForm({
    requiredMessages: {
      discipline: EDIT_FLASHCARD_CONTENT.disciplineRequired,
      content: EDIT_FLASHCARD_CONTENT.contentRequired,
      front: EDIT_FLASHCARD_CONTENT.frontRequired,
      back: EDIT_FLASHCARD_CONTENT.backSideRequired,
    },
    // Os campos começam com os valores atuais do card
    initialValues: card
      ? {
          disciplineId: card.disciplineId,
          contentId: card.contentId,
          front: card.front,
          back: card.back,
        }
      : undefined,
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Voltar do Android e gesto: perguntam só com alteração não salva
  useLeaveConfirm({ enabled: form.hasChanges, onRequestLeave: openConfirm });

  const handleLeave = () => {
    // Volta para os cards do deck (que ficam por baixo na pilha); aberta sem histórico
    // (ex.: link direto), vai para eles
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/decks/[deckId]', params: { deckId } });
    }
  };

  // Seta e "Cancelar": sem alteração, saem direto; com alteração não salva, perguntam antes
  const requestLeave = form.hasChanges ? openConfirm : handleLeave;

  return (
    <>
      <FlashcardFormTemplate
        content={EDIT_FLASHCARD_CONTENT}
        form={form}
        onSave={() => {
          const values = form.submit();
          if (values && deck && card) {
            // Cards do Deck e a revisão já leem o card alterado da mesma fonte
            // TODO: salvar a edição do card no back.
            updateCard(deck.id, card.id, values);
            handleLeave();
          }
        }}
        onCancel={requestLeave}
        onBack={requestLeave}
        notFoundMessage={card ? undefined : EDIT_FLASHCARD_CONTENT.notFoundMessage}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={DISCARD_CARD_EDIT_CONFIRM_CONTENT.title}
        confirmLabel={DISCARD_CARD_EDIT_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DISCARD_CARD_EDIT_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela; as
        // alterações são descartadas
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
