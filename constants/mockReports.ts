import { MonthlyReport, WeeklyReport } from '@/constants/reports';

// TODO: substituir pelos dados do back. Relatórios fictícios, com os valores dos mockups.
// Os percentuais das matérias foram estimados pelo tamanho das barras nos mockups.

export const MOCK_WEEKLY_REPORT: WeeklyReport = {
  period: 'semanal',
  title: 'Relatório Semanal',
  summary: [
    { id: 'horas', icon: 'clock-outline', value: '15.0H', label: 'Horas Esta Semana' },
    { id: 'questoes', icon: 'crosshairs-gps', value: '100', label: 'Questões Acertadas' },
    { id: 'acerto', icon: 'trending-up', value: '78%', label: 'Taxa de Acerto' },
    { id: 'sequencia', icon: 'chart-bar', value: '5 DIAS', label: 'Sequência de Dias' },
  ],
  dailyHoursTitle: 'Horas de Estudo - Semana',
  dailyHours: [
    { id: 'seg', label: 'Seg', value: 2.5 },
    { id: 'ter', label: 'Ter', value: 1.8 },
    { id: 'qua', label: 'Qua', value: 3.2 },
    { id: 'qui', label: 'Qui', value: 0.5 },
    { id: 'sex', label: 'Sex', value: 2.0 },
    { id: 'sab', label: 'Sáb', value: 4.0 },
    { id: 'dom', label: 'Dom', value: 1.0 },
  ],
  subjectsTitle: 'Desempenho por Matéria',
  subjects: [
    { id: 'matematica', subject: 'Matemática', percent: 80 },
    { id: 'portugues', subject: 'Português', percent: 70 },
    { id: 'historia', subject: 'História', percent: 90 },
    { id: 'fisica', subject: 'Física', percent: 50 },
  ],
};

export const MOCK_MONTHLY_REPORT: MonthlyReport = {
  period: 'mensal',
  title: 'Relatório Mensal',
  summary: [
    { id: 'horas', icon: 'clock-outline', value: '60.0H', label: 'Horas Este Mês' },
    { id: 'questoes', icon: 'crosshairs-gps', value: '100', label: 'Questões Acertadas' },
    { id: 'acerto', icon: 'trending-up', value: '74%', label: 'Taxa de Acerto' },
    { id: 'sequencia', icon: 'chart-bar', value: '3 MESES', label: 'Sequência de Meses' },
  ],
  hoursComparisonTitle: 'Horas de Estudo',
  hoursComparison: [
    { id: 'este-mes', label: 'Este Mês', hours: 80 },
    { id: 'mes-passado', label: 'Mês Passado', hours: 45 },
  ],
  subjectsTitle: 'Desempenho por Matéria Neste Mês',
  subjects: [
    { id: 'matematica', subject: 'Matemática', percent: 60 },
    { id: 'portugues', subject: 'Português', percent: 80 },
    { id: 'historia', subject: 'História', percent: 90 },
    { id: 'fisica', subject: 'Física', percent: 50 },
  ],
};
