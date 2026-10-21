import { RecentAccessGrid } from '@/components/molecules/RecentAccessGrid';
import { HomeBanner } from '@/components/organisms/HomeBanner';
import { HomeLayout } from '@/components/organisms/HomeLayout';
import { HomeMenu } from '@/components/organisms/HomeMenu';
import { TopBar } from '@/components/organisms/TopBar';

// TODO: integrar com o back (moedas e nome do usuário logado). Valores temporários.
const TEMP_COINS = 10000;
const TEMP_USER_NAME = 'Sr. Cavaleiro';

export default function HomeScreen() {
  return (
    <HomeLayout
      topBar={
        <TopBar
          activeTab="home"
          onTabPress={() => {
            // TODO: navegar com o Expo Router (Rank e Help ainda não têm telas).
          }}
          coins={TEMP_COINS}
          userName={TEMP_USER_NAME}
        />
      }
      banner={<HomeBanner />}
      // TODO: integrar com o back (itens acessados recentemente). Por enquanto, slots vazios.
      sidebar={<RecentAccessGrid items={[]} />}>
      <HomeMenu
        onSelect={() => {
          // TODO: navegar para a tela correspondente (Questões, Jogos, Decks ou Relatórios)
          // quando ela existir.
        }}
      />
    </HomeLayout>
  );
}
