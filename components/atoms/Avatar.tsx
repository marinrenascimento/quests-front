import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

/** Círculo branco com silhueta de usuário (cabeça + tronco) em verde escuro, como no mockup. */
export function Avatar() {
  return (
    <View style={styles.circle}>
      <View style={styles.head} />
      <View style={styles.body} />
    </View>
  );
}

const SIZE = 26;
const BODY_WIDTH = 14;
// Tronco: círculo achatado verticalmente vira uma elipse de 14 x 8.4
const BODY_SCALE_Y = 0.6;

const styles = StyleSheet.create({
  circle: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: 'center',
    backgroundColor: Palette.white,
  },
  head: {
    position: 'absolute',
    top: 3.4,
    width: 7.8,
    height: 8.2,
    borderRadius: 4.1,
    backgroundColor: Palette.forest,
  },
  body: {
    position: 'absolute',
    // Topo visual da elipse em ~14.2: compensa o encolhimento do scaleY (feito a partir do centro)
    top: 14.2 - (BODY_WIDTH * (1 - BODY_SCALE_Y)) / 2,
    width: BODY_WIDTH,
    height: BODY_WIDTH,
    borderRadius: BODY_WIDTH / 2,
    backgroundColor: Palette.forest,
    transform: [{ scaleY: BODY_SCALE_Y }],
  },
});
