import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

type Props = {
  /** Fração preenchida, de 0 a 1 (valores fora disso são limitados) */
  progress: number;
  /** Espessura em dp */
  height: number;
  /** 'track': trilho branco atrás do preenchimento. 'plain': só o preenchimento. */
  variant?: 'track' | 'plain';
};

/** Barra horizontal: preenchimento verde escuro proporcional, sobre um trilho claro opcional. */
export function ProgressBar({ progress, height, variant = 'track' }: Props) {
  const fraction = Math.min(Math.max(progress, 0), 1);
  const radius = height * 0.18;

  return (
    <View
      style={[
        styles.track,
        variant === 'track' && styles.trackVisible,
        { height, borderRadius: radius },
      ]}>
      <View style={[styles.fill, { width: `${fraction * 100}%`, borderRadius: radius }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  trackVisible: {
    backgroundColor: Palette.white,
  },
  fill: {
    height: '100%',
    backgroundColor: Palette.forest,
  },
});
