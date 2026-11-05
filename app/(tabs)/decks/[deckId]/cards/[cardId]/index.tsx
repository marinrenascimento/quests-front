import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { FlashcardViewTemplate } from '@/components/templates/FlashcardViewTemplate';
import {
  DeckCard,
  DELETE_CARD_CONFIRM_CONTENT,
  VIEW_FLASHCARD_CONTENT,
} from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { useDecks } from '@/hooks/useDecks';
import { useSubjects } from '@/hooks/useSubjects';
import { cardName } from '@/utils/cardName';

/**
 * Visualizar Card, aberto pelo olho de um card em Cards do Deck. Só lê; dá acesso a Editar e
 * Excluir, como o Visualizar Questão.
 */
export default function ViewDeckCardScreen() {
  const router = useRouter();
  const { deckId, cardId } = useLocalSearchParams<{ deckId: string; cardId: string }>();
  const { decks, getDeckCards, deleteCard } = useDecks();
  // Mesmo catálogo de disciplinas e conteúdos do formulário (o mock + os criados no app)
  const { disciplines, contents } = useSubjects();
  // TODO: substituir pelos dados do back.
  const deck = decks.find((item) => item.id === deckId);
  const found = deck ? getDeckCards(deck).find((item) => item.id === cardId) : undefined;
  // Card excluído aqui: continua na tela enquanto ela sai (sem piscar "Não Encontrado")
  const [removedCard, setRemovedCard] = useState<DeckCard | null>(null);
  const card = found ?? removedCard ?? undefined;
  const discipline = disciplines.find((item) => item.id === card?.disciplineId);
  const content = contents.find((item) => item.id === card?.contentId);
  const [deleteVisible, setDeleteVisible] = useState(false);

  const handleBack = () => {
    // Volta para os cards do deck (que ficam por baixo na pilha); aberta sem histórico
    // (ex.: link direto), vai para eles
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/decks/[deckId]', params: { deckId } });
    }
  };

  const handleConfirmDelete = () => {
    // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
    setDeleteVisible(false);
    if (!deck || !found) {
      return;
    }
    // TODO: excluir o card (e o deck, se era o último card) no back.
    setRemovedCard(found);
    if (deleteCard(deck.id, found.id)) {
      // Era o último card: o deck também saiu, e a tela volta para Meus Decks (RN-034, RN-035)
      if (router.canDismiss()) {
        router.dismissTo('/(tabs)/decks');
      } else {
        router.replace('/(tabs)/decks');
      }
    } else {
      handleBack();
    }
  };

  return (
    <>
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
        actions={
          found
            ? {
                editLabel: VIEW_FLASHCARD_CONTENT.editLabel,
                deleteLabel: VIEW_FLASHCARD_CONTENT.deleteLabel,
                // push: o Visualizar fica por baixo e o Editar Flashcard volta para ele, já com os
                // valores novos
                onEdit: () =>
                  router.push({
                    pathname: '/(tabs)/decks/[deckId]/cards/[cardId]/editar',
                    params: { deckId, cardId },
                  }),
                onDelete: () => setDeleteVisible(true),
              }
            : undefined
        }
        onBack={handleBack}
        backLabel={BACK_LABEL}
      />
      <ConfirmModal
        visible={deleteVisible}
        title={DELETE_CARD_CONFIRM_CONTENT.title}
        // O card não tem título: o destaque é a frente
        highlight={card?.front ?? ''}
        confirmLabel={DELETE_CARD_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DELETE_CARD_CONFIRM_CONTENT.cancelLabel}
        onConfirm={handleConfirmDelete}
        // Só fecha: o card continua no deck
        onCancel={() => setDeleteVisible(false)}
      />
    </>
  );
}
