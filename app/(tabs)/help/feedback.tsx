import { HelpTopicTemplate } from '@/components/templates/HelpTopicTemplate';
import { BACK_LABEL, FEEDBACK_TOPIC, SUPPORT_CONTENT } from '@/constants/helpContent';

export default function FeedbackScreen() {
  return (
    <HelpTopicTemplate
      topic={FEEDBACK_TOPIC}
      support={SUPPORT_CONTENT}
      backLabel={BACK_LABEL}
    />
  );
}
