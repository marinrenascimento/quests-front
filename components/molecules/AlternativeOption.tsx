import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Letra da alternativa, pela posição (A, B, C...) */
  letter: string;
  text: string;
  /**
   * Alternativa escolhida (ou, no Visualizar Questão, a correta): fundo verde escuro, círculo
   * amarelo e texto branco
   */
  selected: boolean;
  /** Sem ação, a linha é só leitura (ex.: Visualizar Questão): sem toque nem efeito */
  onPress?: () => void;
  /** Lido pelo leitor de tela depois do texto (ex.: "Correta"). Opcional. */
  statusLabel?: string;
};

// Medidas do mockup da realização de prova, em px
const MIN_HEIGHT = 36;
const RADIUS = 10;
const PADDING_HORIZONTAL = 8;
const PADDING_VERTICAL = 6;
const CIRCLE = 22;
const CIRCLE_BORDER = 1.5;
const LETTER_SIZE = 11;
const TEXT_GAP = 11;
const TEXT_SIZE = 13.6;
const TEXT_LINE_HEIGHT = 18.4;

/**
 * Uma alternativa de uma questão: linha clicável com o círculo da letra à esquerda e o texto à
 * direita (que quebra em mais linhas e faz a linha crescer). Não escolhida: fundo quase branco,
 * círculo branco com borda verde escura. Escolhida: fundo verde escuro, círculo amarelo sem
 * borda e texto branco.
 */
export function AlternativeOption({ letter, text, selected, onPress, statusLabel }: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const circle = scale(CIRCLE);

  return (
    <Pressable
      accessibilityRole={onPress ? 'radio' : 'text'}
      accessibilityLabel={[letter, text, statusLabel].filter(Boolean).join(', ')}
      accessibilityState={onPress ? { checked: selected } : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        {
          minHeight: scale(MIN_HEIGHT),
          borderRadius: scale(RADIUS),
          paddingHorizontal: scale(PADDING_HORIZONTAL),
          paddingVertical: scale(PADDING_VERTICAL),
        },
        pressed && styles.pressed,
      ]}>
      <View
        style={[
          styles.circle,
          selected ? styles.circleSelected : { borderWidth: scale(CIRCLE_BORDER) },
          { width: circle, height: circle, borderRadius: circle / 2 },
        ]}>
        <Text maxFontSizeMultiplier={1.2} style={[styles.letter, { fontSize: scale(LETTER_SIZE) }]}>
          {letter}
        </Text>
      </View>
      <Text
        maxFontSizeMultiplier={1.3}
        style={[
          styles.text,
          selected && styles.textSelected,
          {
            marginLeft: scale(TEXT_GAP),
            fontSize: scale(TEXT_SIZE),
            lineHeight: scale(TEXT_LINE_HEIGHT),
          },
        ]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.examOption,
  },
  rowSelected: {
    backgroundColor: Palette.forest,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Palette.forest,
    backgroundColor: Palette.white,
  },
  circleSelected: {
    backgroundColor: Palette.examYellow,
  },
  letter: {
    fontFamily: FontFamily.bodyBold,
    color: Palette.forest,
  },
  text: {
    flex: 1,
    fontFamily: FontFamily.body,
    color: Palette.forest,
  },
  textSelected: {
    color: Palette.white,
  },
  pressed: {
    opacity: 0.85,
  },
});
