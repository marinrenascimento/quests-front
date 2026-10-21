import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Rótulo acima da barra (ex.: "Este mês") */
  label: string;
  /** Valor já formatado, à direita da barra (ex.: "80h") */
  valueLabel: string;
  /** Comprimento da barra em relação à maior, de 0 a 1 */
  ratio: number;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
const LABEL_SIZE = 9.5;
const LABEL_LINE_HEIGHT = 12;
const LABEL_GAP = 6;
const BAR_HEIGHT = 8.7;
const VALUE_GAP = 5;
/** Espaço reservado à direita para o número: a maior barra ocupa a largura útil menos ele */
const VALUE_SPACE = 36;

/** Linha de horas: rótulo em cima e, embaixo, a barra com o valor logo depois do fim dela. */
export function HoursRow({ label, valueLabel, ratio }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const fraction = Math.min(Math.max(ratio, 0), 1);
  const barHeight = scale(BAR_HEIGHT);
  const lineHeight = scale(LABEL_LINE_HEIGHT);

  return (
    <View>
      <BodyText
        size={scale(LABEL_SIZE)}
        lineHeight={lineHeight}
        numberOfLines={1}
        style={{ marginBottom: scale(LABEL_GAP) }}>
        {label}
      </BodyText>
      {/* Margem (e não padding) à direita: o left em % do valor usa só a largura da barra */}
      <View style={{ marginRight: scale(VALUE_SPACE) }}>
        <ProgressBar progress={fraction} height={barHeight} variant="plain" />
        {/* O valor começa onde a barra termina e ocupa o espaço reservado à direita */}
        <BodyText
          size={scale(LABEL_SIZE)}
          lineHeight={lineHeight}
          numberOfLines={1}
          style={[
            styles.value,
            {
              left: `${fraction * 100}%`,
              top: (barHeight - lineHeight) / 2,
              marginLeft: scale(VALUE_GAP),
              width: scale(VALUE_SPACE - VALUE_GAP),
            },
          ]}>
          {valueLabel}
        </BodyText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  value: {
    position: 'absolute',
  },
});
