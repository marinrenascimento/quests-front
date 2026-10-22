import { StyleSheet, Text, View } from 'react-native';

import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  exitLabel: string;
  exitIcon: IconName;
  onExit: () => void;
  /** Número de respondidas, em negrito (já formatado) */
  answered: string;
  /** Resto da contagem (ex.: "de 9 respondidas") */
  progressSuffix: string;
  /** Lido no lugar da contagem (ex.: "1 de 9 respondidas") */
  progressLabel: string;
};

/** Tamanho do texto da contagem, em px do mockup da realização de prova */
const PROGRESS_SIZE = 11;
const GAP = 8;

/**
 * Linha do topo do cabeçalho da prova: o botão "Sair da prova" (SecondaryButton pequeno, com
 * ícone) à esquerda e a contagem de respondidas à direita, com o número em negrito.
 */
export function ExamProgressHeader({
  exitLabel,
  exitIcon,
  onExit,
  answered,
  progressSuffix,
  progressLabel,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);

  return (
    <View style={[styles.row, { gap: scale(GAP) }]}>
      <SecondaryButton title={exitLabel} icon={exitIcon} onPress={onExit} size="small" />
      <Text
        accessibilityLabel={progressLabel}
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.3}
        style={[styles.progress, { fontSize: scale(PROGRESS_SIZE) }]}>
        <Text style={styles.bold}>{answered}</Text> {progressSuffix}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progress: {
    flexShrink: 1,
    fontFamily: FontFamily.body,
    color: Palette.forest,
  },
  bold: {
    fontFamily: FontFamily.bodyBold,
  },
});
