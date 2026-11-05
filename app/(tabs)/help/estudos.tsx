import { HelpTopicTemplate } from '@/components/templates/HelpTopicTemplate';
import { BACK_LABEL, STUDY_TOPIC, SUPPORT_CONTENT } from '@/constants/helpContent';

export default function EstudosScreen() {
  return (
    <HelpTopicTemplate
      topic={STUDY_TOPIC}
      support={SUPPORT_CONTENT}
      backLabel={BACK_LABEL}
    />
  );
}
