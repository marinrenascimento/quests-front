import { Pressable, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { PixelText } from '@/components/atoms/PixelText';
import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { InfoCard } from '@/components/molecules/InfoCard';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

type Props = {
  name: string;
  description: string;
  image: TrimmedImageSpec;
  onPress: () => void;
};

// Medidas em px do mockup da Help (os jogos não têm mockup: seguem os cartões de Meus Decks)
const THUMB_SIZE = 74;
const THUMB_RADIUS = 8;
const IMAGE_SIZE = 60;
const CARD_PADDING = 9;
const CONTENT_GAP = 10;
const NAME_SIZE = 6.5;
const NAME_LETTER_SPACING = 0.5;
const NAME_LINE_HEIGHT = 11;
const TEXT_GAP = 6;

/**
 * Cartão de um jogo na tela Jogos: a imagem à esquerda, sobre um quadrado verde escuro, e à direita
 * o nome e a descrição. O cartão inteiro é o botão. A imagem cabe no quadrado pelo lado maior, seja
 * ela mais larga (o goblin) ou mais alta (o mago).
 */
export function GameCard({ name, description, image, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const isTall = image.content.height > image.content.width;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityHint={description}
      onPress={onPress}
      style={({ pressed }) => pressed && styles.pressed}>
      <InfoCard padding={CARD_PADDING}>
        <View style={[styles.row, { gap: scale(CONTENT_GAP) }]}>
          <View
            style={[
              styles.thumb,
              {
                width: scale(THUMB_SIZE),
                height: scale(THUMB_SIZE),
                borderRadius: scale(THUMB_RADIUS),
              },
            ]}>
            <TrimmedImage
              source={image.source}
              imageSize={image.imageSize}
              content={image.content}
              style={isTall ? { height: scale(IMAGE_SIZE) } : { width: scale(IMAGE_SIZE) }}
            />
          </View>
          <View style={styles.texts}>
            <PixelText
              size={scale(NAME_SIZE)}
              letterSpacing={scale(NAME_LETTER_SPACING)}
              lineHeight={scale(NAME_LINE_HEIGHT)}
              numberOfLines={2}
              color={Palette.forest}>
              {name}
            </PixelText>
            <BodyText style={{ marginTop: scale(TEXT_GAP) }}>{description}</BodyText>
          </View>
        </View>
      </InfoCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumb: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.forest,
  },
  // Ocupa o que sobra ao lado da imagem: os textos quebram em vez de sair do cartão
  texts: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
});
