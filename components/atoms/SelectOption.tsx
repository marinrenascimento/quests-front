import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  /** Opção já escolhida: fundo sálvia e marca de seleção à direita */
  selected?: boolean;
  /** Ícone à esquerda do texto (ex.: "plus" na ação de criar), em verde escuro */
  icon?: IconName;
};

/** Altura mínima de cada linha, em dp (área de toque confortável) */
const MIN_HEIGHT = 40;
const ICON_SIZE = 18;

/**
 * Linha de uma lista de opções (campo de seleção com pesquisa): texto na mesma fonte e tamanho
 * do campo 'outlined', ícone opcional à esquerda e, se selecionada, fundo sálvia com marca à
 * direita. Informa a seleção aos leitores de tela.
 */
export function SelectOption({ label, onPress, selected = false, icon }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      {icon ? <MaterialCommunityIcons name={icon} size={ICON_SIZE} color={Palette.forest} /> : null}
      <Text
        numberOfLines={2}
        maxFontSizeMultiplier={1.3}
        style={[styles.label, icon && styles.labelAction]}>
        {label}
      </Text>
      {selected ? (
        <MaterialCommunityIcons name="check" size={ICON_SIZE} color={Palette.forest} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: MIN_HEIGHT,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  selected: {
    backgroundColor: Palette.rankCard,
  },
  pressed: {
    backgroundColor: Palette.inputFill,
  },
  label: {
    flex: 1,
    fontFamily: FontFamily.input,
    fontSize: 14,
    color: Palette.text,
  },
  // Ação de criar: verde escuro, para se distinguir das opções
  labelAction: {
    color: Palette.forest,
  },
});
