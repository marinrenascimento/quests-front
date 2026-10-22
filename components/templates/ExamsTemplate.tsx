import { DeckGrid } from '@/components/organisms/DeckGrid';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HeaderAction, ListPageHeader } from '@/components/organisms/ListPageHeader';
import { TopBar } from '@/components/organisms/TopBar';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

/** Uma prova na grade: nome, quantidade de questões e, opcional, a linha de descrição */
export type ExamGridItem = {
  id: string;
  title: string;
  questionsCount: number;
  /** Ex.: vestibular e ano ("ENEM · 2023"); sem ela, o cartão não tem a linha */
  description?: string;
};

type Props<T extends ExamGridItem> = {
  exams: T[];
  title: string;
  /** Botões lado a lado abaixo do título, com a mesma largura (sem botões: lista vazia) */
  actions: HeaderAction[];
  emptyMessage: string;
  /** Palavra da quantidade de questões no singular e no plural */
  countLabels: { one: string; other: string };
  onBack: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
  onExamPress: (exam: T) => void;
};

/** Máximo de linhas do nome da prova no cartão */
const TITLE_LINES = 2;

/**
 * Template de Minhas Provas e de Vestibulares, no mesmo esqueleto de Meus Decks: TopBar sem aba
 * em destaque e uma lista só (a grade de provas), que rola levando junto o cabeçalho (voltar +
 * título) e os botões de ação. Os cartões mostram o nome (até 2 linhas), a descrição (se houver)
 * e a quantidade de questões à direita.
 */
export function ExamsTemplate<T extends ExamGridItem>({
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
}: Props<T>) {
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
