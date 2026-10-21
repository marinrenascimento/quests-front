import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { TrimmedImage } from '@/components/atoms/TrimmedImage';

// Área visível de knightOfQuestions.png (1024 x 1024, com margem transparente)
const LOGO_IMAGE_SIZE = { width: 1024, height: 1024 };
const LOGO_CONTENT = { x: 117, y: 325, width: 795, height: 271 };

/**
 * Banner do topo da Home: cenário de fundo, cavaleiro lendo à esquerda (na base)
 * e o logo à direita, centralizado na vertical. Ocupa todo o espaço do pai.
 */
export function HomeBanner() {
  return (
    <View style={styles.container}>
      {/* Alinhado pela base: céu no topo, montanhas no meio e a trilha embaixo, como no mockup */}
      <Image
        source={require('@/assets/images/cenarios/cenario.png')}
        contentFit="cover"
        contentPosition="bottom"
        style={StyleSheet.absoluteFill}
      />
      {/* Caixa de 78% da altura x 40% da largura: com "contain" o cavaleiro usa a menor das
          duas, então não invade o logo em telas mais altas */}
      <View style={styles.knightBox}>
        <Image
          source={require('@/assets/images/outros/cavaleiroLendo.png')}
          contentFit="contain"
          contentPosition={{ left: 0, bottom: 0 }}
          style={styles.fill}
          accessibilityLabel="Cavaleiro Lendo um Livro"
        />
      </View>
      <View style={styles.logoBox}>
        <TrimmedImage
          source={require('@/assets/images/outros/knightOfQuestions.png')}
          imageSize={LOGO_IMAGE_SIZE}
          content={LOGO_CONTENT}
          style={styles.logo}
          accessibilityLabel="Knight of Questions"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  knightBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '40%',
    height: '78%',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  // Logo com ~57% da largura e ~4,6% de margem à direita (medidas do mockup)
  logoBox: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '4.6%',
    width: '57%',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
  },
});
