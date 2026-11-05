import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { MathGameTemplate } from '@/components/templates/MathGameTemplate';
import {
  DEFAULT_MATH_DIFFICULTY,
  ELF_GAME_SCENE,
  EXIT_GAME_CONFIRM_CONTENT,
  GAME_OVER_CONTENT,
  isMathDifficulty,
  MATH_GAME_CONTENT,
} from '@/constants/games';
import { useAppActive } from '@/hooks/useAppActive';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useMathGame } from '@/hooks/useMathGame';
import { formatCount } from '@/utils/formatCount';

/** Partida do Elfo Matemático, aberta pelo "Jogar" da preparação (regras: RN-275 a RN-286) */
export default function MathGameScreen() {
  const router = useRouter();
  const { dificuldade } = useLocalSearchParams<{ dificuldade?: string }>();
  // Aberta sem nível válido (ex.: link direto): joga no nível padrão
  const difficulty = isMathDifficulty(dificuldade) ? dificuldade : DEFAULT_MATH_DIFFICULTY;
  const game = useMathGame(difficulty);
  const appActive = useAppActive();
  const [exitVisible, setExitVisible] = useState(false);
  // Saindo da tela: esconde o modal do fim de jogo antes de navegar
  const [closing, setClosing] = useState(false);
  const openExit = useCallback(() => setExitVisible(true), []);
  const over = game.phase === 'over';

  // Voltar do Android e gesto: com monstro derrotado ou vida perdida, perguntam antes de sair
  useLeaveConfirm({ enabled: game.hasProgress, onRequestLeave: openExit });

  const leave = () => {
    // Volta para a preparação (que fica por baixo, com o nível escolhido); aberta sem histórico
    // (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/jogos/elfo');
    }
  };

  return (
    <>
      <MathGameTemplate
        scene={ELF_GAME_SCENE}
        content={MATH_GAME_CONTENT}
        game={game}
        // O monstro não avança enquanto o jogador decide sair nem com o app em segundo plano
        paused={exitVisible || !appActive}
        // Sem nada a perder, não há o que confirmar: sai direto
        onExit={game.hasProgress ? openExit : leave}
      />
      <ConfirmModal
        visible={exitVisible && !over}
        title={EXIT_GAME_CONFIRM_CONTENT.title}
        confirmLabel={EXIT_GAME_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={EXIT_GAME_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
        onConfirm={() => {
          setExitVisible(false);
          leave();
        }}
        // Só fecha: a partida continua de onde parou
        onCancel={() => setExitVisible(false)}
      />
      <ConfirmModal
        visible={over && !closing}
        title={GAME_OVER_CONTENT.title}
        highlight={formatCount(game.score, GAME_OVER_CONTENT.highlightLabels)}
        confirmLabel={GAME_OVER_CONTENT.playAgainLabel}
        cancelLabel={GAME_OVER_CONTENT.exitLabel}
        onConfirm={() => {
          setExitVisible(false);
          game.restart();
        }}
        // Também é o voltar do Android com o modal aberto
        onCancel={() => {
          setClosing(true);
          leave();
        }}
      />
    </>
  );
}
