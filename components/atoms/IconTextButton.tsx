import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  label: string;
  icon: IconName;
  onPress: () => void;
};

// Medidas do mockup da Help, em px
const WIDTH = 177.5;
const HEIGHT = 28.5;
const RADIUS = 6;
const ICON_SIZE = 14;
const ICON_GAP = 5;
const FONT_SIZE = 10.5;

/**
 * Botão compacto verde escuro (cor sólida), com ícone à esquerda do texto em sem serifa
 * semi-negrito, como o "Falar com o suporte". Diferente do PrimaryButton (degradê, largura
 * total e texto em caixa alta), usado no login e cadastro.
 */
export function IconTextButton({ label, icon, onPress }: Props) {
  const { scale, layoutWidth } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          // Em telas estreitas (ou fonte grande) o botão não passa da largura útil
          width: scale(WIDTH),
          maxWidth: layoutWidth - scale(30),
          minHeight: scale(HEIGHT),
          borderRadius: scale(RADIUS),
          paddingHorizontal: scale(10),
          gap: scale(ICON_GAP),
          boxShadow: [
            { offsetX: 0, offsetY: scale(1.5), blurRadius: scale(3), color: Palette.cardShadow },
          ],
        },
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={scale(ICON_SIZE)} color={Palette.white} />
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.3}
        style={[styles.label, { fontSize: scale(FONT_SIZE) }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.forest,
  },
  label: {
    flexShrink: 1,
    fontFamily: FontFamily.buttonCompact,
    color: Palette.white,
  },
  pressed: {
    opacity: 0.85,
  },
});
