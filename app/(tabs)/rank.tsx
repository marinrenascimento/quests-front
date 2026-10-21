import { Podium } from '@/components/organisms/Podium';
import { RankingList } from '@/components/organisms/RankingList';
import { RankLayout } from '@/components/organisms/RankLayout';
import { TopBar } from '@/components/organisms/TopBar';
import { UserRankCard } from '@/components/organisms/UserRankCard';
import {
  MOCK_CURRENT_USER_AVATAR,
  MOCK_CURRENT_USER_RANK,
  MOCK_RANKING,
} from '@/constants/mockRanking';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

export default function RankScreen() {
  const handleTabPress = useTopBarNavigation();

  return (
    <RankLayout
      topBar={
        <TopBar
          activeTab="rank"
          onTabPress={handleTabPress}
          coins={TEMP_COINS}
          userName={TEMP_USER_NAME}
        />
      }
      // TODO: substituir pelos dados do back. Pódio e lista vêm da mesma lista fictícia.
      renderPodium={(unit) => <Podium entries={MOCK_RANKING} unit={unit} />}
      renderList={(unit) => <RankingList entries={MOCK_RANKING} unit={unit} />}
      renderUserCard={(unit) => (
        <UserRankCard entry={MOCK_CURRENT_USER_RANK} avatar={MOCK_CURRENT_USER_AVATAR} unit={unit} />
      )}
    />
  );
}
