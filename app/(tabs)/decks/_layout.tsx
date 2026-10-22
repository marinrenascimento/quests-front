import { Stack } from 'expo-router';

import { DeckCreationProvider } from '@/hooks/useDeckCreation';
import { DecksProvider } from '@/hooks/useDecks';

// Pilha de Meus Decks: a lista de decks (index), o cadastro de deck (novo/index) e o Novo
// Flashcard (novo/card), que abre por cima do cadastro, os cards de um deck ([deckId]/index),
// que abrem por cima da lista com botão voltar, e, por cima dos cards, a revisão do deck
// ([deckId]/estudar), o Novo Flashcard do "Adicionar Card" ([deckId]/card) e o Editar
// Flashcard da caneta de um card ([deckId]/cards/[cardId]/editar). O "Estudar por Disciplina"
// abre a configuração (disciplina/index) e, por cima dela, a revisão do deck temporário
// (disciplina/estudar). As rotas fixas "novo" e "disciplina" têm prioridade sobre [deckId]. Sem
// header nativo: o TopBar fica dentro de cada tela. O DecksProvider é a fonte única dos decks e
// cards (fictícios + criados) e o DeckCreationProvider guarda o rascunho do deck em criação,
// compartilhado entre o cadastro e o Novo Flashcard. Tudo em memória.
export default function DecksStackLayout() {
  return (
    <DecksProvider>
      <DeckCreationProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DeckCreationProvider>
    </DecksProvider>
  );
}
