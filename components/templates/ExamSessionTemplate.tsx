import { Ref } from 'react';

import { TopBarTabKey } from '@/components/molecules/TopBarTabs';
import { ExamHeader } from '@/components/organisms/ExamHeader';
import { ExamQuestionList, ExamQuestionListHandle } from '@/components/organisms/ExamQuestionList';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { MarkerToolbar } from '@/components/organisms/MarkerToolbar';
import { QuestionNavigator } from '@/components/organisms/QuestionNavigator';
import { TopBar } from '@/components/organisms/TopBar';
import type {
  ExamQuestionCardContent,
  MarkerConfig,
  Question,
} from '@/constants/exams';
import { IconName } from '@/constants/helpContent';
import type { ExamSession } from '@/hooks/useExamSession';

type Props = {
  /** Nome da prova */
  title: string;
  questions: Question[];
  /** Estado e ações da prova (useExamSession) */
  session: ExamSession;
  /** Textos e ícones da tela */
  content: {
    exitLabel: string;
    exitIcon: IconName;
    submitLabel: string;
    goToQuestionLabel: (position: number) => string;
    markerIcon: IconName;
    markerToggleLabel: string;
    emptyMessage: string;
  };
  cardContent: ExamQuestionCardContent;
  markers: MarkerConfig[];
  /** Contagem do cabeçalho: número de respondidas, o resto do texto e o texto lido */
  answeredLabel: string;
  progressSuffix: string;
  progressLabel: string;
  /** Referência da lista, para rolar até uma questão */
  listRef: Ref<ExamQuestionListHandle>;
  /** Toque num botão do navegador */
  onSelectQuestion: (index: number) => void;
  onExit: () => void;
  onSubmit: () => void;
  /** Abas do TopBar (quem usa decide se pede confirmação antes de sair) */
  onTabPress: (tab: TopBarTabKey) => void;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/**
 * Template da realização de uma prova: TopBar sem aba em destaque, cabeçalho fixo (sair,
 * contagem, nome da prova e navegador de questões), a lista de questões entre ele e a barra
 * inferior fixa (marcador de texto e "Entregar prova"). Sem questões, o navegador some e o
 * "Entregar prova" fica desabilitado.
 */
export function ExamSessionTemplate({
  title,
  questions,
  session,
  content,
  cardContent,
  markers,
  answeredLabel,
  progressSuffix,
  progressLabel,
  listRef,
  onSelectQuestion,
  onExit,
  onSubmit,
  onTabPress,
  coins,
  userName,
}: Props) {
  const hasQuestions = questions.length > 0;

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={onTabPress} coins={coins} userName={userName} />}>
      <ExamHeader
        exitLabel={content.exitLabel}
        exitIcon={content.exitIcon}
        onExit={onExit}
        answered={answeredLabel}
        progressSuffix={progressSuffix}
        progressLabel={progressLabel}
        title={title}
        navigator={
          hasQuestions ? (
            <QuestionNavigator
              answered={session.answeredFlags}
              currentIndex={session.currentIndex}
              onSelect={onSelectQuestion}
              getAccessibilityLabel={content.goToQuestionLabel}
            />
          ) : undefined
        }
      />
      <ExamQuestionList
        ref={listRef}
        questions={questions}
        answers={session.answers}
        highlights={session.highlights}
        pending={session.pending}
        markerOn={session.markerOn}
        content={cardContent}
        emptyMessage={content.emptyMessage}
        onSelectAnswer={session.selectAnswer}
        onWordPress={session.pressWord}
        onCurrentChange={session.setCurrentIndex}
      />
      <MarkerToolbar
        markers={markers}
        activeColor={session.markerColor}
        onSelectColor={session.selectMarkerColor}
        markerOn={session.markerOn}
        onToggleMarker={session.toggleMarker}
        markerIcon={content.markerIcon}
        markerLabel={content.markerToggleLabel}
        submitLabel={content.submitLabel}
        onSubmit={onSubmit}
        submitDisabled={!hasQuestions}
      />
    </HelpLayout>
  );
}
