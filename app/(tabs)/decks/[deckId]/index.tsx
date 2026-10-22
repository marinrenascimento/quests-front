import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { FlashcardCardItem } from '@/components/organisms/FlashcardGrid';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DeckCardsTemplate } from '@/components/templates/DeckCardsTemplate';
import {
  CARD_ACTIONS,
  CardActionKey,
  Deck,
  DECK_CARDS_CONTENT,
  DeckCard,
  DELETE_CARD_CONFIRM_CONTENT,
  LINKED_CARD_TOAST,
  subjectLabel,
} from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';
import { useSubjectNames } from '@/hooks/useSubjects';

/** Deck excluído junto com o último card, mostrado enquanto a tela sai (sem piscar o vazio) */
type RemovedDeck = { deck: Deck; items: FlashcardCardItem[] };

export default function DeckCardsScreen() {
  const router = useRouter();
  const { deckId } = useLocalSearchParams<{ deckId: string }>();
  // TODO: substituir pelos dados do back.
  const { decks, getDeckCards, deleteCard, cardAddedToastDeckId, hideCardAddedToast } =
    useDecks();
  // Mesmo catálogo de disciplinas e conteúdos do formulário (o mock + os criados no app)
  const { disciplineNames, contentNames } = useSubjectNames();
  const deck = decks.find((item) => item.id === deckId);
  const cards = useMemo(() => (deck ? getDeckCards(deck) : []), [deck, getDeckCards]);
  // Cada card com a própria "Disciplina - Conteúdo" e a frente (o card não tem título),
  // montados uma vez por lista, fora do renderItem
  const cardItems = useMemo(
    () =>
      cards.map((card) => ({
      id: card.id,
        label: subjectLabel(
          disciplineNames.get(card.disciplineId) ?? '',
          contentNames.get(card.contentId) ?? '',
        ),
        title: card.front,
      })),
    [cards, disciplineNames, contentNames],
  );
  // Card da lixeira tocada: continua guardado ao fechar, para o texto não sumir durante o fade
  const [cardToDelete, setCardToDelete] = useState<DeckCard | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [removedDeck, setRemovedDeck] = useState<RemovedDeck | null>(null);
  const shownDeck = deck ?? removedDeck?.deck;

  // Saindo da tela antes do toast sumir, o aviso não fica pendente para a próxima visita
  useEffect(() => hideCardAddedToast, [hideCardAddedToast]);

  const leaveToDecks = () => {
    // Volta para Meus Decks (que fica por baixo na pilha); aberta sem histórico, vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/decks');
    }
  };

  const handleConfirmDelete = () => {
    // Fecha antes de qualquer navegação, para o modal não aparecer durante a troca de tela
    setDeleteVisible(false);
    if (!deck || !cardToDelete) {
      return;
    }
    // TODO: excluir o card (e o deck, se era o último card) no back.
    const deckDeleted = deleteCard(deck.id, cardToDelete.id);
    if (deckDeleted) {
      // Não existe deck sem cards: o deck saiu de Meus Decks, e a tela volta para lá
      setRemovedDeck({ deck, items: cardItems });
      leaveToDecks();
    }
  };

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
        title={shownDeck?.title ?? ''}
        cards={deck ? cardItems : (removedDeck?.items ?? [])}
        emptyMessage={
          shownDeck ? DECK_CARDS_CONTENT.emptyMessage : DECK_CARDS_CONTENT.notFoundMessage
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
        cardActions={deck ? CARD_ACTIONS : []}
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
        // O card não tem título: o destaque é a frente
        highlight={cardToDelete?.front ?? ''}
        confirmLabel={DELETE_CARD_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DELETE_CARD_CONFIRM_CONTENT.cancelLabel}
        onConfirm={handleConfirmDelete}
        // Só fecha: o card continua no deck
        onCancel={() => setDeleteVisible(false)}
      />
    </>
  );
}
