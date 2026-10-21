import { Image, StyleSheet, View } from 'react-native';

import { RANK_LEVEL_LABELS, RankLevel } from '@/constants/ranking';
import { TrimmedImageSpec, trimmedImageLayout } from '@/utils/trimmedImage';

type Props = {
  level: RankLevel;
  /** Altura do ícone em dp; a largura sai da proporção da imagem */
  size: number;
};

// Ícones de assets/images/niveis, com margem transparente; `content` é a área visível de cada um
const LEVEL_IMAGES: Record<RankLevel, TrimmedImageSpec> = {
  diamante: {
    source: require('@/assets/images/niveis/diamante.png'),
    imageSize: { width: 973, height: 1268 },
    content: { x: 36, y: 246, width: 895, height: 766 },
  },
  esmeralda: {
    source: require('@/assets/images/niveis/esmeralda.png'),
    imageSize: { width: 763, height: 1408 },
    content: { x: 35, y: 291, width: 691, height: 791 },
  },
  rubi: {
    source: require('@/assets/images/niveis/rubi.png'),
    imageSize: { width: 769, height: 1392 },
    content: { x: 54, y: 254, width: 671, height: 788 },
  },
  ametista: {
    source: require('@/assets/images/niveis/ametista.png'),
    imageSize: { width: 3180, height: 4720 },
    content: { x: 154, y: 538, width: 2838, height: 3181 },
  },
  // Moeda laranja do mockup
  bronze: {
    source: require('@/assets/images/niveis/bronze.png'),
    imageSize: { width: 3136, height: 4976 },
    content: { x: 142, y: 412, width: 2868, height: 3004 },
  },
};

/** Pedra (ou moeda) do nível do jogador, cortada na área visível da imagem. */
export function LevelIcon({ level, size }: Props) {
  const { source, imageSize, content } = LEVEL_IMAGES[level];
  const layout = trimmedImageLayout(imageSize, content, size);

  return (
    <View
      accessible
      accessibilityRole="image"
      accessibilityLabel={`Nível ${RANK_LEVEL_LABELS[level].toLowerCase()}`}
      style={[styles.container, { width: layout.width, height: size }]}>
      <Image source={source} resizeMode="contain" style={layout.image} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
