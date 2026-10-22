import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { BackHandler } from 'react-native';

import type { TopBarTabKey } from '@/components/molecules/TopBarTabs';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import type { ExamQuestionListHandle } from '@/components/organisms/ExamQuestionList';
import { ExamQuestionsTemplate } from '@/components/templates/ExamQuestionsTemplate';
import { ExamSessionTemplate } from '@/components/templates/ExamSessionTemplate';
import {
  EXAM_QUESTION_CARD_CONTENT,
  EXAM_SESSION_CONTENT,
  EXIT_EXAM_CONFIRM_CONTENT,
  MARKER_COLORS,
  Question,
  SUBMIT_EXAM_CONFIRM_CONTENT,
} from '@/constants/exams';
import { BACK_LABEL } from '@/constants/helpContent';
import { MOCK_EXAM_QUESTIONS, MOCK_EXAMS } from '@/constants/mockExams';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useExamSession } from '@/hooks/useExamSession';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';
import { answeredProgressSuffix, answeredSummary } from '@/utils/examProgress';
import { formatThousands } from '@/utils/formatNumber';

/** Lista vazia estável (prova inexistente), para o hook não recalcular a cada render */
const NO_QUESTIONS: Question[] = [];

const noop = () => {};

type ConfirmKind = 'exit' | 'submit';

/** Realização de uma prova, aberta pelo "Estudar Agora" da tela de questões da prova */
export default function ExamSessionScreen() {
  const router = useRouter();
  const { provaId } = useLocalSearchParams<{ provaId: string }>();
  // TODO: substituir pela prova e pelas questões vindas do back.
  const exam = MOCK_EXAMS.find((item) => item.id === provaId);
  const questions = exam ? (MOCK_EXAM_QUESTIONS[exam.id] ?? NO_QUESTIONS) : NO_QUESTIONS;
  const session = useExamSession(questions);
  const handleTabPress = useTopBarNavigation();
  const listRef = useRef<ExamQuestionListHandle>(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  // Guardado ao fechar, para o texto do modal não trocar durante o fade
  const [confirmKind, setConfirmKind] = useState<ConfirmKind>('exit');
  // Aba do TopBar tocada durante a prova: o destino, se o usuário confirmar a saída
  const [pendingTab, setPendingTab] = useState<TopBarTabKey | null>(null);
  const hasQuestions = questions.length > 0;

  const leave = () => {
    // Volta para as questões da prova (que ficam por baixo na pilha); aberta sem histórico
    // (ex.: link direto), vai para elas
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace({ pathname: '/(tabs)/provas/[provaId]', params: { provaId } });
    }
  };

  const openConfirm = (kind: ConfirmKind) => {
    setConfirmKind(kind);
    setConfirmVisible(true);
  };

  // "Não" (ou voltar do Android com o modal aberto): só fecha; respostas, marcações e rolagem
  // continuam como estavam
  const closeConfirm = () => {
    setConfirmVisible(false);
    setPendingTab(null);
  };

  // Sem questões, não há nada a perder: sai direto
  const requestExit = () => (hasQuestions ? openConfirm('exit') : leave());

  const handleTopBarTab = (tab: TopBarTabKey) => {
    if (!hasQuestions) {
      handleTabPress(tab);
      return;
    }
    setPendingTab(tab);
    openConfirm('exit');
  };

  const handleConfirm = () => {
    const tab = pendingTab;
    // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
    closeConfirm();
    if (confirmKind === 'submit') {
      // TODO: enviar as respostas ao back (RN-152).
      // TODO: abrir a tela de resultado/correção quando o mockup existir (RN-152).
      leave();
    } else if (tab) {
      handleTabPress(tab);
    } else {
      leave();
    }
  };

  // Voltar do Android: pede confirmação como o "Sair da prova"; com o modal aberto, fecha como
  // "Não". Sem questões, deixa o voltar normal acontecer.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (confirmVisible) {
          setConfirmVisible(false);
          setPendingTab(null);
          return true;
        }
        if (!hasQuestions) {
          return false;
        }
        setConfirmKind('exit');
        setConfirmVisible(true);
        return true;
      });
      return () => subscription.remove();
    }, [confirmVisible, hasQuestions]),
  );

  // Toque no navegador: vira a questão atual na hora e a lista rola até ela
  const { setCurrentIndex } = session;
  const handleSelectQuestion = useCallback(
    (index: number) => {
      setCurrentIndex(index);
      listRef.current?.scrollToQuestion(index);
    },
    [setCurrentIndex],
  );

  if (!exam) {
    // Mesmo estado de "Prova Não Encontrada" da tela de questões, com a seta de voltar
    return (
      <ExamQuestionsTemplate
        title=""
        questions={[]}
        emptyMessage={EXAM_SESSION_CONTENT.notFoundMessage}
        headerActions={[]}
        questionActions={[]}
        onQuestionAction={noop}
        onBack={leave}
        backLabel={BACK_LABEL}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
    );
  }

  const answeredLabel = formatThousands(session.answeredCount);
  const progressSuffix = answeredProgressSuffix(
    session.total,
    EXAM_SESSION_CONTENT.progressLabels,
  );
  const confirmContent =
    confirmKind === 'submit' ? SUBMIT_EXAM_CONFIRM_CONTENT : EXIT_EXAM_CONFIRM_CONTENT;

  return (
    <>
      <ExamSessionTemplate
        title={exam.title}
        questions={questions}
        session={session}
        content={EXAM_SESSION_CONTENT}
        cardContent={EXAM_QUESTION_CARD_CONTENT}
        markers={MARKER_COLORS}
        answeredLabel={answeredLabel}
        progressSuffix={progressSuffix}
        progressLabel={`${answeredLabel} ${progressSuffix}`}
        listRef={listRef}
        onSelectQuestion={handleSelectQuestion}
        onExit={requestExit}
        onSubmit={() => openConfirm('submit')}
        onTabPress={handleTopBarTab}
        coins={TEMP_COINS}
        userName={TEMP_USER_NAME}
      />
      <ConfirmModal
        visible={confirmVisible}
        title={confirmContent.title}
        highlight={exam.title}
        description={
          confirmKind === 'submit'
            ? answeredSummary(
                session.answeredCount,
                session.total,
                SUBMIT_EXAM_CONFIRM_CONTENT.summaryLabels,
              )
            : undefined
        }
        confirmLabel={confirmContent.confirmLabel}
        cancelLabel={confirmContent.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={closeConfirm}
      />
    </>
  );
}
