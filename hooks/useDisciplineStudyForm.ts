import { useState } from 'react';

import { STUDY_QUANTITY_OPTIONS } from '@/constants/study';
import { useDeckCreation } from '@/hooks/useDeckCreation';
import { DisciplineStudy, useDecks } from '@/hooks/useDecks';
import { shuffle } from '@/utils/shuffle';

type Field = 'discipline' | 'content' | 'quantity';
type Errors = Partial<Record<Field, string>>;

type Options = {
  /** Mensagem de obrigatório de cada campo, mostrada abaixo dele ao tocar em "Estudar Agora" */
  requiredMessages: Record<Field, string>;
};

const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name, 'pt-BR');

/** Chave de um par disciplina + conteúdo */
const pairKey = (disciplineId: string, contentId: string) => `${disciplineId}|${contentId}`;

/**
 * Campos de Configurar Deck por Disciplina em estado local, com o padrão de validação do Novo
 * Flashcard: os erros de obrigatório só aparecem ao tocar em "Estudar Agora" e somem quando o
 * campo é escolhido. As opções saem da fonte única de cards (decks fictícios + criados): só
 * aparecem disciplinas e conteúdos com pelo menos 1 card, e o conteúdo depende da disciplina
 * (lista só os dela e é limpo quando ela muda). Não há criação de disciplina nem de conteúdo.
 */
export function useDisciplineStudyForm({ requiredMessages }: Options) {
  const { decks, getDeckCards } = useDecks();
  const { disciplines, contents } = useDeckCreation();
  const [disciplineId, setDisciplineId] = useState<string | undefined>(undefined);
  const [contentId, setContentId] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState<number | undefined>(undefined);
  const [errors, setErrors] = useState<Errors>({});

  // Todos os cards de todos os decks e os pares disciplina + conteúdo que têm cards
  const allCards = decks.flatMap((deck) => getDeckCards(deck));
  const disciplinesWithCards = new Set(allCards.map((card) => card.disciplineId));
  const pairsWithCards = new Set(allCards.map((card) => pairKey(card.disciplineId, card.contentId)));

  const discipline = disciplines.find((item) => item.id === disciplineId);
  const content = contents.find((item) => item.id === contentId);

  function clearError(field: Field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return {
    disciplineOptions: disciplines
      .filter((item) => disciplinesWithCards.has(item.id))
      .sort(byName)
      .map((item) => ({ id: item.id, label: item.name })),
    /** Vazio enquanto nenhuma disciplina foi escolhida */
    contentOptions: contents
      .filter(
        (item) =>
          item.disciplineId === disciplineId &&
          pairsWithCards.has(pairKey(item.disciplineId, item.id)),
      )
      .sort(byName)
      .map((item) => ({ id: item.id, label: item.name })),
    quantityOptions: STUDY_QUANTITY_OPTIONS.map((value) => ({
      id: String(value),
      label: String(value),
    })),
    disciplineId,
    contentId,
    /** Quantidade escolhida, como id da opção (texto) */
    quantityId: quantity === undefined ? undefined : String(quantity),
    errors,
    selectDiscipline: (id: string) => {
      if (id !== disciplineId) {
        setContentId(undefined);
      }
      setDisciplineId(id);
      clearError('discipline');
    },
    selectContent: (id: string) => {
      setContentId(id);
      clearError('content');
    },
    selectQuantity: (id: string) => {
      setQuantity(Number(id));
      clearError('quantity');
    },
    /**
     * Confere os campos obrigatórios e mostra os erros. Com tudo certo, monta o deck temporário:
     * os cards da disciplina + conteúdo escolhidos, sorteados sem repetir e limitados à
     * quantidade (se houver menos, entram todos). Senão, devolve null.
     */
    submit: (): DisciplineStudy | null => {
      const nextErrors: Errors = {};
      if (!discipline) nextErrors.discipline = requiredMessages.discipline;
      if (!content) nextErrors.content = requiredMessages.content;
      if (quantity === undefined) nextErrors.quantity = requiredMessages.quantity;

      setErrors(nextErrors);
      if (!discipline || !content || quantity === undefined) {
        return null;
      }
      const matching = allCards.filter(
        (card) => card.disciplineId === discipline.id && card.contentId === content.id,
      );
      return {
        title: `${discipline.name} - ${content.name}`,
        cards: shuffle(matching).slice(0, quantity),
      };
    },
  };
}

export type DisciplineStudyFormState = ReturnType<typeof useDisciplineStudyForm>;
