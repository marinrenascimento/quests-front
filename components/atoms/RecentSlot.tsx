import { Image, ImageSourcePropType, Pressable, StyleSheet } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  /** Lado do quadrado em dp */
  size: number;
  /** Ícone do item acessado; sem ícone o slot aparece vazio */
  icon?: ImageSourcePropType;
  accessibilityLabel?: string;
  onPress?: () => void;
};

/** Quadrado verde escuro de cantos arredondados da grade "Acessos recentes". */
export function RecentSlot({ size, icon, accessibilityLabel, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.slot,
        { width: size, height: size, borderRadius: size * 0.13 },
        pressed && styles.pressed,
      ]}>
      {icon ? <Image source={icon} resizeMode="contain" style={styles.icon} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.forest,
  },
  icon: {
    width: '75%',
    height: '75%',
  },
  pressed: {
    opacity: 0.8,
  },
});
