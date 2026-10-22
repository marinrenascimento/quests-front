import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  children: string;
  /** Tamanho da fonte em dp (padrão: texto corrido dos cartões da Help) */
  size?: number;
  /** Altura de cada linha em dp (padrão: texto corrido dos cartões da Help) */
  lineHeight?: number;
  align?: 'left' | 'center' | 'right';
  /** Máximo de linhas (padrão: sem limite, o texto quebra) */
  numberOfLines?: number;
  /** Diminui a fonte para caber em `numberOfLines` (iOS e Android) */
  adjustsFontSizeToFit?: boolean;
  /** Com adjustsFontSizeToFit: menor escala permitida da fonte, de 0 a 1 (só iOS) */
  minimumFontScale?: number;
  /** Peso da fonte (padrão: regular) */
  weight?: 'regular' | 'medium' | 'bold';
  /** 'header' para títulos de seção (leitores de tela) */
  accessibilityRole?: 'header';
  /** Margens e largura */
  style?: StyleProp<TextStyle>;
};

// Texto corrido dos cartões (respostas do FAQ e seções da Estudos), em px do mockup da Help
const DEFAULT_SIZE = 9.6;
const DEFAULT_LINE_HEIGHT = 13.3;

/**
 * Texto em sem serifa (Inter), verde escuro, regular, médio ou em negrito. Por padrão quebra em quantas
 * linhas precisar.
 */
export function BodyText({
  children,
  size,
  lineHeight,
  align = 'left',
  numberOfLines,
  adjustsFontSizeToFit,
  minimumFontScale,
  weight = 'regular',
  accessibilityRole,
  style,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Text
      accessibilityRole={accessibilityRole}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      maxFontSizeMultiplier={1.3}
      style={[
        styles.text,
        weight === 'medium' && styles.medium,
        weight === 'bold' && styles.bold,
        {
          fontSize: size ?? scale(DEFAULT_SIZE),
          lineHeight: lineHeight ?? scale(DEFAULT_LINE_HEIGHT),
          textAlign: align,
        },
        style,
      ]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.body,
    color: Palette.forest,
  },
  medium: {
    fontFamily: FontFamily.bodyMedium,
  },
  bold: {
    fontFamily: FontFamily.bodyBold,
  },
});
