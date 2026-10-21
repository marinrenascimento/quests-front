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
  /** Botão de ícone à direita (opcional): só aparece com ícone, ação e rótulo */
  actionIcon?: IconName;
  onAction?: () => void;
  actionLabel?: string;
  /**
   * Títulos variáveis (ex.: nome do deck): se não couber, a fonte diminui até MIN_TITLE_SCALE
   * antes de cortar com reticências. Padrão: não diminui.
   */
  fitTitle?: boolean;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
const TITLE_SIZE = 7;
const TITLE_LETTER_SPACING = 0.8;
const TITLE_GAP = 10;
const ACTION_ICON_SIZE = 22;
/** Menor escala da fonte do título com fitTitle */
const MIN_TITLE_SCALE = 0.6;

/** Cabeçalho em linha: voltar à esquerda, título ao lado e, opcionalmente, um botão de ícone à direita. */
export function ReportHeader({
  title,
  onBack,
  backLabel,
  actionIcon,
  onAction,
  actionLabel,
  fitTitle = false,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.row}>
      <BackButton onPress={onBack} accessibilityLabel={backLabel} />
      <PixelText
        size={scale(TITLE_SIZE)}
        letterSpacing={scale(TITLE_LETTER_SPACING)}
        color={Palette.forest}
        adjustsFontSizeToFit={fitTitle}
        minimumFontScale={fitTitle ? MIN_TITLE_SCALE : undefined}
        style={[styles.title, { marginHorizontal: scale(TITLE_GAP) }]}>
        {title}
      </PixelText>
      {actionIcon && onAction && actionLabel ? (
        <IconButton
          icon={actionIcon}
          onPress={onAction}
          accessibilityLabel={actionLabel}
          size={ACTION_ICON_SIZE}
        />
      ) : null}
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
