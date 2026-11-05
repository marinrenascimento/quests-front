import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

/**
 * Como a casa está:
 * - 'idle': normal.
 * - 'selecting': na seleção em andamento.
 * - 'found': parte de uma resposta achada.
 * - 'miss': na seleção errada que acabou de ser feita.
 */
export type WordSearchCellState = 'idle' | 'selecting' | 'found' | 'miss';

type Props = {
  letter: string;
  /** Lado da casa, em dp */
  size: number;
  state: WordSearchCellState;
};

/** Tamanho da letra em relação à casa */
const LETTER_RATIO = 0.46;

/**
 * Uma casa do caça-palavras: a letra em fonte pixel, com o fundo de acordo com o estado. Memorizada:
 * ao arrastar, só as casas que mudam de estado são desenhadas de novo. Não recebe toques: quem cuida
 * deles é a grade.
 */
export const WordSearchCell = memo(function WordSearchCell({ letter, size, state }: Props) {
  return (
    <View style={[styles.cell, CELL_STYLES[state], { width: size, height: size }]}>
      {/* Sem seleção de texto: na web, ela atrapalharia o arraste por cima das letras */}
      <Text
        selectable={false}
        maxFontSizeMultiplier={1}
        style={[
          styles.letter,
          TEXT_STYLES[state],
          { fontSize: size * LETTER_RATIO, lineHeight: size * 0.8 },
        ]}>
        {letter}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: FontFamily.pixel,
    includeFontPadding: false,
  },
});

const CELL_STYLES = StyleSheet.create({
  idle: { backgroundColor: Palette.examOption },
  selecting: { backgroundColor: Palette.examYellow },
  found: { backgroundColor: Palette.gameAnswerRight },
  miss: { backgroundColor: Palette.gameAnswerWrong },
});

const TEXT_STYLES = StyleSheet.create({
  idle: { color: Palette.forest },
  selecting: { color: Palette.forest },
  found: { color: Palette.white },
  miss: { color: Palette.white },
});
