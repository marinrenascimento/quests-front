import { StyleSheet, View } from 'react-native';

import { IconTextButton } from '@/components/atoms/IconTextButton';
import { LivesIndicator } from '@/components/atoms/LivesIndicator';
import { PixelNumber } from '@/components/atoms/PixelNumber';
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
  /**
   * Número da partida, acima da contagem, com os números de assets/images/numeros. Sem ele (o jogo
   * não tem partidas), só a contagem aparece.
   */
  match?: {
    label: string;
    number: number;
    /** Lido pelo leitor de tela (ex.: "Partida 2") */
    accessibilityLabel: string;
  };
  /** Contagem já formatada (ex.: "3/6 Monstros"), exibida em caixa alta */
  scoreText: string;
  /** Lido pelo leitor de tela (ex.: "Monstros derrotados nesta partida: 3 de 6") */
  scoreAccessibilityLabel: string;
};

// Medidas em px do mockup da Help (os jogos não têm mockup)
const LIFE_SIZE = 20;
const SCORE_SIZE = 5.6;
const SCORE_LETTER_SPACING = 0.4;
const MATCH_LABEL_SIZE = 6.5;
const MATCH_NUMBER_SIZE = 20;
const MATCH_GAP = 5;
const MATCH_BOTTOM = 5;

/**
 * Barra do topo de um jogo, igual em todos: "Sair", vidas (se houver) e, à direita, a partida (se
 * houver) e a contagem.
 */
export function GameStatusBar({
  exitLabel,
  exitIcon,
  onExit,
  lives,
  match,
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
      <View style={styles.score}>
        {match ? (
          <View
            accessible
            accessibilityLabel={match.accessibilityLabel}
            style={[styles.match, { gap: scale(MATCH_GAP), marginBottom: scale(MATCH_BOTTOM) }]}>
            <PixelText size={scale(MATCH_LABEL_SIZE)} color={Palette.white}>
              {match.label}
            </PixelText>
            <PixelNumber number={match.number} size={scale(MATCH_NUMBER_SIZE)} />
          </View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  score: {
    alignItems: 'flex-end',
  },
  match: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
