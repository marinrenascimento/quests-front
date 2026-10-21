import { useRouter } from 'expo-router';

import { DecksTemplate } from '@/components/templates/DecksTemplate';
import { CARDS_COUNT_LABELS, DECKS_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { MOCK_DECKS } from '@/constants/mockDecks';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';

export default function DecksScreen() {
  const router = useRouter();

  return (
    <DecksTemplate
      // TODO: substituir pelos dados do back.
      decks={MOCK_DECKS}
      title={DECKS_CONTENT.title}
      createLabel={DECKS_CONTENT.createLabel}
      studyLabel={DECKS_CONTENT.studyLabel}
      emptyMessage={DECKS_CONTENT.emptyMessage}
      countLabels={CARDS_COUNT_LABELS}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
      // push: Meus Decks fica por baixo e o voltar do cadastro retorna a ela
      onCreatePress={() => router.push('/(tabs)/decks/novo')}
      onStudyPress={() => {
        // TODO: criar tela e navegar.
      }}
      // push: a lista fica por baixo na pilha e o voltar retorna a ela com a rolagem preservada
      onDeckPress={(deck) =>
        router.push({ pathname: '/(tabs)/decks/[deckId]', params: { deckId: deck.id } })
      }
    />
  );
}
