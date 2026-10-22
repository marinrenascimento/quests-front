import { ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  /** Lado do quadrado em dp */
  size: number;
  /** Conteúdo do item acessado (ex.: baú e nome); sem conteúdo o slot aparece vazio */
  children?: ReactNode;
  accessibilityLabel?: string;
  onPress?: () => void;
};

/** Espaço interno do quadrado, em relação ao lado */
const PADDING_RATIO = 0.08;

/** Quadrado verde escuro de cantos arredondados da coluna "Acessos recentes". */
export function RecentSlot({ size, children, accessibilityLabel, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.slot,
        {
          width: size,
          height: size,
          borderRadius: size * 0.065,
          padding: size * PADDING_RATIO,
        },
        pressed && styles.pressed,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.forest,
  },
  pressed: {
    opacity: 0.8,
  },
});
