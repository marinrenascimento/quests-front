import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { DraftQuestion, QuestionValues } from '@/constants/exams';

type ExamCreation = {
  /** Nome da prova em criação (campo de Criar Nova Prova) */
  name: string;
  setName: (text: string) => void;
  /** Questões salvas no Adicionar Questão, na ordem em que foram criadas */
  draftQuestions: DraftQuestion[];
  /** Adiciona a questão ao rascunho e pede o toast de sucesso em Criar Nova Prova */
  addDraftQuestion: (values: QuestionValues) => void;
  /** Toast "Questão Adicionada com Sucesso!" pendente: Criar Nova Prova mostra e chama hide */
  addedToastVisible: boolean;
  hideAddedToast: () => void;
  /** Descarta o rascunho (nome, questões e toast) */
  resetDraft: () => void;
};

const ExamCreationContext = createContext<ExamCreation | null>(null);

type Props = {
  children: ReactNode;
};

/**
 * Rascunho da prova em criação, compartilhado entre Criar Nova Prova e o Adicionar Questão (que
 * abre por cima dela), no mesmo padrão do cadastro de deck (useDeckCreation). Envolve a pilha de
 * Minhas Provas (app/(tabs)/provas/_layout.tsx).
 */
// TODO: persistir a prova e as questões criadas quando o back existir.
export function ExamCreationProvider({ children }: Props) {
  const [name, setName] = useState('');
  const [draftQuestions, setDraftQuestions] = useState<DraftQuestion[]>([]);
  const [addedToastVisible, setAddedToastVisible] = useState(false);

  const addDraftQuestion = useCallback((values: QuestionValues) => {
    setDraftQuestions((prev) => [...prev, { ...values, id: `rascunho-${Date.now().toString(36)}` }]);
    setAddedToastVisible(true);
  }, []);

  const hideAddedToast = useCallback(() => setAddedToastVisible(false), []);

  const resetDraft = useCallback(() => {
    setName('');
    setDraftQuestions([]);
    setAddedToastVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      name,
      setName,
      draftQuestions,
      addDraftQuestion,
      addedToastVisible,
      hideAddedToast,
      resetDraft,
    }),
    [name, draftQuestions, addDraftQuestion, addedToastVisible, hideAddedToast, resetDraft],
  );

  return <ExamCreationContext.Provider value={value}>{children}</ExamCreationContext.Provider>;
}

/** Rascunho da prova em criação. Só funciona dentro do ExamCreationProvider. */
export function useExamCreation(): ExamCreation {
  const context = useContext(ExamCreationContext);
  if (!context) {
    throw new Error('useExamCreation precisa estar dentro do ExamCreationProvider.');
  }
  return context;
}
