import { View } from 'react-native';

import { HoursRow } from '@/components/molecules/HoursRow';
import { InfoCard } from '@/components/molecules/InfoCard';
import { HoursTotal } from '@/constants/reports';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { formatHours } from '@/utils/formatHours';

type Props = {
  title: string;
  items: HoursTotal[];
};

/** Vão entre as linhas, em px do mockup (Relatórios convertido para a escala da Help) */
const ROW_GAP = 18;

/** Cartão que compara totais de horas: a maior barra ocupa a largura útil, as outras são proporcionais. */
export function HoursComparisonCard({ title, items }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const max = Math.max(...items.map((item) => item.hours), 0);

  return (
    <InfoCard title={title} titleSize="small">
      <View style={{ gap: scale(ROW_GAP) }}>
        {items.map((item) => (
          <HoursRow
            key={item.id}
            label={item.label}
            valueLabel={formatHours(item.hours, 0)}
            ratio={max > 0 ? item.hours / max : 0}
          />
        ))}
      </View>
    </InfoCard>
  );
}
