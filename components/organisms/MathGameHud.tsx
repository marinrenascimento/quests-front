import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTextButton } from '@/components/atoms/IconTextButton';
import { LivesIndicator } from '@/components/atoms/LivesIndicator';
import { PixelText } from '@/components/atoms/PixelText';
import { GameAnswerButton } from '@/components/molecules/GameAnswerButton';
import type { MathGameContent } from '@/constants/games';
import { Palette } from '@/constants/theme';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { formatCount } from '@/utils/formatCount';

type Props = {
  content: MathGameContent;
  lives: number;
  totalLives: number;
  /** Monstros derrotados */
  score: number;
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
const LIFE_SIZE = 20;
const SCORE_SIZE = 5.6;
const SCORE_LETTER_SPACING = 0.4;

/**
 * Painel no topo da partida: "Sair", vidas e monstros derrotados e, logo abaixo, as respostas lado
 * a lado. Fica por cima do cenário e respeita a barra de status do aparelho.
 */
export function MathGameHud({
  content,
  lives,
  totalLives,
  score,
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
      <View style={styles.status}>
        <IconTextButton
          label={content.exitLabel}
          icon={content.exitIcon}
          onPress={onExit}
          variant="compact"
          tone="light"
        />
        <LivesIndicator
          lives={lives}
          total={totalLives}
          size={scale(LIFE_SIZE)}
          lifeIcon={content.lifeIcon}
          lifeLostIcon={content.lifeLostIcon}
          accessibilityLabel={content.livesLabel(lives, totalLives)}
        />
        <View accessible accessibilityLabel={content.scoreAccessibilityLabel(score)}>
          <PixelText
            size={scale(SCORE_SIZE)}
            letterSpacing={scale(SCORE_LETTER_SPACING)}
            color={Palette.white}>
            {formatCount(score, content.scoreLabels)}
          </PixelText>
        </View>
      </View>
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
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answers: {
    flexDirection: 'row',
  },
});
