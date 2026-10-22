import { useLocalSearchParams, useRouter } from 'expo-router';

import { FlashcardFormTemplate } from '@/components/templates/FlashcardFormTemplate';
import { EDIT_FLASHCARD_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';
import { useFlashcardForm } from '@/hooks/useFlashcardForm';

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
      // Seta e "Cancelar": saem direto, sem confirmação, descartando as alterações
      onCancel={handleLeave}
      notFoundMessage={card ? undefined : EDIT_FLASHCARD_CONTENT.notFoundMessage}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
