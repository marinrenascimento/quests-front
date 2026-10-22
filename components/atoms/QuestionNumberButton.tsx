import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Número exibido (a posição da questão na prova) */
  label: string;
  /** Questão respondida: fundo verde escuro e número branco */
  answered: boolean;
  /** Questão atual: anel amarelo por fora do botão */
  current: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

// Medidas do mockup da realização de prova, em px
export const QUESTION_NUMBER_SIZE = 28;
const RADIUS = 6.8;
const BORDER = 1;
/** Anel amarelo da questão atual, desenhado por fora do botão (não muda o tamanho dele) */
export const QUESTION_NUMBER_RING = 2.5;
const FONT_SIZE = 12;
/** Área de toque mínima recomendada, em dp (completada na vertical com hitSlop) */
const MIN_TOUCH = 44;
/** Toque a mais nas laterais: metade do vão entre os botões, sem invadir o vizinho */
const SIDE_SLOP = 3.5;

/**
 * Botão quadrado de cantos arredondados com o número de uma questão (navegador da prova). O
 * preenchimento indica se a questão foi respondida (verde escuro) ou não (branco, ou sálvia
 * claro quando é a atual) e o anel amarelo por fora indica a questão atual.
 */
export const QuestionNumberButton = memo(function QuestionNumberButton({
  label,
  answered,
  current,
  onPress,
  accessibilityLabel,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const size = scale(QUESTION_NUMBER_SIZE);
  const radius = scale(RADIUS);
  const ring = scale(QUESTION_NUMBER_RING);
  const verticalSlop = Math.max(0, (MIN_TOUCH - size) / 2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: current }}
      onPress={onPress}
      hitSlop={{
        top: verticalSlop,
        bottom: verticalSlop,
        left: scale(SIDE_SLOP),
        right: scale(SIDE_SLOP),
      }}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, borderRadius: radius, borderWidth: scale(BORDER) },
        answered ? styles.answered : current ? styles.currentOpen : styles.open,
        pressed && styles.pressed,
      ]}>
      {current ? (
        <View
          pointerEvents="none"
          style={[
            styles.ring,
            {
              top: -ring - scale(BORDER),
              left: -ring - scale(BORDER),
              right: -ring - scale(BORDER),
              bottom: -ring - scale(BORDER),
              borderWidth: ring,
              borderRadius: radius + ring,
            },
          ]}
        />
      ) : null}
      <Text
        maxFontSizeMultiplier={1.2}
        style={[
          styles.label,
          answered && styles.labelAnswered,
          { fontSize: scale(FONT_SIZE) },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Palette.forest,
  },
  answered: {
    backgroundColor: Palette.forest,
  },
  // Atual e ainda não respondida: o sálvia dos cartões
  currentOpen: {
    backgroundColor: Palette.rankCard,
  },
  open: {
    backgroundColor: Palette.white,
  },
  ring: {
    position: 'absolute',
    borderColor: Palette.examYellow,
  },
  label: {
    fontFamily: FontFamily.buttonCompact,
    color: Palette.forest,
  },
  labelAnswered: {
    color: Palette.white,
  },
  pressed: {
    opacity: 0.8,
  },
});
