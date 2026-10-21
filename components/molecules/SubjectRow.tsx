import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  subject: string;
  /** Desempenho de 0 a 100 */
  percent: number;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
/** Coluna fixa dos nomes: todas as barras começam no mesmo ponto */
const NAME_WIDTH = 56;
const NAME_SIZE = 9.5;
const NAME_LINE_HEIGHT = 12;
const NAME_GAP = 6;
const BAR_HEIGHT = 8.5;

/** Linha de matéria: nome alinhado à direita da coluna fixa e a barra de desempenho. */
export function SubjectRow({ subject, percent }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.row}>
      <BodyText
        size={scale(NAME_SIZE)}
        lineHeight={scale(NAME_LINE_HEIGHT)}
        align="right"
        numberOfLines={1}
        adjustsFontSizeToFit
        style={{ width: scale(NAME_WIDTH), marginRight: scale(NAME_GAP) }}>
        {subject}
      </BodyText>
      <View style={styles.bar}>
        <ProgressBar progress={percent / 100} height={scale(BAR_HEIGHT)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar: {
    flex: 1,
  },
});
