import { useRouter } from 'expo-router';

import { DecksTemplate } from '@/components/templates/DecksTemplate';
import { CARDS_COUNT_LABELS, DECKS_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDecks } from '@/hooks/useDecks';

export default function DecksScreen() {
  const router = useRouter();
  // Fictícios + criados no cadastro de deck (fonte única em memória)
  const { decks } = useDecks();

  return (
    <DecksTemplate
      // TODO: substituir pelos dados do back.
      decks={decks}
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
      // push: Meus Decks fica por baixo e o voltar da configuração retorna a ela
      onStudyPress={() => router.push('/(tabs)/decks/disciplina')}
      // push: a lista fica por baixo na pilha e o voltar retorna a ela com a rolagem preservada
      onDeckPress={(deck) =>
        router.push({ pathname: '/(tabs)/decks/[deckId]', params: { deckId: deck.id } })
      }
    />
  );
}
