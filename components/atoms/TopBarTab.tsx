import { Pressable, StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  label: string;
  active: boolean;
  onPress: () => void;
};

export function TopBarTab({ label, active, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10 }}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={[styles.text, active && styles.textActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4.5,
    paddingVertical: 4,
  },
  text: {
    fontFamily: FontFamily.topBarTab,
    fontSize: 12,
    color: Palette.forest,
  },
  textActive: {
    color: Palette.white,
  },
  pressed: {
    opacity: 0.6,
  },
});
