import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet } from 'react-native';

import { PixelText } from '@/components/atoms/PixelText';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  label: string;
  icon: IconName;
  onPress: () => void;
};

// Medidas do mockup da Help, em px
const HEIGHT = 72.5;
const RADIUS = 6;
const ICON_SIZE = 24;
const ICON_LABEL_GAP = 8;
const LABEL_SIZE = 7;
const LABEL_LETTER_SPACING = 0.7;

/**
 * Botão da grade da Help: fundo verde escuro, ícone branco centralizado e rótulo em fonte
 * pixel embaixo. A largura vem do pai.
 */
export function HelpMenuButton({ label, icon, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          minHeight: scale(HEIGHT),
          borderRadius: scale(RADIUS),
          paddingHorizontal: scale(8),
          paddingVertical: scale(10),
          boxShadow: [
            { offsetX: 0, offsetY: scale(2), blurRadius: scale(4), color: Palette.cardShadow },
          ],
        },
        pressed && styles.pressed,
      ]}>
      <MaterialCommunityIcons name={icon} size={scale(ICON_SIZE)} color={Palette.white} />
      {/* "PRIVACIDADE" é o rótulo mais longo: se não couber, a fonte diminui */}
      <PixelText
        size={scale(LABEL_SIZE)}
        letterSpacing={scale(LABEL_LETTER_SPACING)}
        color={Palette.white}
        adjustsFontSizeToFit
        style={[styles.label, { marginTop: scale(ICON_LABEL_GAP) }]}>
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
    backgroundColor: Palette.forest,
  },
  label: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
