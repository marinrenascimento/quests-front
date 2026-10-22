import { DeckGrid } from '@/components/organisms/DeckGrid';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HeaderAction, ListPageHeader } from '@/components/organisms/ListPageHeader';
import { TopBar } from '@/components/organisms/TopBar';
import { Exam } from '@/constants/exams';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  exams: Exam[];
  title: string;
  /** Botões lado a lado abaixo do título, com a mesma largura */
  actions: HeaderAction[];
  emptyMessage: string;
  /** Palavra da quantidade de questões no singular e no plural */
  countLabels: { one: string; other: string };
  onBack: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
  onExamPress: (exam: Exam) => void;
};

/** Máximo de linhas do nome da prova no cartão */
const TITLE_LINES = 2;

/**
 * Template da tela Minhas Provas, no mesmo esqueleto de Meus Decks: TopBar sem aba em destaque
 * e uma lista só (a grade de provas), que rola levando junto o cabeçalho (voltar + título) e os
 * botões de ação. Os cartões mostram o nome (até 2 linhas) e a quantidade de questões à direita.
 */
export function ExamsTemplate({
  exams,
  title,
  actions,
  emptyMessage,
  countLabels,
  onBack,
  backLabel,
  coins,
  userName,
  onExamPress,
}: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <DeckGrid
        items={exams}
        emptyMessage={emptyMessage}
        getCount={(exam) => exam.questionsCount}
        countLabels={countLabels}
        onItemPress={onExamPress}
        titleLines={TITLE_LINES}
        countAlign="right"
        countInAccessibilityLabel
        header={
          <ListPageHeader title={title} onBack={onBack} backLabel={backLabel} actions={actions} />
        }
      />
    </HelpLayout>
  );
}
