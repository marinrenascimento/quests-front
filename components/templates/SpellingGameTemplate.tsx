import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { SpellingGameBoard } from '@/components/organisms/SpellingGameBoard';
import { GOBLIN_GAME_SCENE, SPELLING_GAME_CONFIG, SpellingGameContent } from '@/constants/games';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { useSpellingGame } from '@/hooks/useSpellingGame';

type Props = {
  scene: typeof GOBLIN_GAME_SCENE;
  content: SpellingGameContent;
  /** Estado e ações da partida (useSpellingGame) */
  game: ReturnType<typeof useSpellingGame>;
  onExit: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup)
const GOBLIN_WIDTH = 146;
const GOBLIN_LEFT = 8;
const GOBLIN_BOTTOM = 10;

/**
 * Template da partida do Goblin Ortográfico: tela cheia, sem TopBar, com o cenário atrás, o goblin
 * no canto inferior esquerdo e o painel por cima. A barra de status fica clara porque o fundo é
 * escuro.
 */
export function SpellingGameTemplate({ scene, content, game, onExit }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image source={scene.background} resizeMode="cover" style={styles.background} />
      <TrimmedImage
        source={scene.goblin.source}
        imageSize={scene.goblin.imageSize}
        content={scene.goblin.content}
        style={[
          styles.goblin,
          {
            width: scale(GOBLIN_WIDTH),
            left: scale(GOBLIN_LEFT),
            bottom: insets.bottom + scale(GOBLIN_BOTTOM),
          },
        ]}
      />
      <SpellingGameBoard
        content={content}
        lives={game.lives}
        totalLives={SPELLING_GAME_CONFIG.lives}
        score={game.score}
        shownWord={game.round.shown}
        options={game.round.options}
        wrongOptions={game.wrongOptions}
        correctOption={game.phase === 'correct' ? game.round.correct : undefined}
        optionsEnabled={game.phase === 'choosing'}
        onSelectOption={game.selectOption}
        onExit={onExit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo tom escuro do cenário, para não piscar claro enquanto a imagem carrega
  screen: {
    flex: 1,
    backgroundColor: Palette.forest,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  goblin: {
    position: 'absolute',
  },
});
