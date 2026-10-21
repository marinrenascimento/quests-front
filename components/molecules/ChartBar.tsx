import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Rótulo abaixo da barra (ex.: "Seg") */
  label: string;
  /** Valor já formatado, acima da barra (ex.: "2.5h") */
  valueLabel: string;
  /** Altura da barra em relação à maior do gráfico, de 0 a 1 */
  ratio: number;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
/** Altura da barra do maior valor (altura útil do gráfico) */
const MAX_BAR_HEIGHT = 96;
const BAR_WIDTH = 18.4;
const BAR_RADIUS = 2;
const VALUE_SIZE = 7;
const VALUE_LINE_HEIGHT = 9;
const VALUE_GAP = 2.5;
const LABEL_SIZE = 9;
const LABEL_LINE_HEIGHT = 11;
const LABEL_GAP = 5;

/**
 * Uma coluna do gráfico de barras: valor em cima, barra verde escura e rótulo embaixo.
 * A área da barra tem altura fixa e a barra cresce de baixo para cima, então colunas lado a
 * lado ficam com a base alinhada. A largura vem do pai (flex 1).
 */
export function ChartBar({ label, valueLabel, ratio }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const fraction = Math.min(Math.max(ratio, 0), 1);

  return (
    <View style={styles.column}>
      <View
        style={[
          styles.plot,
          { height: scale(VALUE_LINE_HEIGHT + VALUE_GAP + MAX_BAR_HEIGHT) },
        ]}>
        <BodyText
          size={scale(VALUE_SIZE)}
          lineHeight={scale(VALUE_LINE_HEIGHT)}
          align="center"
          numberOfLines={1}
          style={{ marginBottom: scale(VALUE_GAP) }}>
          {valueLabel}
        </BodyText>
        <View
          style={[
            styles.bar,
            {
              width: scale(BAR_WIDTH),
              height: scale(MAX_BAR_HEIGHT) * fraction,
              borderRadius: scale(BAR_RADIUS),
            },
          ]}
        />
      </View>
      <BodyText
        size={scale(LABEL_SIZE)}
        lineHeight={scale(LABEL_LINE_HEIGHT)}
        align="center"
        numberOfLines={1}
        style={{ marginTop: scale(LABEL_GAP) }}>
        {label}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: 'center',
  },
  plot: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    backgroundColor: Palette.forest,
  },
});
