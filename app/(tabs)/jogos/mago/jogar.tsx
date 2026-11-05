import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { WordSearchTemplate } from '@/components/templates/WordSearchTemplate';
import {
  DEFAULT_GAME_DIFFICULTY,
  EXIT_GAME_CONFIRM_CONTENT,
  isGameDifficulty,
  MAGE_GAME_SCENE,
  WORD_SEARCH_CONTENT,
  WORD_SEARCH_LEVELS,
} from '@/constants/games';
import { MOCK_WORD_SEARCH_QUESTIONS } from '@/constants/mockWordSearchQuestions';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useWordSearchGame } from '@/hooks/useWordSearchGame';

/** Partida do Caça-Palavras, aberta pelo "Jogar" da preparação (regras: RN-303 a RN-308) */
export default function WordSearchScreen() {
  const router = useRouter();
  const { dificuldade } = useLocalSearchParams<{ dificuldade?: string }>();
  // Aberta sem nível válido (ex.: link direto): joga no nível padrão
  const difficulty = isGameDifficulty(dificuldade) ? dificuldade : DEFAULT_GAME_DIFFICULTY;
  const game = useWordSearchGame(
    MOCK_WORD_SEARCH_QUESTIONS[difficulty],
    WORD_SEARCH_LEVELS[difficulty],
  );
  const [exitVisible, setExitVisible] = useState(false);
  const openExit = useCallback(() => setExitVisible(true), []);

  // Voltar do Android e gesto: com resposta achada ou caça-palavras completo, perguntam antes de sair
  useLeaveConfirm({ enabled: game.hasProgress, onRequestLeave: openExit });

  const leave = () => {
    // Volta para a preparação (que fica por baixo, com o nível escolhido); aberta sem histórico
    // (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/jogos/mago');
    }
  };

  return (
    <>
      <WordSearchTemplate
        scene={MAGE_GAME_SCENE}
        content={WORD_SEARCH_CONTENT}
        game={game}
        // Sem nada a perder, não há o que confirmar: sai direto
        onExit={game.hasProgress ? openExit : leave}
      />
      <ConfirmModal
        visible={exitVisible}
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
    </>
  );
}
