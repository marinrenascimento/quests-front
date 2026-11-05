import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BodyText } from '@/components/atoms/BodyText';
import { GameWordText } from '@/components/atoms/GameWordText';
import { GameAnswerButton } from '@/components/molecules/GameAnswerButton';
import { GameStatusBar } from '@/components/molecules/GameStatusBar';
import type { SpellingGameContent } from '@/constants/games';
import { Palette } from '@/constants/theme';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { formatCount } from '@/utils/formatCount';

type Props = {
  content: SpellingGameContent;
  lives: number;
  totalLives: number;
  /** Palavras corrigidas */
  score: number;
  /** A versão errada, no meio da tela */
  shownWord: string;
  /** As 3 opções, acima dela */
  options: string[];
  /** Opções erradas já tocadas */
  wrongOptions: string[];
  /** A opção correta, quando já foi tocada (fica verde) */
  correctOption?: string;
  /** false: nenhuma opção recebe toque (ex.: indo para a próxima palavra) */
  optionsEnabled: boolean;
  onSelectOption: (value: string) => void;
  onExit: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup)
const TOP_GAP = 8;
const SECTION_GAP = 10;
const OPTION_GAP = 7;
const WORD_SIZE = 25;
const WORD_RADIUS = 10;
const WORD_PADDING_HORIZONTAL = 14;
const WORD_PADDING_VERTICAL = 10;
const PROMPT_GAP = 3;

/**
 * Painel da partida do Goblin Ortográfico: no topo, "Sair", vidas, contagem e as 3 opções, uma
 * embaixo da outra (as palavras são longas para ficarem lado a lado); no meio da tela, a palavra
 * errada. Fica por cima do cenário e respeita a barra de status do aparelho.
 */
export function SpellingGameBoard({
  content,
  lives,
  totalLives,
  score,
  shownWord,
  options,
  wrongOptions,
  correctOption,
  optionsEnabled,
  onSelectOption,
  onExit,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const insets = useSafeAreaInsets();
  const width = { width: layoutWidth, paddingHorizontal };

  return (
    <View pointerEvents="box-none" style={styles.board}>
      {/* A palavra vem antes: fica por baixo das opções se a tela for muito baixa */}
      <View pointerEvents="none" style={[styles.center, width]}>
        <View
          accessible
          accessibilityLiveRegion="polite"
          accessibilityLabel={content.shownLabel(shownWord)}
          style={[
            styles.wordBox,
            {
              borderRadius: scale(WORD_RADIUS),
              paddingHorizontal: scale(WORD_PADDING_HORIZONTAL),
              paddingVertical: scale(WORD_PADDING_VERTICAL),
            },
          ]}>
          <BodyText align="center" style={[styles.prompt, { marginBottom: scale(PROMPT_GAP) }]}>
            {content.prompt}
          </BodyText>
          <GameWordText size={scale(WORD_SIZE)}>{shownWord}</GameWordText>
        </View>
      </View>
      <View style={[width, { paddingTop: insets.top + scale(TOP_GAP) }]}>
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
          scoreText={formatCount(score, content.scoreLabels)}
          scoreAccessibilityLabel={content.scoreAccessibilityLabel(score)}
        />
        <View style={{ gap: scale(OPTION_GAP), marginTop: scale(SECTION_GAP) }}>
          {/* Sempre 3 opções: um .map simples basta */}
          {options.map((word) => (
            // A linha dá a largura: o botão ocupa ela inteira (flex 1)
            <View key={word} style={styles.optionRow}>
              <GameAnswerButton
                label={word}
                accessibilityLabel={content.optionLabel(word)}
                wrong={wrongOptions.includes(word)}
                correct={word === correctOption}
                disabled={!optionsEnabled}
                textVariant="word"
                onPress={() => onSelectOption(word)}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordBox: {
    maxWidth: '100%',
    backgroundColor: Palette.gameEquationBackground,
  },
  prompt: {
    color: Palette.white,
  },
  optionRow: {
    flexDirection: 'row',
  },
});
