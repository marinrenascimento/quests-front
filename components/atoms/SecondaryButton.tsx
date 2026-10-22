import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  title: string;
  onPress: () => void;
  /**
   * 'regular' (login), 'compact' (cadastro) ou 'small' (ex.: "Sair da prova"): mais baixo, com a
   * largura do texto e texto de peso médio
   */
  size?: 'regular' | 'compact' | 'small';
  /** Ícone à esquerda do texto (opcional) */
  icon?: IconName;
};

const SMALL_ICON_SIZE = 16;
/** Área de toque mínima recomendada, em dp: o tamanho 'small' ganha hitSlop vertical */
const MIN_TOUCH = 44;
const SMALL_HEIGHT = 31;
const SMALL_SLOP = (MIN_TOUCH - SMALL_HEIGHT) / 2;

export function SecondaryButton({ title, onPress, size = 'regular', icon }: Props) {
  const compact = size === 'compact';
  const small = size === 'small';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      hitSlop={small ? { top: SMALL_SLOP, bottom: SMALL_SLOP } : undefined}
      style={({ pressed }) => [
        styles.container,
        small ? styles.containerSmall : compact ? styles.containerCompact : styles.containerRegular,
        pressed && styles.pressed,
      ]}>
      {icon ? (
        <MaterialCommunityIcons name={icon} size={SMALL_ICON_SIZE} color={Palette.secondaryText} />
      ) : null}
      <Text
        maxFontSizeMultiplier={small ? 1.3 : undefined}
        numberOfLines={small ? 1 : undefined}
        style={[styles.text, compact && styles.textCompact, small && styles.textSmall]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.white,
    borderWidth: 1.5,
    borderColor: Palette.secondaryBorder,
  },
  containerRegular: {
    height: 47,
    borderRadius: 14,
  },
  containerCompact: {
    height: 33,
    borderRadius: 10,
    borderWidth: 1.2,
  },
  // Medidas do mockup da realização de prova
  containerSmall: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    height: SMALL_HEIGHT,
    borderRadius: 8,
    paddingHorizontal: 11,
    gap: 6,
  },
  text: {
    fontFamily: FontFamily.buttonSecondary,
    fontSize: 14.5,
    color: Palette.secondaryText,
  },
  textCompact: {
    fontSize: 14,
  },
  textSmall: {
    fontFamily: FontFamily.buttonMedium,
    fontSize: 12.5,
  },
  pressed: {
    opacity: 0.7,
  },
});
