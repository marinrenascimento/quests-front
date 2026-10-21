import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, Text, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  icon: IconName;
  /** Valor já formatado (ex.: "15.0H") */
  value: string;
  label: string;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
const ICON_SIZE = 20;
const VALUE_GAP = 4;
const VALUE_SIZE = 19;
const VALUE_LINE_HEIGHT = 22;
const LABEL_GAP = 2;
const LABEL_SIZE = 9.5;
const LABEL_LINE_HEIGHT = 12;

/** Conteúdo de um cartão de resumo, centralizado: ícone, valor grande em negrito e rótulo. */
export function SummaryStat({ icon, value, label }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={scale(ICON_SIZE)} color={Palette.forest} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.2}
        style={[
          styles.value,
          {
            marginTop: scale(VALUE_GAP),
            fontSize: scale(VALUE_SIZE),
            lineHeight: scale(VALUE_LINE_HEIGHT),
          },
        ]}>
        {value}
      </Text>
      {/* Rótulos longos ("Questões Respondidas") diminuem em vez de quebrar a linha */}
      <BodyText
        size={scale(LABEL_SIZE)}
        lineHeight={scale(LABEL_LINE_HEIGHT)}
        align="center"
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[styles.label, { marginTop: scale(LABEL_GAP) }]}>
        {label}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  value: {
    fontFamily: FontFamily.statValue,
    color: Palette.forest,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'stretch',
  },
});
