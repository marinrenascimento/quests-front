import { Image, StyleSheet, View } from 'react-native';

import { TrimmedImageSpec, trimmedImageLayout } from '@/utils/trimmedImage';

type Props = {
  /** Número inteiro a desenhar (o sinal e as casas decimais são ignorados) */
  number: number;
  /** Altura de cada dígito em dp */
  size: number;
};

type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

// Um arquivo por dígito, cada um com tamanho e margem transparente diferentes;
// `content` é a área visível de cada um (medida nos PNGs)
const DIGITS: Record<Digit, TrimmedImageSpec> = {
  '0': {
    source: require('@/assets/images/numeros/numero0.png'),
    imageSize: { width: 1272, height: 1356 },
    content: { x: 347, y: 335, width: 658, height: 794 },
  },
  '1': {
    source: require('@/assets/images/numeros/numero1.png'),
    imageSize: { width: 745, height: 877 },
    content: { x: 169, y: 156, width: 389, height: 621 },
  },
  '2': {
    source: require('@/assets/images/numeros/numero2.png'),
    imageSize: { width: 585, height: 877 },
    content: { x: 92, y: 163, width: 469, height: 579 },
  },
  '3': {
    source: require('@/assets/images/numeros/numero3.png'),
    imageSize: { width: 721, height: 877 },
    content: { x: 133, y: 119, width: 500, height: 616 },
  },
  '4': {
    source: require('@/assets/images/numeros/numero4.png'),
    imageSize: { width: 976, height: 1100 },
    content: { x: 103, y: 162, width: 702, height: 791 },
  },
  '5': {
    source: require('@/assets/images/numeros/numero5.png'),
    imageSize: { width: 924, height: 1080 },
    content: { x: 178, y: 202, width: 588, height: 747 },
  },
  '6': {
    source: require('@/assets/images/numeros/numero6.png'),
    imageSize: { width: 896, height: 1196 },
    content: { x: 134, y: 202, width: 640, height: 748 },
  },
  '7': {
    source: require('@/assets/images/numeros/numero7.png'),
    imageSize: { width: 932, height: 1072 },
    content: { x: 142, y: 147, width: 624, height: 746 },
  },
  '8': {
    source: require('@/assets/images/numeros/numero8.png'),
    imageSize: { width: 904, height: 1116 },
    content: { x: 123, y: 220, width: 626, height: 746 },
  },
  '9': {
    source: require('@/assets/images/numeros/numero9.png'),
    imageSize: { width: 928, height: 1216 },
    content: { x: 143, y: 198, width: 641, height: 747 },
  },
};

/** Espaço entre dígitos, proporcional à altura (no mockup, "34" com 33px tem ~2,5px de vão) */
const DIGIT_GAP_RATIO = 0.08;

/**
 * Número amarelo pixelado montado com as imagens de assets/images/numeros:
 * cada dígito é cortado na área visível e todos ficam com a mesma altura (34 = "3" + "4").
 */
export function PixelNumber({ number, size }: Props) {
  const digits = String(Math.trunc(Math.abs(number))).split('') as Digit[];

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={String(Math.trunc(Math.abs(number)))}
      style={[styles.row, { height: size, gap: size * DIGIT_GAP_RATIO }]}>
      {digits.map((digit, index) => {
        const { source, imageSize, content } = DIGITS[digit];
        const layout = trimmedImageLayout(imageSize, content, size);
        return (
          <View key={index} style={[styles.digit, { width: layout.width, height: size }]}>
            <Image source={source} resizeMode="contain" style={layout.image} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  digit: {
    overflow: 'hidden',
  },
});
