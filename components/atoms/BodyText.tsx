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
  /** Margens e largura */
  style?: StyleProp<TextStyle>;
};

// Texto corrido dos cartões (respostas do FAQ e seções da Estudos), em px do mockup da Help
const DEFAULT_SIZE = 9.6;
const DEFAULT_LINE_HEIGHT = 13.3;

/** Texto em sem serifa regular (Inter), verde escuro. Por padrão quebra em quantas linhas precisar. */
export function BodyText({
  children,
  size,
  lineHeight,
  align = 'left',
  numberOfLines,
  adjustsFontSizeToFit,
  style,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      maxFontSizeMultiplier={1.3}
      style={[
        styles.text,
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
});
