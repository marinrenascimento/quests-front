import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/atoms/IconButton';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { MarkerDot } from '@/components/atoms/MarkerDot';
import type { MarkerColor, MarkerConfig } from '@/constants/exams';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import {
  EXAM_MOCKUP_WIDTH,
  HELP_MOCKUP_WIDTH,
  useMockupScale,
} from '@/hooks/useMockupScale';

type Props = {
  /** Cores do marcador, na ordem da barra */
  markers: MarkerConfig[];
  activeColor: MarkerColor;
  onSelectColor: (color: MarkerColor) => void;
  /** Modo marcador ligado (o lápis aparece ativo) */
  markerOn: boolean;
  onToggleMarker: () => void;
  markerIcon: IconName;
  markerLabel: string;
  submitLabel: string;
  onSubmit: () => void;
  /** "Entregar prova" desabilitado (ex.: prova sem questões) */
  submitDisabled: boolean;
};

// Medidas do mockup da realização de prova, em px
const PADDING_VERTICAL = 10;
const DOTS_GAP = 5.5;
const PENCIL_GAP = 12;
/** O IconButton recebe o tamanho na escala da Help: 20px do mockup da prova */
const PENCIL_SIZE = (20 * HELP_MOCKUP_WIDTH) / EXAM_MOCKUP_WIDTH;

/**
 * Barra inferior fixa da prova, no verde sálvia dos cartões: as bolinhas das cores do marcador e
 * o lápis (liga e desliga o marcador) à esquerda e o "Entregar prova" à direita. Embaixo, respeita
 * a área segura.
 */
export function MarkerToolbar({
  markers,
  activeColor,
  onSelectColor,
  markerOn,
  onToggleMarker,
  markerIcon,
  markerLabel,
  submitLabel,
  onSubmit,
  submitDisabled,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const { paddingHorizontal } = useLayoutPadding();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        {
          paddingHorizontal,
          paddingTop: scale(PADDING_VERTICAL),
          paddingBottom: insets.bottom + scale(PADDING_VERTICAL),
        },
      ]}>
      <View accessibilityRole="radiogroup" style={[styles.dots, { gap: scale(DOTS_GAP) }]}>
        {markers.map((marker) => (
          <MarkerDot
            key={marker.value}
            color={marker.dotColor}
            active={marker.value === activeColor}
            onPress={() => onSelectColor(marker.value)}
            accessibilityLabel={marker.label}
          />
        ))}
      </View>
      <View style={[styles.pencil, { marginLeft: scale(PENCIL_GAP) }]}>
        <IconButton
          icon={markerIcon}
          onPress={onToggleMarker}
          accessibilityLabel={markerLabel}
          size={PENCIL_SIZE}
          toggled={markerOn}
        />
      </View>
      <IconTextButton
        label={submitLabel}
        onPress={onSubmit}
        variant="action"
        disabled={submitDisabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.rankCard,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Ocupa o espaço do meio: o botão de entregar fica encostado à direita
  pencil: {
    flex: 1,
    alignItems: 'flex-start',
  },
});
