import { Toast } from '@/components/molecules/Toast';
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
  /** Botões de cada questão (nas provas de vestibular, só o de visualizar) */
  questionActions: CardAction[];
  onQuestionAction: (action: CardActionKey, questionId: string) => void;
  /** Toque no cartão de uma questão (abre o Visualizar Questão) */
  onQuestionPress: (questionId: string) => void;
  /** Toast no topo do conteúdo (ex.: depois de adicionar uma questão). Opcional. */
  toast?: { message: string; visible: boolean; onHide: () => void };
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
  onQuestionPress,
  toast,
  onBack,
  backLabel,
  coins,
  userName,
}: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}
      overlay={
        toast ? (
          <Toast message={toast.message} visible={toast.visible} onHide={toast.onHide} />
        ) : undefined
      }>
      <QuestionGrid
        questions={questions}
        emptyMessage={emptyMessage}
        actions={questionActions}
        onAction={onQuestionAction}
        onPress={onQuestionPress}
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
