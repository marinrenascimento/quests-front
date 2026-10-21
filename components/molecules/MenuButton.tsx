import { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { OutlinedText } from '@/components/atoms/OutlinedText';
import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { FontFamily, Palette } from '@/constants/theme';
import { useMockupScale } from '@/hooks/useMockupScale';

/** Imagem com margem transparente, no formato que o TrimmedImage espera */
export type TrimmedSource = Pick<
  ComponentProps<typeof TrimmedImage>,
  'source' | 'imageSize' | 'content'
>;

type Props = {
  label: string;
  /** Cor de fundo, visível pelo centro transparente da moldura */
  color: string;
  icon: TrimmedSource;
  onPress: () => void;
};

// Área visível de moldura1.png (2115 x 743, com margem transparente): proporção 3,8:1
const FRAME_IMAGE_SIZE = { width: 2115, height: 743 };
const FRAME_CONTENT = { x: 52, y: 119, width: 2011, height: 529 };

/** Altura do ícone em relação ao botão: passa um pouco das barras da moldura */
const ICON_HEIGHT = '86%';

/**
 * Botão do menu da Home: moldura dourada (moldura1.png) com a cor de fundo por trás,
 * ícone à esquerda e texto amarelo com contorno à direita.
 * A largura vem do pai; a altura sai da proporção da moldura (sem distorcer a imagem).
 */
export function MenuButton({ label, color, icon, onPress }: Props) {
  const { scale } = useMockupScale();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: color,
            borderRadius: scale(3),
            boxShadow: [
              {
                offsetX: 0,
                offsetY: scale(3),
                blurRadius: scale(4),
                color: Palette.menuButtonShadow,
              },
            ],
          },
        ]}
      />
      <TrimmedImage
        source={require('@/assets/images/outros/moldura1.png')}
        imageSize={FRAME_IMAGE_SIZE}
        content={FRAME_CONTENT}
        style={styles.frame}
      />
      <View style={styles.iconArea}>
        <TrimmedImage
          source={icon.source}
          imageSize={icon.imageSize}
          content={icon.content}
          style={styles.icon}
        />
      </View>
      <View style={styles.labelArea}>
        <OutlinedText
          style={[styles.label, { fontSize: scale(17.5), letterSpacing: scale(0.5) }]}
          outlineColor={Palette.menuTextOutline}
          outlineWidth={scale(1.7)}
          shadowColor={Palette.menuTextShadow}
          numberOfLines={1}
          adjustsFontSizeToFit
          maxFontSizeMultiplier={1.2}>
          {label}
        </OutlinedText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: FRAME_CONTENT.width / FRAME_CONTENT.height,
  },
  // O fundo vai até o meio das barras da moldura (laterais ~79px, topo/base ~67px no
  // arquivo): não sobra fresta por dentro nem aparece cor nos cantos chanfrados por fora
  fill: {
    position: 'absolute',
    left: '1.9%',
    right: '2%',
    top: '6.2%',
    bottom: '7.9%',
  },
  frame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  },
  // Ícone centralizado em ~24% da largura, como no mockup
  iconArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    height: ICON_HEIGHT,
  },
  // Texto centralizado em ~66% da largura, à direita do ícone
  labelArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '38%',
    right: '5%',
    justifyContent: 'center',
  },
  label: {
    fontFamily: FontFamily.menuButton,
    textAlign: 'center',
    color: Palette.menuText,
    includeFontPadding: false,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
});
