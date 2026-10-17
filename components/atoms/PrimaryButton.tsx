import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  /** 'regular' (login) ou 'compact' (cadastro) */
  size?: 'regular' | 'compact';
};

export function PrimaryButton({ title, onPress, size = 'regular' }: Props) {
  const compact = size === 'compact';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        compact ? styles.containerCompact : styles.containerRegular,
        pressed && styles.pressed,
      ]}>
      <LinearGradient
        colors={Palette.primaryGradient}
        style={[styles.gradient, compact ? styles.radiusCompact : styles.radiusRegular]}>
        <Text style={[styles.text, compact && styles.textCompact]}>{title.toUpperCase()}</Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    shadowColor: Palette.primaryShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  containerRegular: {
    height: 50,
    borderRadius: 14,
  },
  containerCompact: {
    height: 41,
    borderRadius: 11,
  },
  radiusRegular: {
    borderRadius: 14,
  },
  radiusCompact: {
    borderRadius: 11,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: FontFamily.button,
    fontSize: 16,
    letterSpacing: 1.2,
    color: Palette.white,
  },
  textCompact: {
    fontSize: 15,
  },
  pressed: {
    opacity: 0.9,
  },
});
