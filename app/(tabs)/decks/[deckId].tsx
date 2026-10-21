import { useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';

import { DeckCardsTemplate } from '@/components/templates/DeckCardsTemplate';
import {
  CARD_ACTIONS,
  CardActionKey,
  DECK_CARDS_CONTENT,
  deckSubjectLabel,
} from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { getMockDeckCards } from '@/constants/mockDeckCards';
import { MOCK_DECKS } from '@/constants/mockDecks';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

export default function DeckCardsScreen() {
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  // TODO: substituir pelos dados do back.
  const deck = MOCK_DECKS.find((item) => item.id === deckId);

  const handleCardAction = useCallback((action: CardActionKey, cardId: string) => {
    switch (action) {
      case 'edit':
        // TODO: editar card (cardId).
        break;
      case 'delete':
        // TODO: excluir card com confirmação (cardId).
        break;
      case 'view':
        // TODO: visualizar card (cardId).
        break;
    }
  }, []);

  return (
    <DeckCardsTemplate
      title={deck?.title ?? ''}
      cardLabel={deck ? deckSubjectLabel(deck) : ''}
      cards={deck ? getMockDeckCards(deck) : []}
      emptyMessage={deck ? DECK_CARDS_CONTENT.emptyMessage : DECK_CARDS_CONTENT.notFoundMessage}
      headerActions={
        deck
          ? [
              {
                key: 'study',
                label: DECK_CARDS_CONTENT.studyLabel,
                onPress: () => {
                  // TODO: criar tela e navegar.
                },
              },
              {
                key: 'add',
                label: DECK_CARDS_CONTENT.addLabel,
                onPress: () => {
                  // TODO: criar tela e navegar.
                },
              },
            ]
          : []
      }
      cardActions={CARD_ACTIONS}
      onCardAction={handleCardAction}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
