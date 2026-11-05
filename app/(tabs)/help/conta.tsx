import { HelpTopicTemplate } from '@/components/templates/HelpTopicTemplate';
import { ACCOUNT_TOPIC, BACK_LABEL, SUPPORT_CONTENT } from '@/constants/helpContent';

export default function ContaScreen() {
  return (
    <HelpTopicTemplate
      topic={ACCOUNT_TOPIC}
      support={SUPPORT_CONTENT}
      backLabel={BACK_LABEL}
    />
  );
}
