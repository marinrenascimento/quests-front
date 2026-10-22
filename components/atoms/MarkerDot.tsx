import { Pressable, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Cor da bolinha */
  color: string;
  /** Cor escolhida: anel verde escuro em volta, com uma folga clara entre ele e a bolinha */
  active: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

// Medidas do mockup da realização de prova, em px
const DOT = 20;
/** Tamanho ocupado (o do anel): a bolinha ativa não empurra as vizinhas */
export const MARKER_DOT_SLOT = 28;
const RING = 2;
/** Área de toque mínima recomendada, em dp (completada com hitSlop) */
const MIN_TOUCH = 44;

/** Bolinha colorida de uma cor do marcador de texto (barra inferior da prova). */
export function MarkerDot({ color, active, onPress, accessibilityLabel }: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const slot = scale(MARKER_DOT_SLOT);
  const dot = scale(DOT);

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ checked: active }}
      onPress={onPress}
      hitSlop={Math.max(0, (MIN_TOUCH - slot) / 2)}
      style={({ pressed }) => [
        styles.slot,
        { width: slot, height: slot, borderRadius: slot / 2 },
        active && [styles.ring, { borderWidth: scale(RING) }],
        pressed && styles.pressed,
      ]}>
      <View style={{ width: dot, height: dot, borderRadius: dot / 2, backgroundColor: color }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Anel escuro com o fundo claro dentro: a folga entre o anel e a bolinha
  ring: {
    borderColor: Palette.forest,
    backgroundColor: Palette.white,
  },
  pressed: {
    opacity: 0.75,
  },
});
