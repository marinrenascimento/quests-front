import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';

import type { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { TrimmedImageSpec, trimmedImageLayout } from '@/utils/trimmedImage';

type Props = {
  /** Lido pelo leitor de tela: o quadrado mostra só a imagem */
  label: string;
  /** Sem imagem, o quadrado mostra `icon` (ex.: a opção "Sem Fundo") */
  image?: TrimmedImageSpec;
  icon?: IconName;
  /** Lado do quadrado, em dp */
  size: number;
  /** Fração do quadrado ocupada pela imagem (padrão: 1, a imagem preenche o quadrado) */
  imageFill?: number;
  selected: boolean;
  /** Marca do quadrado escolhido */
  selectedIcon: IconName;
  onPress: () => void;
};

// Medidas em px do mockup da Help
const RADIUS = 7;
const BORDER = 2;
const BADGE_SIZE = 14;
const ICON_SIZE = 24;

/**
 * Quadrado de uma grade de escolha de imagem: mostra a imagem sem a margem transparente do arquivo
 * e, quando escolhido, a borda verde escura e a marca no canto. Usa o expo-image, que decodifica o
 * arquivo no tamanho do quadrado: a grade inteira cabe na memória mesmo com PNGs grandes.
 */
export function ImageOptionTile({
  label,
  image,
  icon,
  size,
  imageFill = 1,
  selected,
  selectedIcon,
  onPress,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const box = size * imageFill;
  // A imagem cabe no quadrado pelo lado maior da área visível
  const height = image ? Math.min(box, box * (image.content.height / image.content.width)) : 0;
  const layout = image ? trimmedImageLayout(image.imageSize, image.content, height) : undefined;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: scale(RADIUS),
          borderWidth: scale(BORDER),
        },
        selected && styles.selected,
        pressed && styles.pressed,
      ]}>
      {image && layout ? (
        <View style={[styles.crop, { width: layout.width, height }]}>
          <Image source={image.source} contentFit="contain" style={layout.image} />
        </View>
      ) : icon ? (
        <MaterialCommunityIcons name={icon} size={scale(ICON_SIZE)} color={Palette.forest} />
      ) : null}
      {selected ? (
        <View style={[styles.badge, { top: scale(2), right: scale(2) }]}>
          <MaterialCommunityIcons
            name={selectedIcon}
            size={scale(BADGE_SIZE)}
            color={Palette.forest}
          />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderColor: Palette.examOption,
    backgroundColor: Palette.examOption,
  },
  selected: {
    borderColor: Palette.forest,
  },
  crop: {
    overflow: 'hidden',
  },
  // Fundo branco atrás da marca, para ela aparecer sobre qualquer imagem
  badge: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: Palette.white,
  },
  pressed: {
    opacity: 0.8,
  },
});
