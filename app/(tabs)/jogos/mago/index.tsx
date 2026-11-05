import { useRouter } from 'expo-router';
import { useState } from 'react';

import { GameSetupTemplate } from '@/components/templates/GameSetupTemplate';
import {
  DEFAULT_GAME_DIFFICULTY,
  GameDifficulty,
  WORD_SEARCH_CONTENT,
  WORD_SEARCH_DIFFICULTY_OPTIONS,
} from '@/constants/games';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

/** Preparação do Caça-Palavras: como jogar e a escolha do nível (RN-303) */
export default function WordSearchSetupScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<GameDifficulty>(DEFAULT_GAME_DIFFICULTY);

  const handleBack = () => {
    // Volta para a lista de jogos; aberta sem histórico (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/jogos');
    }
  };

  return (
    <GameSetupTemplate
      content={WORD_SEARCH_CONTENT}
      difficultyOptions={WORD_SEARCH_DIFFICULTY_OPTIONS}
      difficulty={difficulty}
      onSelectDifficulty={setDifficulty}
      // push: a preparação fica por baixo, com o nível escolhido, e sair da partida volta para ela
      onPlay={() =>
        router.push({ pathname: '/(tabs)/jogos/mago/jogar', params: { dificuldade: difficulty } })
      }
      onBack={handleBack}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
