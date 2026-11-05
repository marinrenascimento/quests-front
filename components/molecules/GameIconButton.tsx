import { ImageSourcePropType, Pressable, StyleSheet } from 'react-native';

import { GameSceneImage } from '@/components/atoms/GameSceneImage';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

type Props = {
  label: string;
  image: TrimmedImageSpec;
  background: ImageSourcePropType;
  /** Lado do quadrado, em dp */
  size: number;
  /** É o jogo mostrado no quadrado grande: fica com a borda amarela */
  selected: boolean;
  onPress: () => void;
};

// Medidas em px do mockup da Help (a tela Jogos não tem mockup)
const RADIUS = 9;
const BORDER = 2.5;
const CHARACTER_FILL = 0.72;

/** Ícone de um jogo, embaixo do quadrado grande da tela Jogos: o cenário e o personagem. */
export function GameIconButton({ label, image, background, size, selected, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const border = scale(BORDER);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.icon,
        {
          width: size,
          height: size,
          borderRadius: scale(RADIUS),
          borderWidth: border,
        },
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      <GameSceneImage
        background={background}
        character={image}
        size={size - border * 2}
        characterFill={CHARACTER_FILL}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: {
    overflow: 'hidden',
    borderColor: Palette.forest,
    backgroundColor: Palette.forest,
  },
  selected: {
    borderColor: Palette.examYellow,
  },
  pressed: {
    opacity: 0.85,
  },
});
