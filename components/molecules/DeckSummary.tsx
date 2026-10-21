import { Image, StyleSheet, Text, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { PixelText } from '@/components/atoms/PixelText';
import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  title: string;
  description: string;
  /** Quantidade já formatada (ex.: "53 cards"); exibida em caixa alta */
  countLabel: string;
};

// Mesma imagem para todos os decks (um require só, carregado uma vez)
const CHEST = require('@/assets/images/outros/bau.png');
/** bau.png tem 1410 x 1115 px */
const CHEST_ASPECT_RATIO = 1410 / 1115;
/** Largura da imagem em relação ao cartão */
const CHEST_WIDTH = '60%';

// Medidas do mockup de Meus Decks convertidas para a escala da Help, em px
const TITLE_GAP = 7;
const TITLE_SIZE = 4.4;
const TITLE_LETTER_SPACING = 0.45;
const DESCRIPTION_GAP = 8;
const DESCRIPTION_SIZE = 8.2;
const DESCRIPTION_LINE_HEIGHT = 10.5;
const COUNT_GAP = 5;
const COUNT_SIZE = 8;
const COUNT_LINE_HEIGHT = 10;
const COUNT_LETTER_SPACING = 1;
const BOTTOM = 4;

/**
 * Conteúdo do cartão de um deck: baú no topo, título (fonte pixel, uma linha), descrição
 * (uma linha com reticências) e a quantidade de cards. Todos os textos têm uma linha só,
 * então todos os cartões ficam com a mesma altura.
 */
export function DeckSummary({ title, description, countLabel }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={[styles.container, { paddingBottom: scale(BOTTOM) }]}>
      {/* A caixa define o tamanho (60% da largura, proporção do arquivo); a imagem só preenche */}
      <View style={styles.chestBox}>
        <Image source={CHEST} resizeMode="contain" style={styles.chest} />
      </View>
      <PixelText
        size={scale(TITLE_SIZE)}
        letterSpacing={scale(TITLE_LETTER_SPACING)}
        color={Palette.forest}
        adjustsFontSizeToFit
        style={[styles.centered, { marginTop: scale(TITLE_GAP) }]}>
        {title}
      </PixelText>
      <BodyText
        size={scale(DESCRIPTION_SIZE)}
        lineHeight={scale(DESCRIPTION_LINE_HEIGHT)}
        numberOfLines={1}
        style={[styles.description, { marginTop: scale(DESCRIPTION_GAP) }]}>
        {description}
      </BodyText>
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={[
          styles.count,
          {
            marginTop: scale(COUNT_GAP),
            fontSize: scale(COUNT_SIZE),
            lineHeight: scale(COUNT_LINE_HEIGHT),
            letterSpacing: scale(COUNT_LETTER_SPACING),
          },
        ]}>
        {countLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chestBox: {
    width: CHEST_WIDTH,
    aspectRatio: CHEST_ASPECT_RATIO,
  },
  chest: {
    width: '100%',
    height: '100%',
  },
  centered: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  description: {
    alignSelf: 'stretch',
  },
  count: {
    fontFamily: FontFamily.statValue,
    color: Palette.forest,
    textTransform: 'uppercase',
  },
});
