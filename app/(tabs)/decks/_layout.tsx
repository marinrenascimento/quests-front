import { Stack } from 'expo-router';

// Pilha de Meus Decks: a lista de decks (index) e os cards de um deck ([deckId]), que abre por
// cima dela com botão voltar. Sem header nativo: o TopBar fica dentro de cada tela.
export default function DecksStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
