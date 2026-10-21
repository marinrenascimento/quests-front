import { View } from 'react-native';

import { InfoCard } from '@/components/molecules/InfoCard';
import { SubjectRow } from '@/components/molecules/SubjectRow';
import { SubjectScore } from '@/constants/reports';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  title: string;
  subjects: SubjectScore[];
};

/** Vão entre as linhas, em px do mockup (Relatórios convertido para a escala da Help) */
const ROW_GAP = 17;

/** Cartão de desempenho por matéria: uma linha com nome e barra para cada matéria. */
export function SubjectPerformanceCard({ title, subjects }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <InfoCard title={title} titleSize="small">
      {/* Poucas matérias fixas dentro do ScrollView da tela: um .map simples basta */}
      <View style={{ gap: scale(ROW_GAP) }}>
        {subjects.map((item) => (
          <SubjectRow key={item.id} subject={item.subject} percent={item.percent} />
        ))}
      </View>
    </InfoCard>
  );
}
