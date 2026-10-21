import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  onPress: () => void;
  accessibilityLabel: string;
};

// Medidas do mockup da Help, em px
const SIZE = 30;
const ARROW_SIZE = 18;

/** Botão voltar: círculo verde escuro com seta branca para a esquerda. */
export function BackButton({ onPress, accessibilityLabel }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const size = scale(SIZE);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons name="arrow-left" size={scale(ARROW_SIZE)} color={Palette.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.forest,
  },
  pressed: {
    opacity: 0.8,
  },
});
