import { useRouter } from 'expo-router';

import { ExamsTemplate } from '@/components/templates/ExamsTemplate';
import { EXAMS_CONTENT, QUESTIONS_COUNT_LABELS } from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { useExams } from '@/hooks/useExams';

/** Minhas Provas, aberta pelo "Questões" do menu da Home */
export default function ExamsScreen() {
  const router = useRouter();
  // Fictícias + criadas em Criar Nova Prova (fonte única em memória)
  const { exams } = useExams();

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
      exams={exams}
      title={EXAMS_CONTENT.title}
      actions={[
        // push: Minhas Provas fica por baixo e o voltar de cada tela retorna a ela
        {
          key: 'create',
          label: EXAMS_CONTENT.createLabel,
          onPress: () => router.push('/(tabs)/provas/nova'),
        },
        {
          key: 'study',
          label: EXAMS_CONTENT.studyLabel,
          onPress: () => router.push('/(tabs)/provas/disciplina'),
        },
      ]}
      titleAction={{
        key: 'entrance-exams',
        label: EXAMS_CONTENT.entranceExamsLabel,
        onPress: () => router.push('/(tabs)/provas/vestibulares'),
      }}
      emptyMessage={EXAMS_CONTENT.emptyMessage}
      countLabels={QUESTIONS_COUNT_LABELS}
      onBack={handleBack}
      backLabel={BACK_LABEL}
      // push: a lista fica por baixo na pilha e o voltar das questões retorna a ela
      onExamPress={(exam) =>
        router.push({ pathname: '/(tabs)/provas/[provaId]', params: { provaId: exam.id } })
      }
    />
  );
}
