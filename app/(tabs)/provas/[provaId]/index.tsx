import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { ExamQuestionsTemplate } from '@/components/templates/ExamQuestionsTemplate';
import { CardActionKey } from '@/constants/decks';
import {
  EXAM_QUESTIONS_CONTENT,
  QUESTION_ACTIONS,
  QUESTION_DIFFICULTY_LABELS,
  questionSubjectLabel,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { MOCK_EXAM_QUESTIONS, MOCK_EXAMS } from '@/constants/mockExams';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

/** Questões de uma prova, aberta pelo toque numa prova em Minhas Provas */
export default function ExamQuestionsScreen() {
  const router = useRouter();
  const { provaId } = useLocalSearchParams<{ provaId: string }>();
  // TODO: substituir pela prova e pelas questões vindas do back.
  const exam = MOCK_EXAMS.find((item) => item.id === provaId);
  // Textos de cada card montados uma vez por prova, fora do renderItem da lista
  const questions = useMemo(
    () =>
      (exam ? (MOCK_EXAM_QUESTIONS[exam.id] ?? []) : []).map((question) => ({
        id: question.id,
        label: questionSubjectLabel(question),
        statement: question.statement,
        difficultyLabel: QUESTION_DIFFICULTY_LABELS[question.difficulty],
      })),
    [exam],
  );

  const handleBack = () => {
    // Volta para Minhas Provas (que fica por baixo na pilha); aberta sem histórico (ex.: link
    // direto), vai para ela
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/provas');
    }
  };

  // Estável, para não re-renderizar a lista inteira
  const handleQuestionAction = useCallback((action: CardActionKey, questionId: string) => {
    switch (action) {
      case 'edit':
        // TODO: criar a tela de editar questão e navegar (questionId).
        break;
      case 'delete':
        // TODO: confirmar com o ConfirmModal e excluir a questão no back (questionId).
        break;
      case 'view':
        // TODO: criar a tela de visualizar questão e navegar (questionId).
        break;
    }
  }, []);

  return (
    <ExamQuestionsTemplate
      title={exam?.title ?? ''}
      questions={questions}
      emptyMessage={
        exam ? EXAM_QUESTIONS_CONTENT.emptyMessage : EXAM_QUESTIONS_CONTENT.notFoundMessage
      }
      headerActions={
        exam
          ? [
              {
                key: 'study',
                label: EXAM_QUESTIONS_CONTENT.studyLabel,
                // push: as questões ficam por baixo e sair/entregar a prova volta para elas
                onPress: () =>
                  router.push({
                    pathname: '/(tabs)/provas/[provaId]/estudar',
                    params: { provaId: exam.id },
                  }),
              },
              {
                key: 'add',
                label: EXAM_QUESTIONS_CONTENT.addLabel,
                // TODO: criar a tela de adicionar questão e navegar.
                onPress: () => {},
              },
            ]
          : []
      }
      questionActions={QUESTION_ACTIONS}
      onQuestionAction={handleQuestionAction}
      onBack={handleBack}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
