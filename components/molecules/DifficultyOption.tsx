import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { PixelText } from '@/components/atoms/PixelText';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Nome da dificuldade (exibido em caixa alta) */
  label: string;
  icon: IconName;
  accessibilityLabel: string;
  selected: boolean;
  onPress: () => void;
};

// Medidas do mockup da revisão de um deck convertidas para a escala da Help, em px
const ICON_SIZE = 26;
const LABEL_GAP = 6;
const LABEL_SIZE = 4.6;
const LABEL_LETTER_SPACING = 0.5;

/**
 * Uma opção de dificuldade da revisão: rosto de contorno e, embaixo, o nome em fonte pixel.
 * Só o ícone muda com a seleção (verde escuro quando marcada, sálvia pálido quando não);
 * o nome tem sempre a mesma cor. Ocupa a largura que o pai der (flex 1).
 */
export function DifficultyOption({ label, icon, accessibilityLabel, selected, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
      <MaterialCommunityIcons
        name={icon}
        size={scale(ICON_SIZE)}
        color={selected ? Palette.forest : Palette.difficultyIdle}
      />
      <PixelText
        size={scale(LABEL_SIZE)}
        letterSpacing={scale(LABEL_LETTER_SPACING)}
        color={Palette.forest}
        adjustsFontSizeToFit
        style={[styles.label, { marginTop: scale(LABEL_GAP) }]}>
        {label}
      </PixelText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});
