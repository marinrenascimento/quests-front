import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { GamesTemplate } from '@/components/templates/GamesTemplate';
import { GameInfo, GAMES, GAMES_CONTENT } from '@/constants/games';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

/** Jogos, aberta pelo botão "Jogos" do menu da Home */
export default function GamesScreen() {
  const router = useRouter();
  const [toastVisible, setToastVisible] = useState(false);
  const hideToast = useCallback(() => setToastVisible(false), []);

  const handleGamePress = (game: GameInfo) => {
    if (game.id === 'elfo-matematico') {
      // push: a lista fica por baixo e o voltar da preparação retorna a ela
      router.push('/(tabs)/jogos/elfo');
    } else {
      // Os outros jogos ainda não foram feitos (RN-273): só avisa
      setToastVisible(true);
    }
  };

  return (
    <GamesTemplate
      title={GAMES_CONTENT.title}
      games={GAMES}
      comingSoonLabel={GAMES_CONTENT.comingSoonLabel}
      onGamePress={handleGamePress}
      toast={{ message: GAMES_CONTENT.comingSoonToast, visible: toastVisible, onHide: hideToast }}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
