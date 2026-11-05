import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { SpellingGameTemplate } from '@/components/templates/SpellingGameTemplate';
import {
  DEFAULT_GAME_DIFFICULTY,
  EXIT_GAME_CONFIRM_CONTENT,
  GAME_OVER_CONTENT,
  GOBLIN_GAME_SCENE,
  isGameDifficulty,
  SPELLING_GAME_CONTENT,
} from '@/constants/games';
import { MOCK_SPELLING_WORDS } from '@/constants/mockSpellingWords';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useSpellingGame } from '@/hooks/useSpellingGame';
import { formatCount } from '@/utils/formatCount';

/** Partida do Goblin Ortográfico, aberta pelo "Jogar" da preparação (regras: RN-291 a RN-301) */
export default function SpellingGameScreen() {
  const router = useRouter();
  const { dificuldade } = useLocalSearchParams<{ dificuldade?: string }>();
  // Aberta sem nível válido (ex.: link direto): joga no nível padrão
  const difficulty = isGameDifficulty(dificuldade) ? dificuldade : DEFAULT_GAME_DIFFICULTY;
  const game = useSpellingGame(MOCK_SPELLING_WORDS[difficulty]);
  const [exitVisible, setExitVisible] = useState(false);
  // Saindo da tela: esconde o modal do fim de jogo antes de navegar
  const [closing, setClosing] = useState(false);
  const openExit = useCallback(() => setExitVisible(true), []);
  const over = game.phase === 'over';

  // Voltar do Android e gesto: com palavra corrigida ou vida perdida, perguntam antes de sair
  useLeaveConfirm({ enabled: game.hasProgress, onRequestLeave: openExit });

  const leave = () => {
    // Volta para a preparação (que fica por baixo, com o nível escolhido); aberta sem histórico
    // (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/jogos/goblin');
    }
  };

  return (
    <>
      <SpellingGameTemplate
        scene={GOBLIN_GAME_SCENE}
        content={SPELLING_GAME_CONTENT}
        game={game}
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
        // Só fecha: a partida continua como estava
        onCancel={() => setExitVisible(false)}
      />
      <ConfirmModal
        visible={over && !closing}
        title={GAME_OVER_CONTENT.title}
        highlight={formatCount(game.score, SPELLING_GAME_CONTENT.gameOverLabels)}
        description={formatCount(game.pointsEarned, SPELLING_GAME_CONTENT.pointsEarnedLabels)}
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
