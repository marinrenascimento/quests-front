import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

type Props = {
  children: string;
  /** Fonte, tamanho e cor do preenchimento */
  style: StyleProp<TextStyle>;
  outlineColor: string;
  /** Espessura do contorno em dp */
  outlineWidth: number;
  /** Sombra suave abaixo do texto (o contorno também engrossa embaixo, efeito 3D) */
  shadowColor?: string;
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  maxFontSizeMultiplier?: number;
};

// 12 direções (a cada 30°): contorno uniforme, sem falhas nas diagonais
const RING = Array.from({ length: 12 }, (_, i) => {
  const angle = (i * Math.PI) / 6;
  return { dx: Math.cos(angle), dy: Math.sin(angle) };
});

/**
 * Texto com contorno grosso. O React Native não tem contorno de texto nativo, então
 * cópias do texto na cor do contorno ficam por trás, deslocadas em círculo.
 * Todas as cópias têm a mesma largura do texto principal, então com
 * adjustsFontSizeToFit todas encolhem igual e o contorno continua alinhado.
 */
export function OutlinedText({
  children,
  style,
  outlineColor,
  outlineWidth,
  shadowColor,
  numberOfLines,
  adjustsFontSizeToFit,
  maxFontSizeMultiplier,
}: Props) {
  const textProps = { numberOfLines, adjustsFontSizeToFit, maxFontSizeMultiplier };
  const layerStyle = [style, styles.layer, { color: outlineColor }];

  return (
    <View>
      {shadowColor ? (
        <Text
          {...textProps}
          aria-hidden
          style={[
            layerStyle,
            {
              transform: [{ translateY: outlineWidth * 1.6 }],
              textShadowColor: shadowColor,
              textShadowOffset: { width: 0, height: outlineWidth },
              textShadowRadius: outlineWidth * 1.5,
            },
          ]}>
          {children}
        </Text>
      ) : null}
      {RING.map(({ dx, dy }, index) => (
        <Text
          key={index}
          {...textProps}
          aria-hidden
          style={[
            layerStyle,
            {
              transform: [{ translateX: dx * outlineWidth }, { translateY: dy * outlineWidth }],
            },
          ]}>
          {children}
        </Text>
      ))}
      {/* Texto principal: fica por cima e define o tamanho do componente */}
      <Text {...textProps} style={style}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
