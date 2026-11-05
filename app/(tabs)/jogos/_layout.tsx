import { Stack } from 'expo-router';

// Pilha de Jogos: a lista dos 3 jogos (index) e, do Elfo Matemático, a preparação com a escolha do
// nível (elfo/index) e, por cima dela, a partida (elfo/jogar). Sem header nativo: as telas têm o
// TopBar, menos a partida, que é em tela cheia. Regras em docs/REGRAS_DE_NEGOCIO.md (seção 13).
export default function GamesStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
