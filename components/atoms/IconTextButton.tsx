import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  label: string;
  /** Ícone à esquerda do texto (opcional) */
  icon?: IconName;
  onPress: () => void;
  /**
   * 'support' (padrão): largura fixa e centralizado, texto semi-negrito, como o "Falar com o
   * suporte". 'block': ocupa a largura que o pai der (flex 1), mais alto, texto de peso médio,
   * como os botões de Meus Decks.
   */
  variant?: 'support' | 'block';
};

// Medidas do mockup da Help, em px
const VARIANTS = {
  support: { height: 28.5, radius: 6, paddingHorizontal: 10, fontSize: 10.5 },
  block: { height: 33, radius: 7, paddingHorizontal: 8, fontSize: 9.5 },
};
const SUPPORT_WIDTH = 177.5;
const ICON_SIZE = 14;
const ICON_GAP = 5;

/**
 * Botão compacto verde escuro (cor sólida), com ícone opcional à esquerda do texto em sem
 * serifa, sem caixa alta. Diferente do PrimaryButton (degradê, largura total e texto em caixa
 * alta), usado no login e cadastro.
 */
export function IconTextButton({ label, icon, onPress, variant = 'support' }: Props) {
  const { scale, layoutWidth } = useMockupScale(HELP_MOCKUP_WIDTH);
  const size = VARIANTS[variant];
  const isSupport = variant === 'support';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSupport
          ? {
              // Em telas estreitas (ou fonte grande) o botão não passa da largura útil
              width: scale(SUPPORT_WIDTH),
              maxWidth: layoutWidth - scale(30),
            }
          : styles.block,
        {
          minHeight: scale(size.height),
          borderRadius: scale(size.radius),
          paddingHorizontal: scale(size.paddingHorizontal),
          gap: scale(ICON_GAP),
          boxShadow: [
            { offsetX: 0, offsetY: scale(1.5), blurRadius: scale(3), color: Palette.cardShadow },
          ],
        },
        pressed && styles.pressed,
      ]}>
      {icon ? (
        <MaterialCommunityIcons name={icon} size={scale(ICON_SIZE)} color={Palette.white} />
      ) : null}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.3}
        style={[
          styles.label,
          isSupport ? styles.labelSupport : styles.labelBlock,
          { fontSize: scale(size.fontSize) },
        ]}>
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
  block: {
    flex: 1,
    alignSelf: 'stretch',
  },
  label: {
    flexShrink: 1,
    color: Palette.white,
  },
  labelSupport: {
    fontFamily: FontFamily.buttonCompact,
  },
  labelBlock: {
    fontFamily: FontFamily.buttonMedium,
  },
  pressed: {
    opacity: 0.85,
  },
});
