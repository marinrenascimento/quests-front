import { Podium } from '@/components/organisms/Podium';
import { RankingList } from '@/components/organisms/RankingList';
import { RankLayout } from '@/components/organisms/RankLayout';
import { TopBar } from '@/components/organisms/TopBar';
import { UserRankCard } from '@/components/organisms/UserRankCard';
import { MOCK_CURRENT_USER_POSITION, MOCK_RANKING } from '@/constants/mockRanking';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';
import { useUser } from '@/hooks/useUser';

export default function RankScreen() {
  const handleTabPress = useTopBarNavigation();
  const user = useUser();

  return (
    <RankLayout
      topBar={<TopBar activeTab="rank" onTabPress={handleTabPress} />}
      // TODO: substituir pelos dados do back. Pódio e lista vêm da mesma lista fictícia.
      renderPodium={(unit) => <Podium entries={MOCK_RANKING} unit={unit} />}
      renderList={(unit) => <RankingList entries={MOCK_RANKING} unit={unit} />}
      renderUserCard={(unit) => (
        <UserRankCard
          entry={{
            id: 'me',
            position: MOCK_CURRENT_USER_POSITION,
            name: user.name,
            points: user.coins,
          }}
          avatar={user.avatar.image}
          unit={unit}
        />
      )}
    />
  );
}
