import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  /** Altura em dp; a imagem cobre essa área alinhada pela base */
  height: number;
};

// Posições das cores de Palette.homeBackgroundFade: cinza opaco no topo,
// meio esmaecido em ~1/3 e totalmente visível a partir da metade da imagem
const FADE_LOCATIONS = [0, 0.15, 0.32, 0.52] as const;

/**
 * Cenário fixo na base da tela, atrás do conteúdo, que vai sumindo para o cinza
 * do fundo conforme sobe. Não recebe toques (pointerEvents="none").
 */
export function FadedScenery({ height }: Props) {
  return (
    <View pointerEvents="none" style={[styles.container, { height }]}>
      <Image
        source={require('@/assets/images/cenarios/cenario.png')}
        contentFit="cover"
        contentPosition="bottom"
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={Palette.homeBackgroundFade}
        locations={FADE_LOCATIONS}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
