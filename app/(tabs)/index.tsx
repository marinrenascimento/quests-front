import { useRouter } from 'expo-router';

import { RecentAccessGrid } from '@/components/molecules/RecentAccessGrid';
import { HomeBanner } from '@/components/organisms/HomeBanner';
import { HomeLayout } from '@/components/organisms/HomeLayout';
import { HomeMenu, HomeMenuKey } from '@/components/organisms/HomeMenu';
import { TopBar } from '@/components/organisms/TopBar';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

export default function HomeScreen() {
  const router = useRouter();
  const handleTabPress = useTopBarNavigation();

  const handleMenuSelect = (key: HomeMenuKey) => {
    switch (key) {
      case 'relatorios':
        router.navigate('/(tabs)/relatorios');
        break;
      case 'decks':
        router.navigate('/(tabs)/decks');
        break;
      case 'questoes':
        router.navigate('/(tabs)/provas');
        break;
      case 'jogos':
        // TODO: navegar para a tela de Jogos quando ela existir.
        break;
    }
  };

  return (
    <HomeLayout
      topBar={
        <TopBar
          activeTab="home"
          onTabPress={handleTabPress}
          coins={TEMP_COINS}
          userName={TEMP_USER_NAME}
        />
      }
      banner={<HomeBanner />}
      // TODO: integrar com o back (os 2 últimos decks ou provas estudados, com o nome, e o toque
      // abrindo o item). Por enquanto, os 2 quadrados ficam vazios.
      sidebar={<RecentAccessGrid items={[]} />}>
      <HomeMenu onSelect={handleMenuSelect} />
    </HomeLayout>
  );
}
