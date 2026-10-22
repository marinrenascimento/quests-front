import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { FlashcardFormTemplate } from '@/components/templates/FlashcardFormTemplate';
import { CANCEL_CARD_CONFIRM_CONTENT, FLASHCARD_FORM_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';
import { useFlashcardForm } from '@/hooks/useFlashcardForm';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';

/** Novo Flashcard aberto pelo "Adicionar Card" de um deck que já existe */
export default function AddDeckCardScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  const { decks, addCardToDeck } = useDecks();
  // TODO: substituir pelos dados do back.
  const deck = decks.find((item) => item.id === deckId);
  const form = useFlashcardForm({
    requiredMessages: {
      discipline: FLASHCARD_FORM_CONTENT.disciplineRequired,
      content: FLASHCARD_FORM_CONTENT.contentRequired,
      front: FLASHCARD_FORM_CONTENT.frontRequired,
      back: FLASHCARD_FORM_CONTENT.backSideRequired,
    },
  });
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Voltar do Android e gesto: perguntam só com texto na frente ou no verso
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

  return (
    <>
      <FlashcardFormTemplate
        content={FLASHCARD_FORM_CONTENT}
        form={form}
        onSave={() => {
          const card = form.submit();
          if (card) {
            // Entra no fim do deck, que mostra o toast de sucesso ao voltar
            // TODO: salvar o card no back.
            if (deck) {
              addCardToDeck(deck.id, card);
            }
            handleLeave();
          }
        }}
        onCancel={openConfirm}
        // Sem texto na frente nem no verso, não há nada a perder: sai direto
        onBack={form.hasChanges ? openConfirm : handleLeave}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={CANCEL_CARD_CONFIRM_CONTENT.title}
        confirmLabel={CANCEL_CARD_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={CANCEL_CARD_CONFIRM_CONTENT.cancelLabel}
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
