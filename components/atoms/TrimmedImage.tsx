import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number };

type Props = {
  source: ImageSourcePropType;
  /** Tamanho do arquivo em pixels */
  imageSize: { width: number; height: number };
  /** Área visível (sem a margem transparente) dentro do arquivo, em pixels */
  content: Rect;
  /** Defina a largura OU a altura; a outra sai da proporção de `content` */
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

/**
 * Mostra só a parte visível de um PNG com margem transparente, preservando a proporção
 * (resizeMode "contain" sobre o arquivo inteiro, deslocado para que `content` preencha o container).
 */
export function TrimmedImage({ source, imageSize, content, style, accessibilityLabel }: Props) {
  const imageStyle = {
    width: `${(imageSize.width / content.width) * 100}%`,
    height: `${(imageSize.height / content.height) * 100}%`,
    left: `${(-content.x / content.width) * 100}%`,
    top: `${(-content.y / content.height) * 100}%`,
  } as const;

  return (
    <View
      accessible={!!accessibilityLabel}
      accessibilityRole={accessibilityLabel ? 'image' : undefined}
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, { aspectRatio: content.width / content.height }, style]}>
      <Image source={source} resizeMode="contain" style={[styles.image, imageStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
});
