import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { ReportsTemplate } from '@/components/templates/ReportsTemplate';
import { BACK_LABEL } from '@/constants/helpContent';
import { MOCK_MONTHLY_REPORT, MOCK_WEEKLY_REPORT } from '@/constants/mockReports';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { REPORT_FILTER_ICON, REPORT_TOGGLE_LABELS, ReportPeriod } from '@/constants/reports';

export default function RelatoriosScreen() {
  const [period, setPeriod] = useState<ReportPeriod>('semanal');
  // Muda a cada saída da tela: remonta o conteúdo (rolagem volta ao topo)
  const [visit, setVisit] = useState(0);

  // A aba continua montada ao sair: ao perder o foco, volta para o semanal
  useFocusEffect(
    useCallback(
      () => () => {
        setPeriod('semanal');
        setVisit((count) => count + 1);
      },
      [],
    ),
  );

  return (
    <ReportsTemplate
      key={visit}
      // TODO: substituir pelos dados do back.
      report={period === 'semanal' ? MOCK_WEEKLY_REPORT : MOCK_MONTHLY_REPORT}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
      backLabel={BACK_LABEL}
      filterIcon={REPORT_FILTER_ICON}
      filterLabel={REPORT_TOGGLE_LABELS[period]}
      onTogglePeriod={() => setPeriod((current) => (current === 'semanal' ? 'mensal' : 'semanal'))}
    />
  );
}
