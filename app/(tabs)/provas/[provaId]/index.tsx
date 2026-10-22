import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { ExamQuestionsTemplate } from '@/components/templates/ExamQuestionsTemplate';
import { CardActionKey, subjectLabel } from '@/constants/decks';
import {
  DELETE_QUESTION_CONFIRM_CONTENT,
  EXAM_QUESTIONS_CONTENT,
  LAST_QUESTION_TOAST,
  Question,
  QUESTION_ACTIONS,
  QUESTION_ADDED_TOAST,
  QUESTION_DIFFICULTY_LABELS,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExams } from '@/hooks/useExams';
import { useSubjectNames } from '@/hooks/useSubjects';

/** Nas provas de vestibular, cada questão só tem o botão de visualizar */
const VIEW_ONLY_ACTIONS = QUESTION_ACTIONS.filter((action) => action.key === 'view');

/** Questões de uma prova, aberta pelo toque numa prova em Minhas Provas ou em Vestibulares */
export default function ExamQuestionsScreen() {
  const router = useRouter();
  const { provaId } = useLocalSearchParams<{ provaId: string }>();
  // TODO: substituir pela prova e pelas questões vindas do back.
  const {
    getExam,
    getExamQuestions,
    deleteQuestion,
    questionAddedToastExamId,
    hideQuestionAddedToast,
  } = useExams();
  const { disciplineNames, contentNames } = useSubjectNames();
  const exam = getExam(provaId);
  // Provas de vestibular não têm adicionar, editar nem excluir questão
  const editable = exam?.origin === 'usuario';
  // Sem prova, getExamQuestions devolve uma lista vazia estável
  const questions = getExamQuestions(provaId);
  // Textos de cada card montados uma vez por lista, fora do renderItem
  const questionItems = useMemo(
    () =>
      questions.map((question) => ({
        id: question.id,
        label: subjectLabel(
          disciplineNames.get(question.disciplineId) ?? '',
          contentNames.get(question.contentId) ?? '',
        ),
        title: question.title,
        difficultyLabel: QUESTION_DIFFICULTY_LABELS[question.difficulty],
      })),
    [questions, disciplineNames, contentNames],
  );
  // Questão da lixeira tocada: continua guardada ao fechar, para o título não sumir no fade
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [lastQuestionWarning, setLastQuestionWarning] = useState(false);
  const hideLastQuestionWarning = useCallback(() => setLastQuestionWarning(false), []);

  // Saindo da tela antes do toast sumir, o aviso não fica pendente para a próxima visita
  useEffect(() => hideQuestionAddedToast, [hideQuestionAddedToast]);

  const handleBack = () => {
    // Volta para a tela de baixo (Minhas Provas ou Vestibulares); aberta sem histórico (ex.: link
    // direto), vai para a lista de origem da prova
    if (router.canDismiss()) {
      router.back();
    } else if (exam?.origin === 'vestibular') {
      router.replace('/(tabs)/provas/vestibulares');
    } else {
      router.replace('/(tabs)/provas');
    }
  };

  const openQuestion = useCallback(
    (questionId: string) =>
      // push: as questões ficam por baixo e o voltar do Visualizar Questão retorna a elas
      router.push({
        pathname: '/(tabs)/provas/[provaId]/questoes/[questaoId]',
        params: { provaId, questaoId: questionId },
      }),
    [router, provaId],
  );

  // Estável, para não re-renderizar a lista inteira
  const handleQuestionAction = useCallback(
    (action: CardActionKey, questionId: string) => {
      switch (action) {
        case 'edit':
          // push: as questões ficam por baixo e o Editar Questão volta para elas
          router.push({
            pathname: '/(tabs)/provas/[provaId]/questoes/[questaoId]/editar',
            params: { provaId, questaoId: questionId },
          });
          break;
        case 'delete': {
          // A prova não fica sem questões: com uma só, só avisa
          if (questions.length <= 1) {
            setLastQuestionWarning(true);
            break;
          }
          const question = questions.find((item) => item.id === questionId);
          if (question) {
            setQuestionToDelete(question);
            setDeleteVisible(true);
          }
          break;
        }
        case 'view':
          openQuestion(questionId);
          break;
      }
    },
    [questions, router, provaId, openQuestion],
  );

  return (
    <>
      <ExamQuestionsTemplate
        title={exam?.title ?? ''}
        questions={questionItems}
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
                ...(editable
                  ? [
                      {
                        key: 'add',
                        label: EXAM_QUESTIONS_CONTENT.addLabel,
                        // push: as questões ficam por baixo e o Adicionar Questão volta para elas
                        onPress: () =>
                          router.push({
                            pathname: '/(tabs)/provas/[provaId]/questao',
                            params: { provaId: exam.id },
                          }),
                      },
                    ]
                  : []),
              ]
            : []
        }
        questionActions={editable ? QUESTION_ACTIONS : VIEW_ONLY_ACTIONS}
        onQuestionAction={handleQuestionAction}
        onQuestionPress={openQuestion}
        toast={
          lastQuestionWarning
            ? { message: LAST_QUESTION_TOAST, visible: true, onHide: hideLastQuestionWarning }
            : {
                // Depois de salvar uma questão no "Adicionar Questão" desta prova
                message: QUESTION_ADDED_TOAST,
                visible: exam !== undefined && questionAddedToastExamId === exam.id,
                onHide: hideQuestionAddedToast,
              }
        }
        onBack={handleBack}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={deleteVisible}
        title={DELETE_QUESTION_CONFIRM_CONTENT.title}
        highlight={questionToDelete?.title ?? ''}
        confirmLabel={DELETE_QUESTION_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DELETE_QUESTION_CONFIRM_CONTENT.cancelLabel}
        onConfirm={() => {
          setDeleteVisible(false);
          if (exam && questionToDelete) {
            // TODO: excluir a questão no back.
            deleteQuestion(exam.id, questionToDelete.id);
          }
        }}
        // Só fecha: a questão continua na prova
        onCancel={() => setDeleteVisible(false)}
      />
    </>
  );
}
