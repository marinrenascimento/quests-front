import { useRouter } from 'expo-router';
import { useState } from 'react';

import { MathGameSetupTemplate } from '@/components/templates/MathGameSetupTemplate';
import { DEFAULT_MATH_DIFFICULTY, MATH_GAME_CONTENT, MathDifficulty } from '@/constants/games';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

/** Preparação do Elfo Matemático: como jogar e a escolha do nível (RN-274) */
export default function MathGameSetupScreen() {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<MathDifficulty>(DEFAULT_MATH_DIFFICULTY);

  const handleBack = () => {
    // Volta para a lista de jogos; aberta sem histórico (ex.: link direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/jogos');
    }
  };

  return (
    <MathGameSetupTemplate
      content={MATH_GAME_CONTENT}
      difficulty={difficulty}
      onSelectDifficulty={setDifficulty}
      // push: a preparação fica por baixo, com o nível escolhido, e sair da partida volta para ela
      onPlay={() =>
        router.push({ pathname: '/(tabs)/jogos/elfo/jogar', params: { dificuldade: difficulty } })
      }
      onBack={handleBack}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
