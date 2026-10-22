import { useState } from 'react';

import { Alternative, QuestionDifficulty, QuestionValues } from '@/constants/exams';
import { useSubjects } from '@/hooks/useSubjects';

type Field = 'discipline' | 'content' | 'title' | 'statement' | 'difficulty';
type Errors = Partial<Record<Field, string>>;

type Options = {
  /**
   * Mensagem de obrigatório de cada campo, mostrada abaixo dele ao salvar, e a de alternativa
   * sem texto
   */
  requiredMessages: Record<Field | 'alternative', string>;
  /** Edição: os campos começam com os valores da questão. Sem eles, é uma criação (tudo vazio). */
  initialValues?: QuestionValues;
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'pt-BR');

/** Edição: alguma alternativa diferente da original (textos sem os espaços das pontas) */
function alternativesChanged(current: Alternative[], original: Alternative[]): boolean {
  return (
    current.length !== original.length ||
    current.some((item, index) => {
      const before = original[index];
      return (
        item.id !== before.id ||
        item.correct !== before.correct ||
        item.text.trim() !== before.text.trim()
      );
    })
  );
}

/**
 * Campos do Adicionar Questão e do Editar Questão em estado local, no padrão do Novo Flashcard:
 * os erros de obrigatório só aparecem ao salvar e somem quando o campo é preenchido de novo.
 * Disciplina e conteúdo vêm do SubjectsProvider (o mesmo catálogo dos cards, com busca e
 * criação); o conteúdo depende da disciplina e é limpo quando ela muda. Alternativas: quantas o
 * usuário quiser, identificadas pela posição (A, B, C...), com exatamente uma correta (marcar
 * outra desmarca a anterior). O Salvar só aparece quando existe uma alternativa correta.
 */
export function useQuestionForm({ requiredMessages, initialValues }: Options) {
  const { disciplines, contents, addDiscipline, addContent } = useSubjects();
  // Valores originais da edição, congelados na abertura da tela (base da comparação)
  const [original] = useState(initialValues);
  const [disciplineId, setDisciplineId] = useState<string | undefined>(original?.disciplineId);
  const [contentId, setContentId] = useState<string | undefined>(original?.contentId);
  const [title, setTitleValue] = useState(original?.title ?? '');
  const [statement, setStatementValue] = useState(original?.statement ?? '');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | undefined>(
    original?.difficulty,
  );
  const [alternatives, setAlternatives] = useState<Alternative[]>(original?.alternatives ?? []);
  const [errors, setErrors] = useState<Errors>({});
  /** Erro de cada alternativa sem texto, pelo id dela */
  const [alternativeErrors, setAlternativeErrors] = useState<Record<string, string>>({});

  const discipline = disciplines.find((item) => item.id === disciplineId);
  const content = contents.find((item) => item.id === contentId);
  const hasCorrect = alternatives.some((item) => item.correct);
  // Edição: alteração real em algum campo (textos comparados sem os espaços das pontas)
  const changed =
    original !== undefined &&
    (disciplineId !== original.disciplineId ||
      contentId !== original.contentId ||
      title.trim() !== original.title.trim() ||
      statement.trim() !== original.statement.trim() ||
      difficulty !== original.difficulty ||
      alternativesChanged(alternatives, original.alternatives));

  function clearError(field: Field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function clearAlternativeError(id: string) {
    setAlternativeErrors((prev) => {
      if (!(id in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[id];
      return next;
    });
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
    title,
    statement,
    difficulty,
    alternatives,
    errors,
    alternativeErrors,
    /** Salvar só aparece com uma alternativa marcada como correta (criação e edição) */
    showSave: hasCorrect,
    /** Criação: Cancelar aparece junto com o Salvar. Edição: sempre visível. */
    showCancel: original ? true : hasCorrect,
    /**
     * Algo seria perdido ao sair (a seta e o voltar do Android pedem confirmação). Criação: texto
     * no título, no enunciado ou em alguma alternativa (escolher só a disciplina, o conteúdo ou a
     * dificuldade não conta). Edição: alteração real em algum campo.
     */
    hasChanges: original
      ? changed
      : title.trim() !== '' ||
        statement.trim() !== '' ||
        alternatives.some((item) => item.text.trim() !== ''),
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
    setTitle: (text: string) => {
      setTitleValue(text);
      clearError('title');
    },
    setStatement: (text: string) => {
      setStatementValue(text);
      clearError('statement');
    },
    selectDifficulty: (value: QuestionDifficulty) => {
      setDifficulty(value);
      clearError('difficulty');
    },
    /** Nova alternativa vazia no fim da lista (ganha a próxima letra) */
    addAlternative: () =>
      setAlternatives((prev) => [
        ...prev,
        { id: `alternativa-${Date.now().toString(36)}-${prev.length}`, text: '', correct: false },
      ]),
    setAlternativeText: (id: string, text: string) => {
      setAlternatives((prev) => prev.map((item) => (item.id === id ? { ...item, text } : item)));
      clearAlternativeError(id);
    },
    /**
     * Marca a alternativa como a correta, desmarcando a anterior; tocar de novo na correta a
     * desmarca (e o Salvar some)
     */
    toggleCorrect: (id: string) =>
      setAlternatives((prev) => {
        const wasCorrect = prev.some((item) => item.id === id && item.correct);
        return prev.map((item) => ({ ...item, correct: !wasCorrect && item.id === id }));
      }),
    /** Remove a alternativa (as letras das seguintes se reajustam pela posição) */
    removeAlternative: (id: string) => {
      setAlternatives((prev) => prev.filter((item) => item.id !== id));
      clearAlternativeError(id);
    },
    /**
     * Confere os campos obrigatórios e o texto de cada alternativa e mostra os erros. Com tudo
     * certo (e uma alternativa correta), devolve a questão com os textos sem espaços nas pontas;
     * senão, null.
     */
    submit: (): QuestionValues | null => {
      const nextErrors: Errors = {};
      if (!discipline) nextErrors.discipline = requiredMessages.discipline;
      if (!content) nextErrors.content = requiredMessages.content;
      if (!title.trim()) nextErrors.title = requiredMessages.title;
      if (!statement.trim()) nextErrors.statement = requiredMessages.statement;
      if (!difficulty) nextErrors.difficulty = requiredMessages.difficulty;
      const nextAlternativeErrors: Record<string, string> = {};
      for (const item of alternatives) {
        if (!item.text.trim()) {
          nextAlternativeErrors[item.id] = requiredMessages.alternative;
        }
      }

      setErrors(nextErrors);
      setAlternativeErrors(nextAlternativeErrors);
      if (
        !discipline ||
        !content ||
        !difficulty ||
        !hasCorrect ||
        Object.keys(nextErrors).length > 0 ||
        Object.keys(nextAlternativeErrors).length > 0
      ) {
        return null;
      }
      return {
        title: title.trim(),
        statement: statement.trim(),
        disciplineId: discipline.id,
        contentId: content.id,
        difficulty,
        alternatives: alternatives.map((item) => ({ ...item, text: item.text.trim() })),
      };
    },
  };
}

export type QuestionFormState = ReturnType<typeof useQuestionForm>;
