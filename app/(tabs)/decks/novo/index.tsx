import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { DeckFormTemplate } from '@/components/templates/DeckFormTemplate';
import {
  CANCEL_DECK_CONFIRM_CONTENT,
  DECK_FORM_CONTENT,
  LINKED_CARD_TOAST,
} from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDeckCreation } from '@/hooks/useDeckCreation';
import { useDeckForm } from '@/hooks/useDeckForm';
import { useDecks } from '@/hooks/useDecks';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';

export default function NewDeckScreen() {
  const router = useRouter();
  const form = useDeckForm({ nameRequiredMessage: DECK_FORM_CONTENT.nameRequired });
  const { linkedCards, linkedToastVisible, hideLinkedToast, resetDraft } = useDeckCreation();
  const { createDeck } = useDecks();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const openConfirm = useCallback(() => setConfirmVisible(true), []);
  // Só ter card vinculado conta como algo a perder (nome e descrição sozinhos, não)
  const hasLinkedCards = linkedCards.length > 0;
  // Voltar do Android e gesto: com card vinculado, perguntam como o "Cancelar"
  useLeaveConfirm({ enabled: hasLinkedCards, onRequestLeave: openConfirm });

  // O Novo Flashcard abre por cima (esta tela continua montada). Ao sair da pilha (voltar,
  // salvar ou cancelar para Meus Decks, ou trocar de aba), o rascunho é descartado e o próximo
  // deck começa vazio. Limpar só aqui evita o formulário esvaziar durante a animação de saída.
  useEffect(() => resetDraft, [resetDraft]);

  const handleLeave = () => {
    // Volta para Meus Decks; aberta sem histórico na pilha (ex.: link direto), vai para a lista
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/decks');
    }
  };

  return (
    <>
      <DeckFormTemplate
        content={DECK_FORM_CONTENT}
        form={form}
        // push: o cadastro de deck fica por baixo e o Novo Flashcard volta para ele
        onAddCardPress={() => router.push('/(tabs)/decks/novo/card')}
        linkedCards={linkedCards}
        toast={{ message: LINKED_CARD_TOAST, visible: linkedToastVisible, onHide: hideLinkedToast }}
        // Com card vinculado, pergunta como o "Cancelar"; sem, sai direto
        onBack={hasLinkedCards ? openConfirm : handleLeave}
        onSave={() => {
          if (form.validate()) {
            // Cria em memória (Meus Decks passa a listá-lo no início da grade)
            // TODO: salvar o deck e os cards no back.
            createDeck({
              title: form.name.trim(),
              description: form.description.trim(),
              cards: linkedCards,
            });
            handleLeave();
          }
        }}
        onCancel={openConfirm}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={CANCEL_DECK_CONFIRM_CONTENT.title}
        confirmLabel={CANCEL_DECK_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={CANCEL_DECK_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela; o rascunho
        // é descartado ao sair da pilha (efeito acima)
        onConfirm={() => {
          setConfirmVisible(false);
          handleLeave();
        }}
        // Só fecha: o nome, a descrição e os cards continuam como estavam
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
}
