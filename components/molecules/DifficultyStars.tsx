import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Estrelas preenchidas */
  filled: number;
  /** Total de estrelas */
  total: number;
  icon: IconName;
  emptyIcon: IconName;
  /** Lido no lugar das estrelas (ex.: "Dificuldade: 3 de 5") */
  accessibilityLabel: string;
};

/** Tamanho de cada estrela, em px do mockup da realização de prova */
const STAR_SIZE = 13.5;

/** Dificuldade em estrelas: as preenchidas e, depois, as vazias (só o contorno). */
export function DifficultyStars({ filled, total, icon, emptyIcon, accessibilityLabel }: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={styles.row}>
      {Array.from({ length: total }, (_, index) => (
        <MaterialCommunityIcons
          key={index}
          name={index < filled ? icon : emptyIcon}
          size={scale(STAR_SIZE)}
          color={Palette.forest}
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
