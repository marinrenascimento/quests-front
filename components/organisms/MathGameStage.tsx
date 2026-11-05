import { useState } from 'react';
import { Animated, Image, LayoutChangeEvent, StyleSheet, View } from 'react-native';

import { PixelText } from '@/components/atoms/PixelText';
import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import type { GameScene, MathGameContent } from '@/constants/games';
import { Palette } from '@/constants/theme';
import type { MathGamePhase } from '@/hooks/useMathGame';
import { useMonsterWalk } from '@/hooks/useMonsterWalk';

type Props = {
  scene: GameScene;
  content: Pick<MathGameContent, 'equationLabel'>;
  /** Equação em cima do monstro */
  equationText: string;
  monsterId: number;
  phase: MathGamePhase;
  /** Jogo pausado: o monstro para onde está */
  paused: boolean;
  /** Tempo da caminhada e do aparecer/sumir do monstro, em ms */
  crossingMs: number;
  fadeMs: number;
  onMonsterReached: () => void;
  onMonsterGone: () => void;
};

type Size = { width: number; height: number };

// Tamanhos em relação à referência `unit` (a largura da tela, limitada pela altura em telas largas)
const ELF_WIDTH = 0.26;
const MONSTER_WIDTH = 0.42;
const EQUATION_SIZE = 0.0275;
const EQUATION_PADDING_HORIZONTAL = 0.02;
const EQUATION_PADDING_VERTICAL = 0.018;
const EQUATION_RADIUS = 0.016;
const EQUATION_GAP = 0.015;
/** Em telas largas, os personagens não crescem além de metade da altura */
const MAX_UNIT_BY_HEIGHT = 0.5;
/** Do elfo até a borda esquerda, em relação à largura da tela */
const ELF_LEFT = 0.03;
/** Fração do monstro que começa dentro da tela (ele entra pela direita, com a cabeça visível) */
const MONSTER_START_VISIBLE = 0.75;
/** O monstro "alcança" quando as garras chegam nesta fração da largura do elfo (ponta da flecha) */
const REACH_POINT = 0.9;
/**
 * A equação ocupa pelo menos esta fração da largura do monstro e termina onde a parte visível
 * termina. As contas longas do Médio crescem para a esquerda, para caber numa linha.
 */
const EQUATION_WIDTH = 0.95;
/** Largura máxima da equação: no fim da caminhada, ela não sai da tela pela esquerda */
const EQUATION_MAX_WIDTH = 0.56;

/** Distância do chão até a base da tela, com o fundo cortado como no resizeMode "cover" */
function groundBottom(size: Size, scene: GameScene): number {
  const { width, height } = scene.backgroundSize;
  const factor = Math.max(size.width / width, size.height / height);
  const shownHeight = height * factor;
  const top = (size.height - shownHeight) / 2;
  return size.height - (top + shownHeight * scene.groundRatio);
}

/**
 * Cenário de um jogo: o fundo preenche a tela; o elfo fica parado à esquerda, com o arco para a
 * direita; e o monstro caminha da direita até ele, com a equação em cima da cabeça. Não recebe
 * toques (as respostas ficam no MathGameHud, por cima dele). As medidas saem do tamanho real da
 * tela, então os personagens só aparecem depois da primeira medição.
 */
export function MathGameStage({
  scene,
  content,
  equationText,
  monsterId,
  phase,
  paused,
  crossingMs,
  fadeMs,
  onMonsterReached,
  onMonsterGone,
}: Props) {
  const [size, setSize] = useState<Size | null>(null);
  const { progress, opacity } = useMonsterWalk({
    monsterId,
    // Sem a medição, o caminho ainda não existe: a caminhada só começa depois dela
    moving: phase === 'walking' && !paused && size !== null,
    leaving: phase === 'leaving',
    crossingMs,
    fadeMs,
    onReached: onMonsterReached,
    onGone: onMonsterGone,
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  };

  const renderCharacters = ({ width, height }: Size) => {
    const unit = Math.min(width, height * MAX_UNIT_BY_HEIGHT);
    const bottom = groundBottom({ width, height }, scene);
    const elfLeft = width * ELF_LEFT;
    const elfWidth = unit * ELF_WIDTH;
    const monsterWidth = unit * MONSTER_WIDTH;
    const monsterHeight = monsterWidth * (scene.monster.content.height / scene.monster.content.width);
    // A fonte pixel é monoespaçada: cada caractere ocupa a largura do tamanho da fonte. As contas
    // mais longas diminuem a fonte para não passar da largura máxima
    const equationSize = Math.min(
      EQUATION_SIZE,
      (EQUATION_MAX_WIDTH - EQUATION_PADDING_HORIZONTAL * 2) / equationText.length,
    );
    const equationWidth = Math.max(
      monsterWidth * EQUATION_WIDTH,
      unit * (equationSize * equationText.length + EQUATION_PADDING_HORIZONTAL * 2),
    );

    return (
      <>
        <TrimmedImage
          source={scene.elf.source}
          imageSize={scene.elf.imageSize}
          content={scene.elf.content}
          style={[styles.character, { left: elfLeft, bottom, width: elfWidth }]}
        />
        {phase === 'over' ? null : (
          <Animated.View
            style={[
              styles.character,
              {
                left: 0,
                bottom,
                width: monsterWidth,
                opacity,
                transform: [
                  {
                    translateX: progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        width - monsterWidth * MONSTER_START_VISIBLE,
                        elfLeft + elfWidth * REACH_POINT,
                      ],
                    }),
                  },
                ],
              },
            ]}>
            <View
              style={[
                styles.equation,
                {
                  bottom: monsterHeight + unit * EQUATION_GAP,
                  // Termina na parte visível do monstro: nunca sai da tela, nem no começo
                  left: monsterWidth * MONSTER_START_VISIBLE - equationWidth,
                  width: equationWidth,
                },
              ]}>
              <View
                style={[
                  styles.equationBox,
                  {
                    paddingHorizontal: unit * EQUATION_PADDING_HORIZONTAL,
                    paddingVertical: unit * EQUATION_PADDING_VERTICAL,
                    borderRadius: unit * EQUATION_RADIUS,
                  },
                ]}>
                <PixelText
                  size={unit * equationSize}
                  color={Palette.white}
                  adjustsFontSizeToFit
                  style={styles.equationText}>
                  {equationText}
                </PixelText>
              </View>
            </View>
            <TrimmedImage
              source={scene.monster.source}
              imageSize={scene.monster.imageSize}
              content={scene.monster.content}
              style={styles.monster}
            />
          </Animated.View>
        )}
      </>
    );
  };

  return (
    <View onLayout={handleLayout} pointerEvents="none" style={styles.stage}>
      <Image source={scene.background} resizeMode="cover" style={styles.background} />
      {/* A equação é a informação principal: o leitor de tela anuncia cada monstro novo */}
      <View
        accessible
        accessibilityLiveRegion="polite"
        accessibilityLabel={content.equationLabel(equationText)}
        style={styles.fill}>
        {size ? renderCharacters(size) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  fill: {
    flex: 1,
  },
  character: {
    position: 'absolute',
  },
  monster: {
    width: '100%',
  },
  equation: {
    position: 'absolute',
    alignItems: 'center',
  },
  equationBox: {
    maxWidth: '100%',
    backgroundColor: Palette.gameEquationBackground,
  },
  equationText: {
    textAlign: 'center',
  },
});
