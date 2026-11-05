import { StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  children: string;
  /** Tamanho da fonte em dp */
  size: number;
};

/** Altura da linha em relação à fonte: folga para os acentos não serem cortados */
const LINE_HEIGHT_RATIO = 1.35;

/**
 * Palavra de um jogo de ortografia, em Lilita One, branca e numa linha só (a fonte diminui se não
 * couber). Não usa a fonte pixel do resto do jogo, porque ela escreve tudo em caixa alta e os acentos
 * quase não aparecem, e aqui o acento faz parte da resposta.
 */
export function GameWordText({ children, size }: Props) {
  return (
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      maxFontSizeMultiplier={1.2}
      style={[styles.text, { fontSize: size, lineHeight: size * LINE_HEIGHT_RATIO }]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.menuButton,
    color: Palette.white,
    textAlign: 'center',
  },
});
