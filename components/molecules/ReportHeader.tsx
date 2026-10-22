import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/atoms/BackButton';
import { IconButton } from '@/components/atoms/IconButton';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { PixelText } from '@/components/atoms/PixelText';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Título ao lado do voltar. Sem título, o espaço fica vazio e os botões vão para as pontas. */
  title?: string;
  /** Botão voltar à esquerda: só aparece com a ação e o rótulo (sem ele, o título começa na margem) */
  onBack?: () => void;
  backLabel?: string;
  /** Botão de ícone à direita (opcional): só aparece com ícone, ação e rótulo */
  actionIcon?: IconName;
  onAction?: () => void;
  actionLabel?: string;
  /** Botão de texto verde escuro à direita, com a largura do texto (ex.: "Encerrar Revisão") */
  textAction?: { label: string; onPress: () => void };
  /**
   * Ícone pequeno e só decorativo à direita (ex.: olho do Visualizar Card): sem toque e fora do
   * leitor de tela. Opcional.
   */
  indicatorIcon?: IconName;
  /** Máximo de linhas do título, alinhado à esquerda (padrão: 1) */
  titleLines?: number;
  /**
   * Títulos variáveis (ex.: nome do deck): se não couber, a fonte diminui até MIN_TITLE_SCALE
   * antes de cortar com reticências. Padrão: não diminui.
   */
  fitTitle?: boolean;
};

// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
const TITLE_SIZE = 7;
const TITLE_LETTER_SPACING = 0.8;
/** Altura de cada linha do título quando ele pode quebrar (mockup do fim da revisão) */
const TITLE_LINE_HEIGHT = 13;
const TITLE_GAP = 10;
const ACTION_ICON_SIZE = 22;
const INDICATOR_ICON_SIZE = 16;
/** Menor escala da fonte do título com fitTitle */
const MIN_TITLE_SCALE = 0.6;

/**
 * Cabeçalho em linha: voltar à esquerda (opcional), título ao lado e, opcionalmente, um botão
 * de ícone ou de texto ou um ícone decorativo à direita. O título ocupa o espaço que sobra e nunca passa por baixo
 * dos botões.
 */
export function ReportHeader({
  title,
  onBack,
  backLabel,
  actionIcon,
  onAction,
  actionLabel,
  textAction,
  indicatorIcon,
  titleLines = 1,
  fitTitle = false,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const hasBack = onBack !== undefined && backLabel !== undefined;

  return (
    <View style={styles.row}>
      {hasBack ? <BackButton onPress={onBack} accessibilityLabel={backLabel} /> : null}
      {title === undefined ? (
        <View style={styles.title} />
      ) : (
        <PixelText
          size={scale(TITLE_SIZE)}
          letterSpacing={scale(TITLE_LETTER_SPACING)}
          lineHeight={titleLines > 1 ? scale(TITLE_LINE_HEIGHT) : undefined}
          numberOfLines={titleLines}
          color={Palette.forest}
          adjustsFontSizeToFit={fitTitle}
          minimumFontScale={fitTitle ? MIN_TITLE_SCALE : undefined}
          accessibilityRole="header"
          style={[
            styles.title,
            { marginLeft: hasBack ? scale(TITLE_GAP) : 0, marginRight: scale(TITLE_GAP) },
          ]}>
          {title}
        </PixelText>
      )}
      {actionIcon && onAction && actionLabel ? (
        <IconButton
          icon={actionIcon}
          onPress={onAction}
          accessibilityLabel={actionLabel}
          size={ACTION_ICON_SIZE}
        />
      ) : null}
      {textAction ? (
        <IconTextButton
          label={textAction.label}
          onPress={textAction.onPress}
          variant="compact"
        />
      ) : null}
      {indicatorIcon ? (
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none">
          <MaterialCommunityIcons
            name={indicatorIcon}
            size={scale(INDICATOR_ICON_SIZE)}
            color={Palette.forest}
          />
        </View>
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
