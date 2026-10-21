import { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, useWindowDimensions, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { IconButton } from '@/components/atoms/IconButton';
import { PixelText } from '@/components/atoms/PixelText';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { fitFontSize } from '@/utils/fitFontSize';

type Props = {
  /** Rótulo do canto superior esquerdo ("Front", "Back", "Fim"), em caixa alta. Opcional. */
  label?: string;
  /** Texto principal, centralizado na área livre do card */
  text: string;
  /** 'front': negrito e maior (frente e mensagens). 'back': regular e menor (verso). */
  variant: 'front' | 'back';
  /** Botão de virar na parte inferior central. Opcional. */
  flip?: { icon: IconName; label: string; onPress: () => void };
};

export type StudyCardContentProps = Props;

// Medidas do mockup da revisão de um deck convertidas para a escala da Help, em px
const LABEL_SIZE = 5;
const LABEL_LETTER_SPACING = 0.5;
/** Espaço entre o rótulo e o texto e entre o texto e o botão de virar */
const BODY_GAP = 10;
/** Recuo lateral do texto dentro do card */
const BODY_INSET = 6;
const FLIP_ICON_SIZE = 30;
/** O botão de virar fica mais longe da base do que o rótulo do topo (padding do card + isto) */
const BOTTOM_EXTRA = 7;
/**
 * Texto principal: tamanho do mockup, menor tamanho aceito para textos longos, altura da linha
 * e largura média de um caractere (estimativa com folga para a Inter), em relação à fonte.
 */
const TEXT_STYLES = {
  front: { size: 23, minSize: 11, lineHeightRatio: 1.25, charWidthRatio: 0.62 },
  back: { size: 18, minSize: 10, lineHeightRatio: 1.45, charWidthRatio: 0.56 },
};
/** Mesmo limite de aumento pela fonte do sistema que o BodyText aplica */
const MAX_FONT_SCALE = 1.3;
/** Rede de segurança do adjustsFontSizeToFit no iOS, caso a estimativa fique curta */
const MIN_FONT_SCALE = 0.5;

type Size = { width: number; height: number };

/**
 * Conteúdo do card grande da revisão: rótulo no canto superior esquerdo, texto centralizado
 * na área livre e, opcionalmente, o botão de virar embaixo. Ocupa toda a altura do cartão em
 * que é colocado.
 *
 * A tela não rola, então o texto se ajusta ao espaço medido: a fonte diminui só o necessário
 * para caber (fitFontSize), e numberOfLines + adjustsFontSizeToFit garantem que nada saia da
 * área, mesmo com a fonte do sistema aumentada.
 */
export function StudyCardContent({ label, text, variant, flip }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { fontScale } = useWindowDimensions();
  const [body, setBody] = useState<Size | null>(null);
  const textStyle = TEXT_STYLES[variant];

  const handleBodyLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setBody({ width: width - scale(BODY_INSET) * 2, height });
  };

  const renderText = (area: Size) => {
    // O texto real pode crescer com a fonte do sistema: a estimativa usa a área equivalente
    const multiplier = Math.min(Math.max(fontScale, 1), MAX_FONT_SCALE);
    const size = fitFontSize({
      text,
      width: area.width / multiplier,
      height: area.height / multiplier,
      maxSize: scale(textStyle.size),
      minSize: scale(textStyle.minSize),
      lineHeightRatio: textStyle.lineHeightRatio,
      charWidthRatio: textStyle.charWidthRatio,
    });
    const lineHeight = size * textStyle.lineHeightRatio;

    return (
      <BodyText
        size={size}
        lineHeight={lineHeight}
        weight={variant === 'front' ? 'bold' : 'regular'}
        align="center"
        numberOfLines={Math.max(1, Math.floor(area.height / (lineHeight * multiplier)))}
        adjustsFontSizeToFit
        minimumFontScale={MIN_FONT_SCALE}>
        {text}
      </BodyText>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: scale(BOTTOM_EXTRA) }]}>
      {label ? (
        <PixelText
          size={scale(LABEL_SIZE)}
          letterSpacing={scale(LABEL_LETTER_SPACING)}
          color={Palette.forest}>
          {label}
        </PixelText>
      ) : null}
      <View
        onLayout={handleBodyLayout}
        style={[
          styles.body,
          {
            marginTop: label ? scale(BODY_GAP) : 0,
            marginBottom: flip ? scale(BODY_GAP) : 0,
            paddingHorizontal: scale(BODY_INSET),
          },
        ]}>
        {/* Só desenha depois de medir a área, para já aparecer no tamanho certo */}
        {body ? renderText(body) : null}
      </View>
      {flip ? (
        <View style={styles.flip}>
          <IconButton
            icon={flip.icon}
            onPress={flip.onPress}
            accessibilityLabel={flip.label}
            size={FLIP_ICON_SIZE}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Área livre entre o rótulo e o botão de virar: o texto fica centralizado nela
  body: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flip: {
    alignItems: 'center',
  },
});
