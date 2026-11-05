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
  onCreatePress,
  onStudyPress,
  onDeckPress,
}: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} />}>
      <DeckGrid
        items={decks}
        emptyMessage={emptyMessage}
        getCount={(deck) => deck.cardsCount}
        countLabels={countLabels}
        onItemPress={onDeckPress}
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
