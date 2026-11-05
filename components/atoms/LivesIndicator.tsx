import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import type { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';

type Props = {
  /** Vidas que restam */
  lives: number;
  /** Vidas no início da partida */
  total: number;
  /** Tamanho de cada coração, em dp */
  size: number;
  lifeIcon: IconName;
  lifeLostIcon: IconName;
  /** Lido pelo leitor de tela (ex.: "Vidas: 2 de 3") */
  accessibilityLabel: string;
};

/** Vidas de um jogo: um coração por vida, cheio enquanto ela não foi perdida. */
export function LivesIndicator({
  lives,
  total,
  size,
  lifeIcon,
  lifeLostIcon,
  accessibilityLabel,
}: Props) {
  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={styles.row}>
      {Array.from({ length: total }, (_, index) => (
        <MaterialCommunityIcons
          key={index}
          name={index < lives ? lifeIcon : lifeLostIcon}
          size={size}
          color={index < lives ? Palette.gameLife : Palette.gameLifeLost}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
});
