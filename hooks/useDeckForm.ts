import { useState } from 'react';

import { useDeckCreation } from '@/hooks/useDeckCreation';

type Options = {
  /** Mensagem mostrada no nome do deck quando ele está vazio ao validar */
  nameRequiredMessage: string;
};

/**
 * Campos do cadastro de deck (nome e descrição), com o mesmo padrão de validação do cadastro
 * de usuário: o erro de obrigatório só aparece ao validar e some quando o usuário volta a
 * digitar no campo. Os valores ficam no rascunho do DeckCreationProvider, para não se perderem
 * ao abrir o Novo Flashcard e voltar; o erro fica em estado local.
 */
export function useDeckForm({ nameRequiredMessage }: Options) {
  const { name, description, setName, setDescription, linkedCards } = useDeckCreation();
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  return {
    name,
    description,
    nameError,
    /** Salvar e Cancelar só aparecem depois que o primeiro card for vinculado */
    showActions: linkedCards.length > 0,
    setName: (text: string) => {
      setName(text);
      setNameError(undefined);
    },
    setDescription,
    /**
     * Confere o nome obrigatório (a descrição é opcional) e mostra o erro; devolve true se
     * estiver tudo certo. Chamado pelo Salvar do cadastro de deck.
     */
    validate: () => {
      const error = name.trim() ? undefined : nameRequiredMessage;
      setNameError(error);
      return error === undefined;
    },
  };
}

export type DeckFormState = ReturnType<typeof useDeckForm>;
