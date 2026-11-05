import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet, View } from 'react-native';

import { TrimmedImageSpec, trimmedImageLayout } from '@/utils/trimmedImage';

type Props = {
  background: ImageSourcePropType;
  /** Personagem do jogo, sem a margem transparente do arquivo */
  character: TrimmedImageSpec;
  /** Lado do quadrado, em dp */
  size: number;
  /** Fração do lado que o personagem pode ocupar, na largura e na altura */
  characterFill: number;
  /** Distância do personagem até a base, em fração do lado (padrão: centralizado) */
  characterBottom?: number;
};

/**
 * Quadrado com o cenário de um jogo e o personagem por cima, inteiro. Usa o expo-image, que decodifica
 * os arquivos no tamanho da tela: os cenários são PNGs grandes.
 */
export function GameSceneImage({ background, character, size, characterFill, characterBottom }: Props) {
  const box = size * characterFill;
  const { content, imageSize, source } = character;
  // O personagem cabe na área pelo lado maior da parte visível
  const height = Math.min(box, box * (content.height / content.width));
  const layout = trimmedImageLayout(imageSize, content, height);
  const bottom = characterBottom === undefined ? (size - height) / 2 : size * characterBottom;

  return (
    <View style={{ width: size, height: size }}>
      <Image source={background} contentFit="cover" style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.character,
          { width: layout.width, height, bottom, left: (size - layout.width) / 2 },
        ]}>
        <Image source={source} contentFit="contain" style={layout.image} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  character: {
    position: 'absolute',
    overflow: 'hidden',
  },
});
