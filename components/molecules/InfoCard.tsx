import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Título em fonte pixel, no topo do cartão (opcional) */
  title?: string;
  /**
   * 'regular': títulos das telas de ajuda. 'small': títulos menores, como os dos cartões dos
   * Relatórios (cabem em uma linha mesmo os longos).
   */
  titleSize?: 'regular' | 'small';
  /** Espaço interno em px do mockup (padrão: 15, o das telas de ajuda) */
  padding?: number;
  children: ReactNode;
};

// Medidas do mockup da Help, em px
const PADDING = 15;
const RADIUS = 10;
const TITLE_GAP = 13;
const TITLE_STYLES = {
  regular: { size: 8, letterSpacing: 0.8, lineHeight: 14 },
  small: { size: 5.85, letterSpacing: 0.55, lineHeight: 11 },
};

/** Cartão verde sálvia de cantos arredondados, com título opcional e o conteúdo embaixo. */
export function InfoCard({ title, titleSize = 'regular', padding = PADDING, children }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const titleStyle = TITLE_STYLES[titleSize];

  return (
    <View
      style={[
        styles.card,
        {
          padding: scale(padding),
          borderRadius: scale(RADIUS),
          boxShadow: [
            { offsetX: 0, offsetY: scale(2), blurRadius: scale(4), color: Palette.cardShadow },
          ],
        },
      ]}>
      {title ? (
        <PixelText
          size={scale(titleStyle.size)}
          letterSpacing={scale(titleStyle.letterSpacing)}
          lineHeight={scale(titleStyle.lineHeight)}
          numberOfLines={0}
          color={Palette.forest}
          style={{ marginBottom: scale(TITLE_GAP) }}>
          {title}
        </PixelText>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.rankCard,
  },
});
