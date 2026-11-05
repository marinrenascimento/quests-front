import { HelpTopicTemplate } from '@/components/templates/HelpTopicTemplate';
import { BACK_LABEL, PRIVACY_TOPIC, SUPPORT_CONTENT } from '@/constants/helpContent';

export default function PrivacidadeScreen() {
  return (
    <HelpTopicTemplate
      topic={PRIVACY_TOPIC}
      support={SUPPORT_CONTENT}
      backLabel={BACK_LABEL}
    />
  );
}
