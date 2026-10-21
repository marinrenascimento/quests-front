import { DeckGrid } from '@/components/organisms/DeckGrid';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { ListPageHeader } from '@/components/organisms/ListPageHeader';
import { TopBar } from '@/components/organisms/TopBar';
import { Deck } from '@/constants/decks';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  decks: Deck[];
  title: string;
  createLabel: string;
  studyLabel: string;
  emptyMessage: string;
  countLabels: { one: string; other: string };
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
  onCreatePress: () => void;
  onStudyPress: () => void;
  onDeckPress: (deck: Deck) => void;
};

/**
 * Template da tela Meus Decks: TopBar sem aba em destaque e uma lista só (a grade de decks),
 * que rola levando junto o cabeçalho (voltar + título) e os dois botões de ação.
 * O voltar leva à Home (mesma navegação da aba Home do TopBar).
 */
export function DecksTemplate({
  decks,
  title,
  createLabel,
  studyLabel,
  emptyMessage,
  countLabels,
  backLabel,
  coins,
  userName,
  onCreatePress,
  onStudyPress,
  onDeckPress,
}: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <DeckGrid
        decks={decks}
        emptyMessage={emptyMessage}
        countLabels={countLabels}
        onDeckPress={onDeckPress}
        header={
          <ListPageHeader
            title={title}
            onBack={() => handleTabPress('home')}
            backLabel={backLabel}
            actions={[
              { key: 'create', label: createLabel, onPress: onCreatePress },
              { key: 'study', label: studyLabel, onPress: onStudyPress },
            ]}
          />
        }
      />
    </HelpLayout>
  );
}
