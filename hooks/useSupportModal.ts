import { useState } from 'react';

import type { SupportModalContent } from '@/constants/helpContent';

/**
 * Estado do modal de suporte (aviso com o e-mail do suporte e um botão só), aberto pelo
 * "Esqueceu Sua Senha?" do login e do cadastro e pelo "Falar com o Suporte" da ajuda. Devolve
 * a ação de abrir e as props prontas do ConfirmModal.
 */
export function useSupportModal(content: SupportModalContent) {
  const [visible, setVisible] = useState(false);
  const close = () => setVisible(false);

  return {
    open: () => setVisible(true),
    modalProps: {
      visible,
      title: content.title,
      highlight: content.email,
      // O e-mail fica inteiro numa linha (a fonte diminui), sem quebrar o ".com" para baixo
      highlightLines: 1,
      description: content.description,
      confirmLabel: content.closeLabel,
      onConfirm: close,
      onCancel: close,
    },
  };
}
