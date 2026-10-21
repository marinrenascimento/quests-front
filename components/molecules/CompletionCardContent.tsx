import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Ilustração acima do texto (decorativa) e a proporção do arquivo (largura / altura) */
  imageSource: ImageSourcePropType;
  imageAspectRatio: number;
  /** Texto abaixo da imagem, em uma linha */
  title: string;
};

// Medidas do mockup do fim da revisão, em relação à largura do cartão (sem padding). Ficam em
// margens e larguras dos filhos, que o Yoga calcula sobre a largura do container (o cartão)
const IMAGE_WIDTH = '42%';
const TITLE_GAP = '8%';
const SIDE_INSET = '5%';
// Texto em px do mockup, convertido para a escala da Help
const TITLE_SIZE = 23;
const TITLE_LINE_HEIGHT = 30;
/** Menor escala da fonte se o texto não couber numa linha (fonte do sistema maior) */
const MIN_TITLE_SCALE = 0.6;

/**
 * Conteúdo do card de fim da revisão: imagem e, abaixo, o texto em negrito numa linha só, com o
 * conjunto centralizado no cartão. As medidas são proporcionais à largura do cartão, que deve
 * ser colocado sem padding (InfoCard com padding 0).
 */
export function CompletionCardContent({ imageSource, imageAspectRatio, title }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.container}>
      {/* A caixa define o tamanho (largura e proporção do arquivo); a imagem só preenche */}
      <View style={[styles.imageBox, { aspectRatio: imageAspectRatio }]}>
        <Image
          source={imageSource}
          resizeMode="contain"
          accessible={false}
          style={styles.image}
        />
      </View>
      <BodyText
        size={scale(TITLE_SIZE)}
        lineHeight={scale(TITLE_LINE_HEIGHT)}
        weight="bold"
        align="center"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={MIN_TITLE_SCALE}
        accessibilityRole="header"
        style={styles.title}>
        {title}
      </BodyText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    width: IMAGE_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  title: {
    alignSelf: 'stretch',
    marginTop: TITLE_GAP,
    marginHorizontal: SIDE_INSET,
  },
});
