import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
};

// Medidas do mockup dos cards de um deck convertidas para a escala da Help, em px
const SIZE = 24;
const ICON_SIZE = 13;
/** Área de toque mínima recomendada, em dp (completada com hitSlop) */
const MIN_TOUCH = 44;

/**
 * Botão circular pequeno, verde escuro acinzentado, com ícone branco (ações dos cards de um
 * deck). O círculo é pequeno, mas o hitSlop deixa a área de toque com ~44dp.
 * Diferente do BackButton (maior, verde escuro, sempre a seta de voltar).
 */
export function CircleIconButton({ icon, onPress, accessibilityLabel }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const size = scale(SIZE);
  const slop = Math.max(0, (MIN_TOUCH - size) / 2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={slop}
      style={({ pressed }) => [
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={scale(ICON_SIZE)} color={Palette.white} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.cardAction,
  },
  pressed: {
    opacity: 0.75,
  },
});
