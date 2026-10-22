import { Image, StyleSheet, Text, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { PixelText } from '@/components/atoms/PixelText';
import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  title: string;
  /**
   * Linha de descrição (Meus Decks). Vazia, a linha continua ocupando o espaço; sem a prop
   * (ex.: Minhas Provas), a linha não existe.
   */
  description?: string;
  /** Quantidade já formatada (ex.: "53 cards"); exibida em caixa alta */
  countLabel: string;
  /**
   * Máximo de linhas do título (padrão: 1, como em Meus Decks). Com mais, o espaço de todas as
   * linhas fica reservado, para os cartões terem a mesma altura, e a fonte diminui se não couber.
   */
  titleLines?: number;
  /** Posição da quantidade (padrão: centralizada, como em Meus Decks) */
  countAlign?: 'center' | 'right';
};

// Mesma imagem para todos os decks (um require só, carregado uma vez)
const CHEST = require('@/assets/images/outros/bau.png');
/** bau.png tem 1410 x 1115 px */
const CHEST_ASPECT_RATIO = 1410 / 1115;
/** Texto da linha de descrição quando o deck não tem descrição (espaço sem quebra) */
const NO_DESCRIPTION = ' ';
/** Largura da imagem em relação ao cartão */
const CHEST_WIDTH = '60%';

// Medidas do mockup de Meus Decks convertidas para a escala da Help, em px
const TITLE_GAP = 7;
const TITLE_SIZE = 4.4;
const TITLE_LETTER_SPACING = 0.45;
const DESCRIPTION_GAP = 8;
const DESCRIPTION_SIZE = 8.2;
const DESCRIPTION_LINE_HEIGHT = 10.5;
/** Altura de cada linha do título quando ele pode quebrar */
const TITLE_LINE_HEIGHT = 7;
/** Menor escala da fonte do título de várias linhas (iOS; no Android diminui o necessário) */
const MIN_TITLE_SCALE = 0.6;
const COUNT_GAP = 5;
/** Espaço entre o título e a quantidade quando não há linha de descrição */
const COUNT_GAP_NO_DESCRIPTION = 8;
const COUNT_SIZE = 8;
const COUNT_LINE_HEIGHT = 10;
const COUNT_LETTER_SPACING = 1;
const BOTTOM = 4;

/**
 * Conteúdo do cartão com baú (um deck em Meus Decks, uma prova em Minhas Provas): baú no topo,
 * título (fonte pixel), descrição opcional (uma linha com reticências) e a quantidade. O título
 * reserva a altura de todas as suas linhas e os outros textos têm uma linha só, então todos os
 * cartões ficam com a mesma altura.
 */
export function DeckSummary({
  title,
  description,
  countLabel,
  titleLines = 1,
  countAlign = 'center',
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const multilineTitle = titleLines > 1;
  const hasDescription = description !== undefined;
  const titleSize = scale(TITLE_SIZE);
  const titleLineHeight = scale(TITLE_LINE_HEIGHT);

  const titleText = (
    <PixelText
      size={titleSize}
      letterSpacing={scale(TITLE_LETTER_SPACING)}
      color={Palette.forest}
      numberOfLines={titleLines}
      lineHeight={multilineTitle ? titleLineHeight : undefined}
      adjustsFontSizeToFit
      minimumFontScale={multilineTitle ? MIN_TITLE_SCALE : undefined}
      style={multilineTitle ? styles.centered : [styles.centered, { marginTop: scale(TITLE_GAP) }]}>
      {title}
    </PixelText>
  );

  return (
    <View style={[styles.container, { paddingBottom: scale(BOTTOM) }]}>
      {/* A caixa define o tamanho (60% da largura, proporção do arquivo); a imagem só preenche */}
      <View style={styles.chestBox}>
        {/* Decorativo: o cartão já tem o rótulo para o leitor de tela */}
        <Image source={CHEST} resizeMode="contain" accessible={false} style={styles.chest} />
      </View>
      {multilineTitle ? (
        // Altura de todas as linhas (a 1ª com a altura da fonte, como no PixelText), com o
        // título centralizado nela: um nome curto ocupa o mesmo espaço de um longo
        <View
          style={[
            styles.titleBox,
            {
              marginTop: scale(TITLE_GAP),
              minHeight: (titleLines - 1) * titleLineHeight + titleSize,
            },
          ]}>
          {titleText}
        </View>
      ) : (
        titleText
      )}
      {hasDescription ? (
        <BodyText
          size={scale(DESCRIPTION_SIZE)}
          lineHeight={scale(DESCRIPTION_LINE_HEIGHT)}
          numberOfLines={1}
          style={[styles.description, { marginTop: scale(DESCRIPTION_GAP) }]}>
          {/* Descrição vazia (é opcional no cadastro): espaço sem quebra, para a linha continuar
              ocupando a altura e o cartão ficar do mesmo tamanho dos outros */}
          {description || NO_DESCRIPTION}
        </BodyText>
      ) : null}
      <Text
        numberOfLines={1}
        maxFontSizeMultiplier={1.2}
        style={[
          styles.count,
          countAlign === 'right' && styles.countRight,
          {
            marginTop: scale(hasDescription ? COUNT_GAP : COUNT_GAP_NO_DESCRIPTION),
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
  titleBox: {
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  description: {
    alignSelf: 'stretch',
  },
  countRight: {
    alignSelf: 'flex-end',
  },
  count: {
    fontFamily: FontFamily.statValue,
    color: Palette.forest,
    textTransform: 'uppercase',
  },
});
