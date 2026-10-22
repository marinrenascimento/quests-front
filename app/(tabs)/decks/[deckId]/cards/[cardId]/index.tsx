import { useLocalSearchParams, useRouter } from 'expo-router';

import { FlashcardViewTemplate } from '@/components/templates/FlashcardViewTemplate';
import { VIEW_FLASHCARD_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';
import { useSubjects } from '@/hooks/useSubjects';
import { cardName } from '@/utils/cardName';

/** Visualizar Card, aberto pelo olho de um card em Cards do Deck. Só lê: nada é alterado aqui. */
export default function ViewDeckCardScreen() {
  const router = useRouter();
  const { deckId, cardId } = useLocalSearchParams<{ deckId: string; cardId: string }>();
  const { decks, getDeckCards } = useDecks();
  // Mesmo catálogo de disciplinas e conteúdos do formulário (o mock + os criados no app)
  const { disciplines, contents } = useSubjects();
  // TODO: substituir pelos dados do back.
  const deck = decks.find((item) => item.id === deckId);
  const card = deck ? getDeckCards(deck).find((item) => item.id === cardId) : undefined;
  const discipline = disciplines.find((item) => item.id === card?.disciplineId);
  const content = contents.find((item) => item.id === card?.contentId);

  const handleBack = () => {
    // Volta para os cards do deck (que ficam por baixo na pilha); aberta sem histórico
    // (ex.: link direto), vai para eles
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/decks/[deckId]', params: { deckId } });
    }
  };

  return (
    <FlashcardViewTemplate
      title={card ? VIEW_FLASHCARD_CONTENT.title(cardName(card)) : undefined}
      details={
        card
          ? {
              discipline: {
                label: VIEW_FLASHCARD_CONTENT.disciplineLabel,
                value: discipline?.name ?? '',
              },
              content: { label: VIEW_FLASHCARD_CONTENT.contentLabel, value: content?.name ?? '' },
              front: { label: VIEW_FLASHCARD_CONTENT.frontLabel, value: card.front },
              back: { label: VIEW_FLASHCARD_CONTENT.backSideLabel, value: card.back },
            }
          : undefined
      }
      notFoundMessage={VIEW_FLASHCARD_CONTENT.notFoundMessage}
      viewIcon={VIEW_FLASHCARD_CONTENT.viewIcon}
      onBack={handleBack}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
