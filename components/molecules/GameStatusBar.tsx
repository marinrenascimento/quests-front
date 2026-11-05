import { StyleSheet, View } from 'react-native';

import { IconTextButton } from '@/components/atoms/IconTextButton';
import { LivesIndicator } from '@/components/atoms/LivesIndicator';
import { PixelText } from '@/components/atoms/PixelText';
import type { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  exitLabel: string;
  exitIcon: IconName;
  onExit: () => void;
  /** Vidas da partida. Sem elas (o jogo não tem vidas), só "Sair" e a contagem aparecem. */
  lives?: {
    current: number;
    total: number;
    lifeIcon: IconName;
    lifeLostIcon: IconName;
    /** Lido pelo leitor de tela (ex.: "Vidas: 2 de 3") */
    label: string;
  };
  /** Contagem já formatada (ex.: "3 Monstros"), exibida em caixa alta */
  scoreText: string;
  /** Lido pelo leitor de tela (ex.: "Monstros derrotados: 3") */
  scoreAccessibilityLabel: string;
};

// Medidas em px do mockup da Help (os jogos não têm mockup)
const LIFE_SIZE = 20;
const SCORE_SIZE = 5.6;
const SCORE_LETTER_SPACING = 0.4;

/** Barra do topo de uma partida, igual em todos os jogos: "Sair", vidas (se houver) e contagem. */
export function GameStatusBar({
  exitLabel,
  exitIcon,
  onExit,
  lives,
  scoreText,
  scoreAccessibilityLabel,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.row}>
      <IconTextButton
        label={exitLabel}
        icon={exitIcon}
        onPress={onExit}
        variant="compact"
        tone="light"
      />
      {lives ? (
        <LivesIndicator
          lives={lives.current}
          total={lives.total}
          size={scale(LIFE_SIZE)}
          lifeIcon={lives.lifeIcon}
          lifeLostIcon={lives.lifeLostIcon}
          accessibilityLabel={lives.label}
        />
      ) : null}
      <View accessible accessibilityLabel={scoreAccessibilityLabel}>
        <PixelText
          size={scale(SCORE_SIZE)}
          letterSpacing={scale(SCORE_LETTER_SPACING)}
          color={Palette.white}>
          {scoreText}
        </PixelText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
