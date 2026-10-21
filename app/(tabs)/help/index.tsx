import { useRouter } from 'expo-router';

import { SupportBlock } from '@/components/molecules/SupportBlock';
import { FaqCard } from '@/components/organisms/FaqCard';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HelpMenuGrid } from '@/components/organisms/HelpMenuGrid';
import { TopBar } from '@/components/organisms/TopBar';
import {
  HELP_FAQ,
  HELP_FAQ_TITLE,
  HELP_MENU,
  HelpMenuKey,
  SUPPORT_CONTENT,
} from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

export default function HelpScreen() {
  const router = useRouter();
  const handleTabPress = useTopBarNavigation();

  const handleMenuSelect = (key: HelpMenuKey) => {
    switch (key) {
      case 'estudos':
        router.push('/(tabs)/help/estudos');
        break;
      case 'conta':
        router.push('/(tabs)/help/conta');
        break;
      case 'privacidade':
        router.push('/(tabs)/help/privacidade');
        break;
      case 'feedback':
        router.push('/(tabs)/help/feedback');
        break;
    }
  };

  return (
    <HelpLayout
      topBar={
        <TopBar
          activeTab="help"
          onTabPress={handleTabPress}
          coins={TEMP_COINS}
          userName={TEMP_USER_NAME}
        />
      }
      footer={
        <SupportBlock
          prompt={SUPPORT_CONTENT.prompt}
          buttonLabel={SUPPORT_CONTENT.buttonLabel}
          buttonIcon={SUPPORT_CONTENT.buttonIcon}
          onPress={() => {
            // TODO: definir canal de suporte.
          }}
        />
      }>
      <HelpMenuGrid items={HELP_MENU} onSelect={handleMenuSelect} />
      <FaqCard title={HELP_FAQ_TITLE} items={HELP_FAQ} />
    </HelpLayout>
  );
}
