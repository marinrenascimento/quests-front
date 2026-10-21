import { HelpTopicTemplate } from '@/components/templates/HelpTopicTemplate';
import { BACK_LABEL, FEEDBACK_TOPIC, SUPPORT_CONTENT } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

export default function FeedbackScreen() {
  return (
    <HelpTopicTemplate
      topic={FEEDBACK_TOPIC}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
      support={SUPPORT_CONTENT}
      backLabel={BACK_LABEL}
    />
  );
}
