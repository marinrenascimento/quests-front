import type { IconName } from '@/constants/helpContent';

export type ReportPeriod = 'semanal' | 'mensal';

/** Cartão do resumo: ícone, valor já formatado (ex.: "15.0H") e rótulo */
export type ReportSummaryItem = {
  id: string;
  icon: IconName;
  value: string;
  label: string;
};

/** Ponto de gráfico: rótulo (ex.: dia da semana) e valor numérico */
export type ChartPoint = {
  id: string;
  label: string;
  value: number;
};

/** Desempenho em uma matéria, de 0 a 100 */
export type SubjectScore = {
  id: string;
  subject: string;
  percent: number;
};

/** Total de horas de um período (ex.: "Este mês") */
export type HoursTotal = {
  id: string;
  label: string;
  hours: number;
};

type ReportBase = {
  /** Título do cabeçalho (exibido em caixa alta) */
  title: string;
  summary: ReportSummaryItem[];
  subjectsTitle: string;
  subjects: SubjectScore[];
};

export type WeeklyReport = ReportBase & {
  period: 'semanal';
  dailyHoursTitle: string;
  dailyHours: ChartPoint[];
};

export type MonthlyReport = ReportBase & {
  period: 'mensal';
  hoursComparisonTitle: string;
  hoursComparison: HoursTotal[];
};

export type Report = WeeklyReport | MonthlyReport;

/** Ícone do botão que alterna o período (três linhas decrescentes) */
export const REPORT_FILTER_ICON: IconName = 'filter-variant';

/** Rótulo de acessibilidade do botão de filtro: descreve a troca a partir do período atual */
export const REPORT_TOGGLE_LABELS: Record<ReportPeriod, string> = {
  semanal: 'Mostrar relatório mensal',
  mensal: 'Mostrar relatório semanal',
};
