import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  message: string;
  /** Com true, aparece com fade, fica ~2,5 s e some sozinho */
  visible: boolean;
  /** Chamado quando o toast termina de sumir (o pai volta visible para false) */
  onHide: () => void;
};

// Duração das etapas, em ms (total de ~2,5 s na tela)
const FADE_IN = 200;
const HOLD = 2000;
const FADE_OUT = 300;
// Medidas em px do mockup da Help
const PADDING_HORIZONTAL = 14;
const PADDING_VERTICAL = 8;
const RADIUS = 10;
const TEXT_SIZE = 10.5;
const TEXT_LINE_HEIGHT = 14;

/**
 * Aviso curto de sucesso: cartão sálvia com texto verde escuro em negrito, que aparece com fade
 * e some sozinho. Não recebe toques (os toques passam para a tela de baixo) e é anunciado pelos
 * leitores de tela. A posição fica a cargo de quem o usa.
 */
export function Toast({ message, visible, onHide }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!visible) {
      return;
    }
    // No Android o accessibilityLiveRegion já anuncia; no iOS o anúncio é feito aqui
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(message);
    }
    opacity.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: FADE_IN, useNativeDriver: true }),
      Animated.delay(HOLD),
      Animated.timing(opacity, { toValue: 0, duration: FADE_OUT, useNativeDriver: true }),
    ]);
    animation.start(({ finished }) => {
      if (finished) {
        onHide();
      }
    });
    return () => animation.stop();
  }, [visible, message, opacity, onHide]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.toast,
        {
          opacity,
          paddingHorizontal: scale(PADDING_HORIZONTAL),
          paddingVertical: scale(PADDING_VERTICAL),
          borderRadius: scale(RADIUS),
          boxShadow: [
            { offsetX: 0, offsetY: scale(4), blurRadius: scale(12), color: Palette.modalShadowWide },
            { offsetX: 0, offsetY: scale(1), blurRadius: scale(3), color: Palette.modalShadowNear },
          ],
        },
      ]}>
      <BodyText
        size={scale(TEXT_SIZE)}
        lineHeight={scale(TEXT_LINE_HEIGHT)}
        weight="bold"
        align="center">
        {message}
      </BodyText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    maxWidth: '100%',
    backgroundColor: Palette.rankCard,
  },
});
