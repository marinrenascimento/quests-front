import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HeaderAction, ListPageHeader } from '@/components/organisms/ListPageHeader';
import { QuestionCardItem, QuestionGrid } from '@/components/organisms/QuestionGrid';
import { TopBar } from '@/components/organisms/TopBar';
import { CardAction, CardActionKey } from '@/constants/decks';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Nome da prova no cabeçalho (vazio quando a prova não existe) */
  title: string;
  questions: QuestionCardItem[];
  /** Mensagem da lista vazia ("Nenhuma Questão Nesta Prova" ou "Prova Não Encontrada") */
  emptyMessage: string;
  /** Botões abaixo do título (sem botões quando a prova não existe) */
  headerActions: HeaderAction[];
  questionActions: CardAction[];
  onQuestionAction: (action: CardActionKey, questionId: string) => void;
  onBack: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/**
 * Template da tela de questões de uma prova, no mesmo esqueleto de Cards do Deck: TopBar sem aba
 * em destaque e uma lista só (a grade de questões), que rola levando junto o cabeçalho (voltar +
 * nome da prova, que diminui para caber numa linha) e os botões de ação.
 */
export function ExamQuestionsTemplate({
  title,
  questions,
  emptyMessage,
  headerActions,
  questionActions,
  onQuestionAction,
  onBack,
  backLabel,
  coins,
  userName,
}: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <QuestionGrid
        questions={questions}
        emptyMessage={emptyMessage}
        actions={questionActions}
        onAction={onQuestionAction}
        header={
          <ListPageHeader
            title={title}
            onBack={onBack}
            backLabel={backLabel}
            fitTitle
            actions={headerActions}
          />
        }
      />
    </HelpLayout>
  );
}
