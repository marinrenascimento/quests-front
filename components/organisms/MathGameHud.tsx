import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameAnswerButton } from '@/components/molecules/GameAnswerButton';
import { GameStatusBar } from '@/components/molecules/GameStatusBar';
import type { MathGameContent } from '@/constants/games';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  content: MathGameContent;
  lives: number;
  totalLives: number;
  /** Partida em andamento e monstros derrotados nela */
  match: number;
  matchProgress: number;
  itemsPerMatch: number;
  /** Opções de resposta da equação atual */
  options: number[];
  /** Opções erradas já tocadas */
  wrongOptions: number[];
  /** false: nenhuma resposta recebe toque (ex.: o monstro já está sumindo) */
  answersEnabled: boolean;
  onAnswer: (value: number) => void;
  onExit: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup)
const TOP_GAP = 8;
const ROW_GAP = 10;
const ANSWERS_GAP = 7;

/**
 * Painel no topo do jogo: "Sair", vidas, o número da partida e os monstros derrotados nela e, logo
 * abaixo, as respostas lado a lado. Fica por cima do cenário e respeita a barra de status do aparelho.
 */
export function MathGameHud({
  content,
  lives,
  totalLives,
  match,
  matchProgress,
  itemsPerMatch,
  options,
  wrongOptions,
  answersEnabled,
  onAnswer,
  onExit,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.hud,
        { width: layoutWidth, paddingHorizontal, paddingTop: insets.top + scale(TOP_GAP) },
      ]}>
      <GameStatusBar
        exitLabel={content.exitLabel}
        exitIcon={content.exitIcon}
        onExit={onExit}
        lives={{
          current: lives,
          total: totalLives,
          lifeIcon: content.lifeIcon,
          lifeLostIcon: content.lifeLostIcon,
          label: content.livesLabel(lives, totalLives),
        }}
        match={{
          label: content.matchLabel,
          number: match,
          accessibilityLabel: content.matchAccessibilityLabel(match),
        }}
        scoreText={content.progressLabel(matchProgress, itemsPerMatch)}
        scoreAccessibilityLabel={content.progressAccessibilityLabel(matchProgress, itemsPerMatch)}
      />
      <View style={[styles.answers, { gap: scale(ANSWERS_GAP), marginTop: scale(ROW_GAP) }]}>
        {/* Sempre 3 opções: um .map simples basta */}
        {options.map((value) => (
          <GameAnswerButton
            key={value}
            label={String(value)}
            accessibilityLabel={content.answerLabel(value)}
            wrong={wrongOptions.includes(value)}
            disabled={!answersEnabled}
            onPress={() => onAnswer(value)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hud: {
    alignSelf: 'center',
  },
  answers: {
    flexDirection: 'row',
  },
});
