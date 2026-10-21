import { HelpTopicTemplate } from '@/components/templates/HelpTopicTemplate';
import { ACCOUNT_TOPIC, BACK_LABEL, SUPPORT_CONTENT } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

export default function ContaScreen() {
  return (
    <HelpTopicTemplate
      topic={ACCOUNT_TOPIC}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
      support={SUPPORT_CONTENT}
      backLabel={BACK_LABEL}
    />
  );
}
