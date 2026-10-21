import { Stack } from 'expo-router';

// Pilha de Meus Decks: a lista de decks (index), o cadastro de deck (novo), os cards de um deck
// ([deckId]/index), que abrem por cima dela com botão voltar, e a revisão do deck
// ([deckId]/estudar), que abre por cima dos cards. A rota fixa "novo" tem prioridade sobre a
// dinâmica [deckId]. Sem header nativo: o TopBar fica dentro de cada tela.
export default function DecksStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
