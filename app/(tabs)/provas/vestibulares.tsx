import { useRouter } from 'expo-router';
import { useMemo } from 'react';

import { ExamsTemplate } from '@/components/templates/ExamsTemplate';
import { ENTRANCE_EXAMS_CONTENT, QUESTIONS_COUNT_LABELS } from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExams } from '@/hooks/useExams';

/** Vestibulares, aberta pelo botão "Vestibulares" de Minhas Provas: provas prontas */
export default function EntranceExamsScreen() {
  const router = useRouter();
  // TODO: substituir pelas provas do banco de vestibulares do back.
  const { entranceExams } = useExams();
  // Cada cartão mostra o vestibular e o ano na linha abaixo do nome
  const items = useMemo(
    () =>
      entranceExams.map((exam) => ({
        ...exam,
        description: exam.entranceExam
          ? ENTRANCE_EXAMS_CONTENT.description(exam.entranceExam)
          : '',
      })),
    [entranceExams],
  );

  const handleBack = () => {
    // Volta para Minhas Provas (que fica por baixo na pilha); aberta sem histórico, vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/provas');
    }
  };

  return (
    <ExamsTemplate
      exams={items}
      title={ENTRANCE_EXAMS_CONTENT.title}
      actions={[]}
      emptyMessage={ENTRANCE_EXAMS_CONTENT.emptyMessage}
      countLabels={QUESTIONS_COUNT_LABELS}
      onBack={handleBack}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
      // push: Vestibulares fica por baixo e o voltar das questões retorna a ela
      onExamPress={(exam) =>
        router.push({ pathname: '/(tabs)/provas/[provaId]', params: { provaId: exam.id } })
      }
    />
  );
}
