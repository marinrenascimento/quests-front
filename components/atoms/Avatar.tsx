import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  /** Diâmetro em dp (padrão: 26, o tamanho usado no TopBar) */
  size?: number;
  /** Cor do círculo (padrão: branco) */
  color?: string;
  /** Silhueta de usuário dentro do círculo (padrão: sim). Sem ela, o círculo é liso. */
  showSilhouette?: boolean;
  /** Imagem do jogador; quando existir, preenche o círculo no lugar da silhueta */
  source?: ImageSourcePropType;
};

/**
 * Círculo de avatar. Sem props: círculo branco com silhueta de usuário (cabeça + tronco)
 * em verde escuro, como no TopBar. Também serve de placeholder liso (showSilhouette={false}).
 */
export function Avatar({
  size = SIZE,
  color = Palette.white,
  showSilhouette = true,
  source,
}: Props) {
  // Medidas da silhueta foram tiradas para 26dp; em outros tamanhos, tudo escala junto
  const k = size / SIZE;

  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
      ]}>
      {source ? (
        <Image
          source={source}
          resizeMode="cover"
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : showSilhouette ? (
        <>
          <View
            style={[
              styles.head,
              { top: 3.4 * k, width: 7.8 * k, height: 8.2 * k, borderRadius: 4.1 * k },
            ]}
          />
          <View
            style={[
              styles.body,
              {
                // Topo visual da elipse em ~14.2: compensa o encolhimento do scaleY (feito a partir do centro)
                top: (14.2 - (BODY_WIDTH * (1 - BODY_SCALE_Y)) / 2) * k,
                width: BODY_WIDTH * k,
                height: BODY_WIDTH * k,
                borderRadius: (BODY_WIDTH / 2) * k,
              },
            ]}
          />
        </>
      ) : null}
    </View>
  );
}

const SIZE = 26;
const BODY_WIDTH = 14;
// Tronco: círculo achatado verticalmente vira uma elipse de 14 x 8.4
const BODY_SCALE_Y = 0.6;

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
  },
  head: {
    position: 'absolute',
    backgroundColor: Palette.forest,
  },
  body: {
    position: 'absolute',
    backgroundColor: Palette.forest,
    transform: [{ scaleY: BODY_SCALE_Y }],
  },
});
