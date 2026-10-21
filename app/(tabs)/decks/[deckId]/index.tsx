import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DeckCardsTemplate } from '@/components/templates/DeckCardsTemplate';
import {
  CARD_ACTIONS,
  CardActionKey,
  DECK_CARDS_CONTENT,
  DeckCard,
  deckSubjectLabel,
  DELETE_CARD_CONFIRM_CONTENT,
} from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { getMockDeckCards } from '@/constants/mockDeckCards';
import { MOCK_DECKS } from '@/constants/mockDecks';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

export default function DeckCardsScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  // TODO: substituir pelos dados do back.
  const deck = MOCK_DECKS.find((item) => item.id === deckId);
  const cards = useMemo(() => (deck ? getMockDeckCards(deck) : []), [deck]);
  // Card da lixeira tocada: continua guardado ao fechar, para o título não sumir durante o fade
  const [cardToDelete, setCardToDelete] = useState<DeckCard | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  // Estável (os cards de um deck vêm do cache), para não re-renderizar a lista inteira
  const handleCardAction = useCallback(
    (action: CardActionKey, cardId: string) => {
      switch (action) {
        case 'edit':
          // TODO: editar card (cardId).
          break;
        case 'delete': {
          const card = cards.find((item) => item.id === cardId);
          if (card) {
            setCardToDelete(card);
            setDeleteVisible(true);
          }
          break;
        }
        case 'view':
          // TODO: visualizar card (cardId).
          break;
      }
    },
    [cards],
  );

  return (
    <>
      <DeckCardsTemplate
        title={deck?.title ?? ''}
        cardLabel={deck ? deckSubjectLabel(deck) : ''}
        cards={cards}
        emptyMessage={
          deck ? DECK_CARDS_CONTENT.emptyMessage : DECK_CARDS_CONTENT.notFoundMessage
        }
        headerActions={
          deck
            ? [
                {
                  key: 'study',
                  label: DECK_CARDS_CONTENT.studyLabel,
                  // push: a lista de cards fica por baixo e o voltar (Encerrar Revisão) retorna a ela
                  onPress: () =>
                    router.push({
                      pathname: '/(tabs)/decks/[deckId]/estudar',
                      params: { deckId: deck.id },
                    }),
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
      <ConfirmModal
        visible={deleteVisible}
        title={DELETE_CARD_CONFIRM_CONTENT.title}
        highlight={cardToDelete?.title ?? ''}
        confirmLabel={DELETE_CARD_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DELETE_CARD_CONFIRM_CONTENT.cancelLabel}
        // Só front: o card não é excluído, o modal apenas fecha
        // TODO: excluir o card no back (cardToDelete.id) e atualizar a lista.
        onConfirm={() => setDeleteVisible(false)}
        onCancel={() => setDeleteVisible(false)}
      />
    </>
  );
}
