import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DeckCardsTemplate } from '@/components/templates/DeckCardsTemplate';
import {
  CARD_ACTIONS,
  CardActionKey,
  DECK_CARDS_CONTENT,
  DeckCard,
  deckSubjectLabel,
  DELETE_CARD_CONFIRM_CONTENT,
  LINKED_CARD_TOAST,
} from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';

export default function DeckCardsScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  // TODO: substituir pelos dados do back.
  const { decks, getDeckCards, cardAddedToastDeckId, hideCardAddedToast } = useDecks();
  const deck = decks.find((item) => item.id === deckId);
  const cards = useMemo(() => (deck ? getDeckCards(deck) : []), [deck, getDeckCards]);
  // Card da lixeira tocada: continua guardado ao fechar, para o título não sumir durante o fade
  const [cardToDelete, setCardToDelete] = useState<DeckCard | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);

  // Saindo da tela antes do toast sumir, o aviso não fica pendente para a próxima visita
  useEffect(() => hideCardAddedToast, [hideCardAddedToast]);

  // Estável (os cards de um deck vêm do cache), para não re-renderizar a lista inteira
  const handleCardAction = useCallback(
    (action: CardActionKey, cardId: string) => {
      switch (action) {
        case 'edit':
          // push: os cards do deck ficam por baixo e o Editar Flashcard volta para eles
          router.push({
            pathname: '/(tabs)/decks/[deckId]/cards/[cardId]/editar',
            params: { deckId, cardId },
          });
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
          // push: os cards do deck ficam por baixo e o Visualizar Card volta para eles
          router.push({
            pathname: '/(tabs)/decks/[deckId]/cards/[cardId]',
            params: { deckId, cardId },
          });
          break;
      }
    },
    [cards, router, deckId],
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
                  // push: os cards do deck ficam por baixo e o Novo Flashcard volta para eles
                  onPress: () =>
                    router.push({
                      pathname: '/(tabs)/decks/[deckId]/card',
                      params: { deckId: deck.id },
                    }),
                },
              ]
            : []
        }
        cardActions={CARD_ACTIONS}
        onCardAction={handleCardAction}
        // Depois de salvar um card no "Adicionar Card" deste deck
        toast={{
          message: LINKED_CARD_TOAST,
          visible: deck !== undefined && cardAddedToastDeckId === deck.id,
          onHide: hideCardAddedToast,
        }}
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
