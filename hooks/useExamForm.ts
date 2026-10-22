import { useState } from 'react';

import { useExamCreation } from '@/hooks/useExamCreation';

type Options = {
  /** Mensagem mostrada no nome da prova quando ele está vazio ao salvar */
  nameRequiredMessage: string;
};

/**
 * Campo de Criar Nova Prova (nome), no padrão do cadastro de deck: o erro de obrigatório só
 * aparece ao salvar e some quando o usuário volta a digitar. O nome fica no rascunho do
 * ExamCreationProvider, para não se perder ao abrir o Adicionar Questão e voltar.
 */
export function useExamForm({ nameRequiredMessage }: Options) {
  const { name, setName, draftQuestions } = useExamCreation();
  const [nameError, setNameError] = useState<string | undefined>(undefined);

  return {
    name,
    nameError,
    /** Salvar e Cancelar só aparecem depois que a primeira questão for adicionada */
    showActions: draftQuestions.length > 0,
    setName: (text: string) => {
      setName(text);
      setNameError(undefined);
    },
    /** Confere o nome obrigatório e mostra o erro; devolve true se estiver tudo certo */
    validate: () => {
      const error = name.trim() ? undefined : nameRequiredMessage;
      setNameError(error);
      return error === undefined;
    },
  };
}

export type ExamFormState = ReturnType<typeof useExamForm>;
