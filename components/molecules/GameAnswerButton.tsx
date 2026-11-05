import { Pressable, StyleSheet } from 'react-native';

import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Texto da resposta (ex.: "12") */
  label: string;
  accessibilityLabel: string;
  /** Resposta errada já tocada: fica vermelha e não recebe mais toques */
  wrong: boolean;
  /** Sem toque por outro motivo (ex.: o monstro já está sumindo) */
  disabled: boolean;
  onPress: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup: seguem os botões do app)
const HEIGHT = 40;
const RADIUS = 7;
const BORDER = 2;
const TEXT_SIZE = 9.5;

/**
 * Uma resposta de um jogo: botão verde escuro com borda amarela e texto em fonte pixel. Ocupa a
 * largura que o pai der (flex 1), para as opções lado a lado terem o mesmo tamanho.
 */
export function GameAnswerButton({ label, accessibilityLabel, wrong, disabled, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const size = scale(TEXT_SIZE);

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
        { minHeight: scale(HEIGHT), borderRadius: scale(RADIUS), borderWidth: scale(BORDER) },
        pressed && styles.pressed,
      ]}>
      <PixelText size={size} color={Palette.white} adjustsFontSizeToFit>
        {label}
      </PixelText>
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
  pressed: {
    opacity: 0.8,
  },
});
