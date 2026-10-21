import { View } from 'react-native';

import { ReportHeader } from '@/components/molecules/ReportHeader';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HoursBarChart } from '@/components/organisms/HoursBarChart';
import { HoursComparisonCard } from '@/components/organisms/HoursComparisonCard';
import { SubjectPerformanceCard } from '@/components/organisms/SubjectPerformanceCard';
import { SummaryGrid } from '@/components/organisms/SummaryGrid';
import { TopBar } from '@/components/organisms/TopBar';
import { IconName } from '@/constants/helpContent';
import { Report } from '@/constants/reports';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Relatório do período escolhido (semanal ou mensal) */
  report: Report;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
  backLabel: string;
  /** Botão de filtro: ícone, rótulo de acessibilidade e ação de trocar o período */
  filterIcon: IconName;
  filterLabel: string;
  onTogglePeriod: () => void;
};

/** Vão entre os cartões, em px do mockup (Relatórios convertido para a escala da Help) */
const CARD_GAP = 10;

/**
 * Template da tela Relatórios: TopBar sem aba em destaque, cabeçalho (voltar, título, filtro)
 * e o conteúdo do período. Só o resumo e os gráficos mudam entre semanal e mensal.
 * O voltar leva à Home nos dois períodos (mesma navegação da aba Home do TopBar).
 */
export function ReportsTemplate({
  report,
  coins,
  userName,
  backLabel,
  filterIcon,
  filterLabel,
  onTogglePeriod,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <ReportHeader
        title={report.title}
        onBack={() => handleTabPress('home')}
        backLabel={backLabel}
        actionIcon={filterIcon}
        onAction={onTogglePeriod}
        actionLabel={filterLabel}
      />
      <View style={{ gap: scale(CARD_GAP) }}>
        <SummaryGrid items={report.summary} />
        {report.period === 'semanal' ? (
          <HoursBarChart title={report.dailyHoursTitle} points={report.dailyHours} />
        ) : (
          <HoursComparisonCard title={report.hoursComparisonTitle} items={report.hoursComparison} />
        )}
        <SubjectPerformanceCard title={report.subjectsTitle} subjects={report.subjects} />
      </View>
    </HelpLayout>
  );
}
