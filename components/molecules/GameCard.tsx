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
  /** Aviso em destaque de um jogo que ainda não foi feito ("Em Breve"). Sem ele, o jogo abre. */
  badge?: string;
  onPress: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup: seguem os cartões de Meus Decks)
const THUMB_SIZE = 74;
const THUMB_RADIUS = 8;
const IMAGE_WIDTH = 60;
const CARD_PADDING = 9;
const CONTENT_GAP = 10;
const NAME_SIZE = 6.5;
const NAME_LETTER_SPACING = 0.5;
const NAME_LINE_HEIGHT = 11;
const TEXT_GAP = 6;
const BADGE_SIZE = 4.6;
const BADGE_LETTER_SPACING = 0.4;
const BADGE_RADIUS = 4;
const BADGE_PADDING_HORIZONTAL = 6;
const BADGE_PADDING_VERTICAL = 4;

/**
 * Cartão de um jogo na tela Jogos: a imagem à esquerda, sobre um quadrado verde escuro, e à direita
 * o nome, a descrição e, nos jogos que ainda não foram feitos, o aviso. O cartão inteiro é o botão.
 */
export function GameCard({ name, description, image, badge, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={badge ? `${name}, ${badge}` : name}
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
              style={{ width: scale(IMAGE_WIDTH) }}
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
            {badge ? (
              <View
                style={[
                  styles.badge,
                  {
                    marginTop: scale(TEXT_GAP),
                    borderRadius: scale(BADGE_RADIUS),
                    paddingHorizontal: scale(BADGE_PADDING_HORIZONTAL),
                    paddingVertical: scale(BADGE_PADDING_VERTICAL),
                  },
                ]}>
                <PixelText
                  size={scale(BADGE_SIZE)}
                  letterSpacing={scale(BADGE_LETTER_SPACING)}
                  color={Palette.white}>
                  {badge}
                </PixelText>
              </View>
            ) : null}
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
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.forest,
  },
  pressed: {
    opacity: 0.85,
  },
});
