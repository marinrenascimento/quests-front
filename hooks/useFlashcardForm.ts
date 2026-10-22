import { useState } from 'react';

import { LinkedCard } from '@/constants/decks';
import { useDeckCreation } from '@/hooks/useDeckCreation';
import { normalizeSearch } from '@/utils/normalizeSearch';

type Field = 'discipline' | 'content' | 'front' | 'back';
type Errors = Partial<Record<Field, string>>;

/** Valores atuais de um card que já existe (ids do catálogo de disciplinas e conteúdos) */
export type FlashcardInitialValues = {
  disciplineId: string;
  contentId: string;
  front: string;
  back: string;
};

type Options = {
  /** Mensagem de obrigatório de cada campo, mostrada abaixo dele ao salvar */
  requiredMessages: Record<Field, string>;
  /**
   * Criação: nome da disciplina que já vem escolhida (ex.: a do deck, no "Adicionar Card"); o
   * usuário pode trocar. Sem disciplina com esse nome no catálogo, o campo começa vazio.
   */
  initialDisciplineName?: string;
  /**
   * Edição: os campos começam com os valores do card. Com eles, Cancelar fica sempre visível e
   * Salvar só aparece quando algum valor for diferente do original. Sem eles, é uma criação.
   */
  initialValues?: FlashcardInitialValues;
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'pt-BR');

/**
 * Campos do Novo Flashcard e do Editar Flashcard em estado local, com o padrão de validação do
 * cadastro de usuário: os erros de obrigatório só aparecem ao salvar e somem quando o campo é
 * preenchido de novo. Disciplinas e conteúdos vêm do DeckCreationProvider (o mock + os criados
 * na hora). O conteúdo depende da disciplina: lista só os dela e é limpo quando a disciplina
 * muda. A visibilidade dos botões é decidida aqui (showCancel e showSave).
 */
export function useFlashcardForm({
  requiredMessages,
  initialDisciplineName,
  initialValues,
}: Options) {
  const { disciplines, contents, addDiscipline, addContent } = useDeckCreation();
  // Valores originais da edição, congelados na abertura da tela (base da comparação)
  const [original] = useState(initialValues);
  const [disciplineId, setDisciplineId] = useState<string | undefined>(() => {
    if (original) {
      return original.disciplineId;
    }
    return initialDisciplineName === undefined
      ? undefined
      : disciplines.find(
          (item) => normalizeSearch(item.name) === normalizeSearch(initialDisciplineName),
        )?.id;
  });
  const [contentId, setContentId] = useState<string | undefined>(original?.contentId);
  const [front, setFrontValue] = useState(original?.front ?? '');
  const [back, setBackValue] = useState(original?.back ?? '');
  const [errors, setErrors] = useState<Errors>({});

  const discipline = disciplines.find((item) => item.id === disciplineId);
  const content = contents.find((item) => item.id === contentId);
  const filled = front.trim() !== '' && back.trim() !== '';
  // Edição: alteração real em algum campo (textos comparados sem os espaços das pontas)
  const changed =
    original !== undefined &&
    (disciplineId !== original.disciplineId ||
      contentId !== original.contentId ||
      front.trim() !== original.front.trim() ||
      back.trim() !== original.back.trim());

  function clearError(field: Field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function selectDiscipline(id: string) {
    if (id !== disciplineId) {
      setContentId(undefined);
    }
    setDisciplineId(id);
    clearError('discipline');
  }

  function selectContent(id: string) {
    setContentId(id);
    clearError('content');
  }

  return {
    disciplineOptions: [...disciplines]
      .sort(byName)
      .map((item) => ({ id: item.id, label: item.name })),
    /** Vazio enquanto nenhuma disciplina foi escolhida */
    contentOptions: contents
      .filter((item) => item.disciplineId === disciplineId)
      .sort(byName)
      .map((item) => ({ id: item.id, label: item.name })),
    disciplineId,
    contentId,
    front,
    back,
    errors,
    /**
     * Criação: Cancelar só aparece com frente e verso preenchidos (sem contar espaços).
     * Edição: sempre visível.
     */
    showCancel: original ? true : filled,
    /**
     * Criação: Salvar aparece com frente e verso preenchidos. Edição: só com alteração real. Em
     * ambos, a disciplina, o conteúdo, a frente e o verso são conferidos ao salvar.
     */
    showSave: original ? changed : filled,
    selectDiscipline,
    selectContent,
    // TODO: criar a disciplina e o conteúdo no back (hoje só no estado em memória).
    createDiscipline: (name: string) => selectDiscipline(addDiscipline(name).id),
    /** Vincula o conteúdo novo à disciplina escolhida (sem disciplina, não faz nada) */
    createContent: (name: string) => {
      if (disciplineId) {
        selectContent(addContent(disciplineId, name).id);
      }
    },
    setFront: (text: string) => {
      setFrontValue(text);
      clearError('front');
    },
    setBack: (text: string) => {
      setBackValue(text);
      clearError('back');
    },
    /**
     * Confere os campos obrigatórios e mostra os erros. Com tudo certo, devolve o card (sem id,
     * com frente e verso sem espaços nas pontas); senão, null.
     */
    submit: (): Omit<LinkedCard, 'id'> | null => {
      const nextErrors: Errors = {};
      if (!discipline) nextErrors.discipline = requiredMessages.discipline;
      if (!content) nextErrors.content = requiredMessages.content;
      if (!front.trim()) nextErrors.front = requiredMessages.front;
      if (!back.trim()) nextErrors.back = requiredMessages.back;

      setErrors(nextErrors);
      if (!discipline || !content || Object.keys(nextErrors).length > 0) {
        return null;
      }
      return { discipline, content, front: front.trim(), back: back.trim() };
    },
  };
}

export type FlashcardFormState = ReturnType<typeof useFlashcardForm>;
