import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Conteúdo centralizado dentro da moldura (ex.: um texto) */
  children: ReactNode;
};

// Medidas do mockup do modal de confirmação convertidas para a escala da Help, em px
const CORNER_SIZE = 12;
const CORNER_THICKNESS = 1.75;
const PADDING_VERTICAL = 15;
const PADDING_HORIZONTAL = 14;

const CORNERS = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const;

/**
 * Moldura de cantos: quatro "L" verde escuro nas quinas de uma área com espaço interno, com o
 * conteúdo centralizado. Cada canto é uma View quadrada com só duas bordas visíveis (ex.: topo
 * e esquerda), posicionada sobre a quina; não usa imagens nem bibliotecas.
 */
export function CornerFrame({ children }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const size = scale(CORNER_SIZE);
  const thickness = scale(CORNER_THICKNESS);

  return (
    <View
      style={[
        styles.frame,
        {
          paddingVertical: scale(PADDING_VERTICAL),
          paddingHorizontal: scale(PADDING_HORIZONTAL),
        },
      ]}>
      {CORNERS.map((corner) => (
        <View
          key={corner}
          style={[
            styles.corner,
            styles[corner],
            { width: size, height: size },
            corner.startsWith('top')
              ? { borderTopWidth: thickness }
              : { borderBottomWidth: thickness },
            corner.endsWith('Left')
              ? { borderLeftWidth: thickness }
              : { borderRightWidth: thickness },
          ]}
        />
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    borderColor: Palette.forest,
  },
  topLeft: { top: 0, left: 0 },
  topRight: { top: 0, right: 0 },
  bottomLeft: { bottom: 0, left: 0 },
  bottomRight: { bottom: 0, right: 0 },
});
