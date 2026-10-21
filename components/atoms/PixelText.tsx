import { DimensionValue, StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { FontFamily } from '@/constants/theme';

type Props = {
  children: string;
  /** Tamanho da fonte em dp */
  size: number;
  color: string;
  /** Espaçamento entre letras em dp */
  letterSpacing?: number;
  /**
   * Altura de cada linha em dp (padrão e mínimo: 1,4x o tamanho). Em textos de várias
   * linhas é o que define o espaço entre elas.
   */
  lineHeight?: number;
  /** Máximo de linhas (padrão: 1, cortando com reticências). 0 = sem limite: o texto quebra. */
  numberOfLines?: number;
  /** Diminui a fonte para caber em `numberOfLines` (iOS e Android) */
  adjustsFontSizeToFit?: boolean;
  /** Com adjustsFontSizeToFit: menor escala permitida da fonte, de 0 a 1 (só iOS) */
  minimumFontScale?: number;
  /** 'header' para títulos de tela ou seção (leitores de tela) */
  accessibilityRole?: 'header';
  /** Margens, alinhamento e largura */
  style?: StyleProp<TextStyle>;
};

/**
 * Altura mínima da linha em relação à fonte. Com 1x a fonte é cortada no topo em algumas
 * plataformas (no Windows/web ela usa uma métrica com descendente de 0,374em), então a
 * linha é mais alta e a sobra é descontada nas margens: a primeira linha começa no topo do
 * componente e a última termina na base, como se a linha tivesse a altura da fonte.
 */
const MIN_LINE_HEIGHT_RATIO = 1.4;

const toNumber = (value: DimensionValue | undefined) => (typeof value === 'number' ? value : 0);

/**
 * Texto em fonte pixel (Press Start 2P), sempre em caixa alta. Por padrão fica numa linha só
 * e, se não couber, é cortado com reticências.
 */
export function PixelText({
  children,
  size,
  color,
  letterSpacing = 0,
  lineHeight,
  numberOfLines = 1,
  adjustsFontSizeToFit,
  minimumFontScale,
  accessibilityRole,
  style,
}: Props) {
  const flat = StyleSheet.flatten(style) ?? {};
  const resolvedLineHeight = Math.max(lineHeight ?? 0, size * MIN_LINE_HEIGHT_RATIO);
  const extra = (resolvedLineHeight - size) / 2;

  return (
    <Text
      accessibilityRole={accessibilityRole}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail"
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      maxFontSizeMultiplier={1.2}
      style={[
        styles.text,
        { fontSize: size, lineHeight: resolvedLineHeight, letterSpacing, color },
        style,
        {
          marginTop: toNumber(flat.marginTop ?? flat.marginVertical ?? flat.margin) - extra,
          marginBottom: toNumber(flat.marginBottom ?? flat.marginVertical ?? flat.margin) - extra,
        },
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.pixel,
    textTransform: 'uppercase',
    includeFontPadding: false,
  },
});
