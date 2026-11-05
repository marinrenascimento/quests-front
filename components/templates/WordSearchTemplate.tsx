import { StatusBar } from 'expo-status-bar';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { Toast } from '@/components/molecules/Toast';
import { WordSearchBoard } from '@/components/organisms/WordSearchBoard';
import { MAGE_GAME_SCENE, WordSearchContent } from '@/constants/games';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { useWordSearchGame } from '@/hooks/useWordSearchGame';

type Props = {
  scene: typeof MAGE_GAME_SCENE;
  content: WordSearchContent;
  /** Estado e ações da partida (useWordSearchGame) */
  game: ReturnType<typeof useWordSearchGame>;
  onExit: () => void;
};

// Medidas em px do mockup da Help (o jogo não tem mockup)
const MAGE_WIDTH = 104;
const MAGE_LEFT = 8;
const MAGE_BOTTOM = 8;

/** O aviso some sozinho, e o tempo do próximo caça-palavras é contado no useWordSearchGame */
const noop = () => {};

/**
 * Template da partida do Mago da Ciência: tela cheia, sem TopBar, com o cenário atrás, o mago no canto
 * inferior esquerdo e o painel por cima. Em telas baixas, a grade passa por cima do mago. A barra de
 * status fica clara porque o fundo é escuro.
 */
export function WordSearchTemplate({ scene, content, game, onExit }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image source={scene.background} resizeMode="cover" style={styles.background} />
      <TrimmedImage
        source={scene.mage.source}
        imageSize={scene.mage.imageSize}
        content={scene.mage.content}
        style={[
          styles.mage,
          {
            width: scale(MAGE_WIDTH),
            left: scale(MAGE_LEFT),
            bottom: insets.bottom + scale(MAGE_BOTTOM),
          },
        ]}
      />
      <WordSearchBoard content={content} game={game} onExit={onExit} />
      <View pointerEvents="none" style={styles.toast}>
        <Toast
          message={content.completedToast}
          visible={game.phase === 'completed'}
          onHide={noop}
        />
      </View>
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
  mage: {
    position: 'absolute',
  },
  // No meio da tela, por cima da grade
  toast: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
