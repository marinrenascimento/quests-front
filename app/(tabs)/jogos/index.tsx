import { useRouter } from 'expo-router';

import { GamesTemplate } from '@/components/templates/GamesTemplate';
import { GameInfo, GAMES, GAMES_CONTENT } from '@/constants/games';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

/** Jogos, aberta pelo botão "Jogos" do menu da Home */
export default function GamesScreen() {
  const router = useRouter();

  const handleGamePress = (game: GameInfo) => {
    // push: a lista fica por baixo e o voltar da preparação retorna a ela
    switch (game.id) {
      case 'elfo-matematico':
        router.push('/(tabs)/jogos/elfo');
        break;
      case 'goblin-ortografico':
        router.push('/(tabs)/jogos/goblin');
        break;
      case 'mago-caca-palavras':
        router.push('/(tabs)/jogos/mago');
        break;
    }
  };

  return (
    <GamesTemplate
      title={GAMES_CONTENT.title}
      games={GAMES}
      onGamePress={handleGamePress}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
