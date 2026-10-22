import { Fragment, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';

import type { MarkerColor, QuestionHighlights } from '@/constants/exams';
import { FontFamily, Palette } from '@/constants/theme';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  text: string;
  /** Marcações do texto: índice da palavra -> cor (sem marcações: undefined) */
  highlights?: QuestionHighlights;
  /** Cor do fundo de cada cor do marcador */
  highlightColors: Record<MarkerColor, string>;
  /** Modo marcador ligado: cada palavra recebe o toque */
  interactive: boolean;
  /** Palavra do primeiro toque, sublinhada até o segundo (null: nenhuma) */
  pendingWord: number | null;
  onWordPress: (wordIndex: number) => void;
};

// Medidas do mockup da realização de prova, em px
const SIZE = 13.6;
const LINE_HEIGHT = 18.4;

/**
 * Enunciado de uma questão que aceita marcações coloridas, como um marca-texto: o fundo colorido
 * fica atrás das palavras marcadas (o texto continua verde escuro). Palavras vizinhas da mesma
 * cor formam uma faixa só, porque o espaço entre elas também recebe o fundo. Só é dividido em
 * palavras (cada uma com o próprio toque) com o modo marcador ligado ou com alguma marcação;
 * senão, é um texto simples, mais leve.
 */
export function HighlightableText({
  text,
  highlights,
  highlightColors,
  interactive,
  pendingWord,
  onWordPress,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const words = useMemo(() => text.split(' '), [text]);
  const textStyle = [styles.text, { fontSize: scale(SIZE), lineHeight: scale(LINE_HEIGHT) }];

  if (!interactive && !highlights) {
    return (
      <Text maxFontSizeMultiplier={1.3} style={textStyle}>
        {text}
      </Text>
    );
  }

  return (
    <Text maxFontSizeMultiplier={1.3} style={textStyle}>
      {words.map((word, index) => {
        const color = highlights?.[index];
        const background = color ? { backgroundColor: highlightColors[color] } : undefined;
        // O espaço depois da palavra só é pintado se a próxima tiver a mesma cor
        const joined = color !== undefined && highlights?.[index + 1] === color;
        return (
          <Fragment key={index}>
            <Text
              onPress={interactive ? () => onWordPress(index) : undefined}
              style={[background, index === pendingWord && styles.pending]}>
              {word}
            </Text>
            {index < words.length - 1 ? <Text style={joined ? background : undefined}> </Text> : null}
          </Fragment>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.body,
    color: Palette.forest,
  },
  // Primeira palavra do trecho, à espera do segundo toque
  pending: {
    textDecorationLine: 'underline',
  },
});
