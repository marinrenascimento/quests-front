import { useState } from 'react';

type Options = {
  /** Mensagem mostrada no nome do deck quando ele está vazio ao validar */
  nameRequiredMessage: string;
};

/**
 * Campos do cadastro de deck (nome e descrição) em estado local, com o mesmo padrão de
 * validação do cadastro de usuário: o erro de obrigatório só aparece ao validar e some quando
 * o usuário volta a digitar no campo.
 */
export function useDeckForm({ nameRequiredMessage }: Options) {
  const [name, setNameValue] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  return {
    name,
    description,
    nameError,
    setName: (text: string) => {
      setNameValue(text);
      setNameError(undefined);
    },
    setDescription,
    /**
     * Confere o nome obrigatório e mostra o erro; devolve true se estiver tudo certo.
     * Ainda não é chamado: a tela não tem botão de salvar (decisão pendente).
     */
    // TODO: chamar ao salvar o deck e enviar nome e descrição ao back.
    validate: () => {
      const error = name.trim() ? undefined : nameRequiredMessage;
      setNameError(error);
      return error === undefined;
    },
  };
}

export type DeckFormState = ReturnType<typeof useDeckForm>;
