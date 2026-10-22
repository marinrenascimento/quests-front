import { useRouter } from 'expo-router';

import { ExamsTemplate } from '@/components/templates/ExamsTemplate';
import { EXAMS_CONTENT, QUESTIONS_COUNT_LABELS } from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { MOCK_EXAMS } from '@/constants/mockExams';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

/** Minhas Provas, aberta pelo "Questões" do menu da Home */
export default function ExamsScreen() {
  const router = useRouter();

  const handleBack = () => {
    // Volta para a Home; aberta sem histórico (ex.: link direto), vai para ela
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate('/(tabs)');
    }
  };

  return (
    <ExamsTemplate
      // TODO: substituir pelas provas do usuário vindas do back.
      exams={MOCK_EXAMS}
      title={EXAMS_CONTENT.title}
      actions={[
        // TODO: abrir o cadastro de prova quando a tela existir.
        { key: 'create', label: EXAMS_CONTENT.createLabel, onPress: () => {} },
        // TODO: abrir os vestibulares quando a tela existir.
        { key: 'entrance-exams', label: EXAMS_CONTENT.entranceExamsLabel, onPress: () => {} },
        // TODO: abrir o estudo por disciplina das provas quando a tela existir.
        { key: 'study', label: EXAMS_CONTENT.studyLabel, onPress: () => {} },
      ]}
      emptyMessage={EXAMS_CONTENT.emptyMessage}
      countLabels={QUESTIONS_COUNT_LABELS}
      onBack={handleBack}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
      // push: a lista fica por baixo na pilha e o voltar das questões retorna a ela
      onExamPress={(exam) =>
        router.push({ pathname: '/(tabs)/provas/[provaId]', params: { provaId: exam.id } })
      }
    />
  );
}
