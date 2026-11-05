import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourcePropType, Pressable, StyleSheet } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { GameSceneImage } from '@/components/atoms/GameSceneImage';
import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

type Props = {
  name: string;
  description: string;
  /** Lido pelo leitor de tela, depois do nome */
  accessibilityHint: string;
  image: TrimmedImageSpec;
  background: ImageSourcePropType;
  /** Lado do quadrado, em dp */
  size: number;
  onPress: () => void;
};

// Medidas em px do mockup da Help (a tela Jogos não tem mockup)
const RADIUS = 12;
const PANEL_PADDING_HORIZONTAL = 14;
const PANEL_PADDING_TOP = 26;
const PANEL_PADDING_BOTTOM = 13;
const NAME_SIZE = 9;
const NAME_LETTER_SPACING = 0.6;
const DESCRIPTION_TOP = 8;
/** Fração do lado que o personagem pode ocupar */
const CHARACTER_FILL = 0.62;
/** Distância do personagem até a base: ele fica acima do título, encostando no degradê */
const CHARACTER_BOTTOM = 0.3;

/**
 * Quadrado grande da tela Jogos: o cenário, o personagem e, na parte de baixo, o título e a descrição
 * sobre um degradê escuro. O quadrado inteiro é o botão que abre o jogo.
 */
export function GameShowcaseCard({
  name,
  description,
  accessibilityHint,
  image,
  background,
  size,
  onPress,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { width: size, height: size, borderRadius: scale(RADIUS) },
        pressed && styles.pressed,
      ]}>
      <GameSceneImage
        background={background}
        character={image}
        size={size}
        characterFill={CHARACTER_FILL}
        characterBottom={CHARACTER_BOTTOM}
      />
      <LinearGradient
        colors={Palette.gameShowcaseFade}
        style={[
          styles.panel,
          {
            paddingHorizontal: scale(PANEL_PADDING_HORIZONTAL),
            paddingTop: scale(PANEL_PADDING_TOP),
            paddingBottom: scale(PANEL_PADDING_BOTTOM),
          },
        ]}>
        <PixelText
          size={scale(NAME_SIZE)}
          letterSpacing={scale(NAME_LETTER_SPACING)}
          numberOfLines={0}
          color={Palette.white}>
          {name}
        </PixelText>
        <BodyText style={[styles.description, { marginTop: scale(DESCRIPTION_TOP) }]}>
          {description}
        </BodyText>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: Palette.forest,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  description: {
    color: Palette.white,
  },
  pressed: {
    opacity: 0.9,
  },
});
