import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/atoms/BackButton';
import { IconButton } from '@/components/atoms/IconButton';
import { PixelText } from '@/components/atoms/PixelText';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  title: string;
  onBack: () => void;
  backLabel: string;
  actionIcon: IconName;
  onAction: () => void;
  actionLabel: string;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
const TITLE_SIZE = 7;
const TITLE_LETTER_SPACING = 0.8;
const TITLE_GAP = 10;
const ACTION_ICON_SIZE = 22;

/** Cabeçalho em linha: voltar à esquerda, título ao lado e um botão de ícone à direita. */
export function ReportHeader({ title, onBack, backLabel, actionIcon, onAction, actionLabel }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.row}>
      <BackButton onPress={onBack} accessibilityLabel={backLabel} />
      <PixelText
        size={scale(TITLE_SIZE)}
        letterSpacing={scale(TITLE_LETTER_SPACING)}
        color={Palette.forest}
        style={[styles.title, { marginHorizontal: scale(TITLE_GAP) }]}>
        {title}
      </PixelText>
      <IconButton
        icon={actionIcon}
        onPress={onAction}
        accessibilityLabel={actionLabel}
        size={ACTION_ICON_SIZE}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Ocupa o espaço entre os botões; se não couber, termina em reticências
  title: {
    flex: 1,
  },
});
