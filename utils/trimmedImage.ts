import { ImageSourcePropType } from 'react-native';

export type ImageRect = { x: number; y: number; width: number; height: number };

/** PNG com margem transparente: o arquivo, o tamanho dele e a área visível (em pixels). */
export type TrimmedImageSpec = {
  source: ImageSourcePropType;
  imageSize: { width: number; height: number };
  content: ImageRect;
};

/**
 * Medidas em dp para mostrar só a área visível (`content`) de um PNG com margem transparente,
 * com essa área ocupando `height` de altura. Use num container de `width` x `height` com
 * overflow "hidden" e aplique `image` na <Image> (posição absoluta, proporção preservada).
 */
export function trimmedImageLayout(
  imageSize: TrimmedImageSpec['imageSize'],
  content: ImageRect,
  height: number,
) {
  const factor = height / content.height;

  return {
    width: content.width * factor,
    image: {
      position: 'absolute' as const,
      width: imageSize.width * factor,
      height: imageSize.height * factor,
      left: -content.x * factor,
      top: -content.y * factor,
    },
  };
}
