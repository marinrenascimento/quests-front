import { StyleSheet, View } from 'react-native';

import { GameCard } from '@/components/molecules/GameCard';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { Toast } from '@/components/molecules/Toast';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import type { GameInfo } from '@/constants/games';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  title: string;
  games: GameInfo[];
  /** Aviso no cartão dos jogos que ainda não foram feitos */
  comingSoonLabel: string;
  onGamePress: (game: GameInfo) => void;
  /** Toast no topo do conteúdo (toque num jogo que ainda não foi feito) */
  toast: { message: string; visible: boolean; onHide: () => void };
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/** Vão entre os cartões, em px do mockup da Help */
const CARD_GAP = 10;

/**
 * Template da tela Jogos: TopBar sem aba em destaque, cabeçalho (voltar + título) e um cartão por
 * jogo. O voltar leva à Home (mesma navegação da aba Home do TopBar).
 */
export function GamesTemplate({
  title,
  games,
  comingSoonLabel,
  onGamePress,
  toast,
  backLabel,
  coins,
  userName,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}
      overlay={<Toast message={toast.message} visible={toast.visible} onHide={toast.onHide} />}>
      <ReportHeader title={title} onBack={() => handleTabPress('home')} backLabel={backLabel} />
      <View style={[styles.list, { gap: scale(CARD_GAP) }]}>
        {/* Sempre 3 jogos, dentro do ScrollView da tela: um .map simples basta */}
        {games.map((game) => (
          <GameCard
            key={game.id}
            name={game.name}
            description={game.description}
            image={game.image}
            badge={game.available ? undefined : comingSoonLabel}
            onPress={() => onGamePress(game)}
          />
        ))}
      </View>
    </HelpLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    alignSelf: 'stretch',
  },
});
