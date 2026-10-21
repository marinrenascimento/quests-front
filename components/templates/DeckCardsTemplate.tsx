import { useRouter } from 'expo-router';

import { FlashcardGrid } from '@/components/organisms/FlashcardGrid';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HeaderAction, ListPageHeader } from '@/components/organisms/ListPageHeader';
import { TopBar } from '@/components/organisms/TopBar';
import { CardAction, CardActionKey, DeckCard } from '@/constants/decks';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Nome do deck no cabeçalho (vazio quando o deck não existe) */
  title: string;
  /** Rótulo "Disciplina - Tema" mostrado em cada card */
  cardLabel: string;
  cards: DeckCard[];
  /** Mensagem da lista vazia ("Nenhum card neste deck" ou "Deck não encontrado") */
  emptyMessage: string;
  /** Botões abaixo do título (sem botões quando o deck não existe) */
  headerActions: HeaderAction[];
  cardActions: CardAction[];
  onCardAction: (action: CardActionKey, cardId: string) => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/**
 * Template da tela de cards de um deck, aberta por cima de Meus Decks: TopBar sem aba em
 * destaque e uma lista só (a grade de cards), que rola levando junto o cabeçalho (voltar +
 * nome do deck) e os botões de ação. O voltar retorna à lista de decks.
 */
export function DeckCardsTemplate({
  title,
  cardLabel,
  cards,
  emptyMessage,
  headerActions,
  cardActions,
  onCardAction,
  backLabel,
  coins,
  userName,
}: Props) {
  const router = useRouter();
  const handleTabPress = useTopBarNavigation();

  const handleBack = () => {
    // Volta para Meus Decks (com a rolagem preservada); aberta sem histórico, vai para a lista
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/decks');
    }
  };

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <FlashcardGrid
        cards={cards}
        label={cardLabel}
        emptyMessage={emptyMessage}
        actions={cardActions}
        onAction={onCardAction}
        header={
          <ListPageHeader
            title={title}
            onBack={handleBack}
            backLabel={backLabel}
            fitTitle
            actions={headerActions}
          />
        }
      />
    </HelpLayout>
  );
}
