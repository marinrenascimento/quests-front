import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameStatusBar } from '@/components/molecules/GameStatusBar';
import { WordSearchQuestionRow } from '@/components/molecules/WordSearchQuestionRow';
import { WordSearchGrid } from '@/components/organisms/WordSearchGrid';
import type { WordSearchContent } from '@/constants/games';
import { Palette } from '@/constants/theme';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { useWordSearchGame } from '@/hooks/useWordSearchGame';
import { formatCount } from '@/utils/formatCount';

type Props = {
  content: WordSearchContent;
  /** Estado e ações da partida (useWordSearchGame) */
  game: ReturnType<typeof useWordSearchGame>;
  onExit: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup)
const TOP_GAP = 8;
const SECTION_GAP = 8;
const QUESTION_GAP = 5;
const QUESTIONS_RADIUS = 8;
const QUESTIONS_PADDING_HORIZONTAL = 8;
const QUESTIONS_PADDING_VERTICAL = 7;

/**
 * Painel da partida do Caça-Palavras: no topo, "Sair" e a contagem (o jogo não tem vidas); depois as
 * 3 perguntas e a grade. Fica por cima do cenário e respeita a barra de status do aparelho. A grade
 * usa toda a largura útil, com casas de tamanho inteiro.
 */
export function WordSearchBoard({ content, game, onExit }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const insets = useSafeAreaInsets();
  const { puzzle } = game;
  const cellSize = Math.floor((layoutWidth - paddingHorizontal * 2) / puzzle.size);

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.board,
        { width: layoutWidth, paddingHorizontal, paddingTop: insets.top + scale(TOP_GAP) },
      ]}>
      <GameStatusBar
        exitLabel={content.exitLabel}
        exitIcon={content.exitIcon}
        onExit={onExit}
        scoreText={formatCount(game.completed, content.scoreLabels)}
        scoreAccessibilityLabel={content.scoreAccessibilityLabel(game.completed)}
      />
      <View
        style={[
          styles.questions,
          {
            marginTop: scale(SECTION_GAP),
            gap: scale(QUESTION_GAP),
            borderRadius: scale(QUESTIONS_RADIUS),
            paddingHorizontal: scale(QUESTIONS_PADDING_HORIZONTAL),
            paddingVertical: scale(QUESTIONS_PADDING_VERTICAL),
          },
        ]}>
        {/* Sempre 3 perguntas: um .map simples basta */}
        {puzzle.questions.map((item, index) => {
          const answer = game.foundLetters.includes(item.letters) ? item.answer : undefined;
          return (
            <WordSearchQuestionRow
              key={item.letters}
              position={index + 1}
              question={item.question}
              answer={answer}
              foundIcon={content.foundIcon}
              accessibilityLabel={content.questionLabel(index + 1, item.question, answer)}
            />
          );
        })}
      </View>
      <View style={{ marginTop: scale(SECTION_GAP) }}>
        <WordSearchGrid
          // Caça-palavras novo: a grade recomeça sem nada selecionado
          key={game.puzzleId}
          size={puzzle.size}
          letters={puzzle.letters}
          cellSize={cellSize}
          foundCells={game.foundCells}
          missCells={game.missCells}
          enabled={game.phase === 'searching'}
          accessibilityLabel={content.gridLabel(puzzle.size)}
          onSelect={game.selectCells}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    alignSelf: 'center',
  },
  questions: {
    backgroundColor: Palette.gameEquationBackground,
  },
});
