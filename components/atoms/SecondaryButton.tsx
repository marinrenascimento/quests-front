import { Pressable, StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  /** 'regular' (login) ou 'compact' (cadastro) */
  size?: 'regular' | 'compact';
};

export function SecondaryButton({ title, onPress, size = 'regular' }: Props) {
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
      <Text style={[styles.text, compact && styles.textCompact]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
    borderWidth: 1.5,
    borderColor: Palette.secondaryBorder,
  },
  containerRegular: {
    height: 47,
    borderRadius: 14,
  },
  containerCompact: {
    height: 33,
    borderRadius: 10,
    borderWidth: 1.2,
  },
  text: {
    fontFamily: FontFamily.buttonSecondary,
    fontSize: 14.5,
    color: Palette.secondaryText,
  },
  textCompact: {
    fontSize: 14,
  },
  pressed: {
    opacity: 0.7,
  },
});
