import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, View } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  icon: IconName;
  onPress: () => void;
  accessibilityLabel: string;
  /** Tamanho do ícone em px do mockup (padrão: 22) */
  size?: number;
  /**
   * Botão de ligar/desligar (ex.: marcador de texto da prova). Ligado, o ícone fica branco dentro
   * de um círculo verde escuro, que não muda o espaço ocupado; o leitor de tela informa o estado.
   * Sem a prop, é um botão comum.
   */
  toggled?: boolean;
};

/** Área de toque mínima recomendada, em dp (não escala com a tela) */
const MIN_TOUCH = 44;
/** Diâmetro do círculo do botão ligado em relação ao ícone */
const TOGGLED_CIRCLE_RATIO = 1.45;

/**
 * Botão só com o ícone, verde escuro, sem fundo (ex.: filtro dos Relatórios). A área de toque
 * tem pelo menos 44dp, mas margens negativas fazem o botão ocupar no layout só o tamanho do
 * ícone, alinhado como ele. Diferente do BackButton (círculo preenchido com seta branca).
 */
export function IconButton({ icon, onPress, accessibilityLabel, size = 22, toggled }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const iconSize = scale(size);
  const touch = Math.max(MIN_TOUCH, iconSize);
  const overflow = (touch - iconSize) / 2;
  const isToggle = toggled !== undefined;
  const circle = iconSize * TOGGLED_CIRCLE_RATIO;

  return (
    <Pressable
      accessibilityRole={isToggle ? 'togglebutton' : 'button'}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={isToggle ? { checked: toggled } : undefined}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { width: touch, height: touch, margin: -overflow },
        pressed && styles.pressed,
      ]}>
      {toggled ? (
        <View
          style={[
            styles.circle,
            {
              width: circle,
              height: circle,
              borderRadius: circle / 2,
              top: (touch - circle) / 2,
              left: (touch - circle) / 2,
            },
          ]}
        />
      ) : null}
      <MaterialCommunityIcons
        name={icon}
        size={iconSize}
        color={toggled ? Palette.white : Palette.forest}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    position: 'absolute',
    backgroundColor: Palette.forest,
  },
  pressed: {
    opacity: 0.6,
  },
});
