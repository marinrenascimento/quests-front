import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import { MathGameHud } from '@/components/organisms/MathGameHud';
import { MathGameStage } from '@/components/organisms/MathGameStage';
import { GameScene, MATH_GAME_CONFIG, MathGameContent } from '@/constants/games';
import type { useMathGame } from '@/hooks/useMathGame';
import { Palette } from '@/constants/theme';

type Props = {
  scene: GameScene;
  content: MathGameContent;
  /** Estado e ações da partida (useMathGame) */
  game: ReturnType<typeof useMathGame>;
  /** Jogo pausado (modal de sair aberto ou app em segundo plano): o monstro para onde está */
  paused: boolean;
  onExit: () => void;
};

/**
 * Template da partida do Elfo Matemático: tela cheia, sem TopBar (para o cenário ocupar tudo e as
 * respostas ficarem no topo), com o cenário atrás e o painel por cima. A barra de status fica clara
 * porque o fundo é escuro.
 */
export function MathGameTemplate({ scene, content, game, paused, onExit }: Props) {
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <MathGameStage
        scene={scene}
        content={content}
        equationText={game.equation.text}
        monsterId={game.monsterId}
        phase={game.phase}
        paused={paused}
        crossingMs={MATH_GAME_CONFIG.crossingMs}
        fadeMs={MATH_GAME_CONFIG.fadeMs}
        onMonsterReached={game.monsterReached}
        onMonsterGone={game.monsterGone}
      />
      <MathGameHud
        content={content}
        lives={game.lives}
        totalLives={MATH_GAME_CONFIG.lives}
        score={game.score}
        options={game.equation.options}
        wrongOptions={game.wrongOptions}
        answersEnabled={game.phase === 'walking'}
        onAnswer={game.selectAnswer}
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
});
