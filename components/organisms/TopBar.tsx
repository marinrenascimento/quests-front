import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { CoinsUserPill } from '@/components/molecules/CoinsUserPill';
import { TopBarTabKey, TopBarTabs } from '@/components/molecules/TopBarTabs';
import { Palette } from '@/constants/theme';

type Props = {
  /** Aba em destaque (branca). Sem valor, nenhuma fica em destaque (ex.: Relatórios). */
  activeTab?: TopBarTabKey;
  // TODO: navegar com o Expo Router. Quem usar o TopBar decide a rota em onTabPress
  // (Rank e Help ainda não têm telas).
  onTabPress: (tab: TopBarTabKey) => void;
  coins: number;
  userName: string;
  onUserPress?: () => void;
};

// Área visível de knightOfQuestions.png (1024 x 1024, com margem transparente)
const LOGO_IMAGE_SIZE = { width: 1024, height: 1024 };
const LOGO_CONTENT = { x: 117, y: 325, width: 795, height: 271 };

export function TopBar({ activeTab, onTabPress, coins, userName, onUserPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    // O fundo se estende por baixo da barra de status; o conteúdo começa abaixo da área segura
    <View style={[styles.container, { paddingTop: insets.top + 2 }]}>
      <TrimmedImage
        source={require('@/assets/images/outros/knightOfQuestions.png')}
        imageSize={LOGO_IMAGE_SIZE}
        content={LOGO_CONTENT}
        style={styles.logo}
        accessibilityLabel="Knight of Questions"
      />
      <View style={styles.tabs}>
        <TopBarTabs activeTab={activeTab} onTabPress={onTabPress} />
      </View>
      <View style={styles.pill}>
        <CoinsUserPill coins={coins} userName={userName} onPress={onUserPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 3.5,
    paddingRight: 4,
    paddingBottom: 9,
    backgroundColor: Palette.sage,
  },
  // Único item que encolhe: em telas estreitas (360dp) o logo diminui e o resto mantém o tamanho
  logo: {
    width: 130,
    flexShrink: 1,
  },
  // marginBottom sobe o centro das abas (2dp) e da pílula (~4dp) em relação ao logo, como no mockup
  tabs: {
    marginHorizontal: 3.5,
    marginBottom: 4,
  },
  pill: {
    marginBottom: 7.5,
  },
});
