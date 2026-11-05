import { Pressable, StyleSheet } from 'react-native';

import { GameWordText } from '@/components/atoms/GameWordText';
import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Texto da resposta (ex.: "12" ou "exibição") */
  label: string;
  accessibilityLabel: string;
  /** Resposta errada já tocada: fica vermelha e não recebe mais toques */
  wrong: boolean;
  /** Resposta certa já tocada: fica verde */
  correct?: boolean;
  /** Sem toque por outro motivo (ex.: o monstro já está sumindo) */
  disabled: boolean;
  /**
   * 'pixel' (padrão): fonte pixel, para números. 'word': palavra em minúsculas e com acentos, para
   * os jogos de ortografia.
   */
  textVariant?: 'pixel' | 'word';
  onPress: () => void;
};

// Medidas em px do mockup da Help (os jogos não têm mockup: seguem os botões do app)
const HEIGHT = 40;
const RADIUS = 7;
const BORDER = 2;
const PIXEL_TEXT_SIZE = 9.5;
const WORD_TEXT_SIZE = 16;
const PADDING_HORIZONTAL = 8;

/**
 * Uma resposta de um jogo: botão verde escuro com borda amarela. Ocupa a largura que o pai der
 * (flex 1), para as opções lado a lado terem o mesmo tamanho.
 */
export function GameAnswerButton({
  label,
  accessibilityLabel,
  wrong,
  correct = false,
  disabled,
  textVariant = 'pixel',
  onPress,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: wrong || disabled }}
      disabled={wrong || disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        wrong && styles.wrong,
        correct && styles.correct,
        {
          minHeight: scale(HEIGHT),
          borderRadius: scale(RADIUS),
          borderWidth: scale(BORDER),
          paddingHorizontal: scale(PADDING_HORIZONTAL),
        },
        pressed && styles.pressed,
      ]}>
      {textVariant === 'word' ? (
        <GameWordText size={scale(WORD_TEXT_SIZE)}>{label}</GameWordText>
      ) : (
        <PixelText size={scale(PIXEL_TEXT_SIZE)} color={Palette.white} adjustsFontSizeToFit>
          {label}
        </PixelText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Palette.examYellow,
    backgroundColor: Palette.forest,
  },
  wrong: {
    borderColor: Palette.gameAnswerWrong,
    backgroundColor: Palette.gameAnswerWrong,
  },
  correct: {
    borderColor: Palette.gameAnswerRight,
    backgroundColor: Palette.gameAnswerRight,
  },
  pressed: {
    opacity: 0.8,
  },
});
