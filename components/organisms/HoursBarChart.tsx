import { StyleSheet, View } from 'react-native';

import { ChartBar } from '@/components/molecules/ChartBar';
import { InfoCard } from '@/components/molecules/InfoCard';
import { ChartPoint } from '@/constants/reports';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { formatHours } from '@/utils/formatHours';

type Props = {
  title: string;
  /** Horas por ponto (ex.: por dia da semana) */
  points: ChartPoint[];
};

/** Espaço extra entre o título do cartão e o gráfico, em px do mockup */
const CHART_TOP = 3.5;

/**
 * Cartão com gráfico de barras verticais de horas: a maior barra ocupa a altura útil e as
 * outras são proporcionais. As colunas dividem a largura igualmente.
 */
export function HoursBarChart({ title, points }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const max = Math.max(...points.map((point) => point.value), 0);

  return (
    <InfoCard title={title} titleSize="small">
      <View style={[styles.row, { marginTop: scale(CHART_TOP) }]}>
        {points.map((point) => (
          <ChartBar
            key={point.id}
            label={point.label}
            valueLabel={formatHours(point.value)}
            ratio={max > 0 ? point.value / max : 0}
          />
        ))}
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
