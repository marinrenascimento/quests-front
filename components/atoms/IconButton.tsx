import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  /** Tamanho do ícone em px do mockup (padrão: 22) */
  size?: number;
};

/** Área de toque mínima recomendada, em dp (não escala com a tela) */
const MIN_TOUCH = 44;

/**
 * Botão só com o ícone, verde escuro, sem fundo (ex.: filtro dos Relatórios). A área de toque
 * tem pelo menos 44dp, mas margens negativas fazem o botão ocupar no layout só o tamanho do
 * ícone, alinhado como ele. Diferente do BackButton (círculo preenchido com seta branca).
 */
export function IconButton({ icon, onPress, accessibilityLabel, size = 22 }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const iconSize = scale(size);
  const touch = Math.max(MIN_TOUCH, iconSize);
  const overflow = (touch - iconSize) / 2;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { width: touch, height: touch, margin: -overflow },
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={iconSize} color={Palette.forest} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.6,
  },
});
