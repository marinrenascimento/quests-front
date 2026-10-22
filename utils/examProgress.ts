import { formatThousands } from '@/utils/formatNumber';

type ProgressLabels = { of: string; one: string; other: string };

type SummaryLabels = {
  verbOne: string;
  verbOther: string;
  of: string;
  one: string;
  other: string;
};

/**
 * Resto da contagem do cabeçalho da prova, depois do número de respondidas (que é exibido à
 * parte, em negrito): "de 9 respondidas", ou "de 1 respondida" quando o total é 1.
 */
export function answeredProgressSuffix(total: number, labels: ProgressLabels): string {
  return `${labels.of} ${formatThousands(total)} ${total === 1 ? labels.one : labels.other}`;
}

/**
 * Resumo do modal de entrega: "Foram respondidas 3 de 9 questões.", com o verbo no singular
 * quando 1 foi respondida ("Foi respondida 1 de 9 questões.") e "questão" quando o total é 1.
 */
export function answeredSummary(answered: number, total: number, labels: SummaryLabels): string {
  const verb = answered === 1 ? labels.verbOne : labels.verbOther;
  const noun = total === 1 ? labels.one : labels.other;
  return `${verb} ${formatThousands(answered)} ${labels.of} ${formatThousands(total)} ${noun}.`;
}
