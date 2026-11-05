import { Stack } from 'expo-router';

// Pilha de Jogos: a lista dos 3 jogos (index) e, de cada jogo, a preparação com a escolha do nível
// (elfo, goblin e mago, cada um com index) e, por cima dela, a partida (o jogar de cada um). Sem header
// nativo: as telas têm o TopBar, menos as partidas, que são em tela cheia. Regras em
// docs/REGRAS_DE_NEGOCIO.md (seções 13 e 14) e código explicado em docs/JOGOS.md.
export default function GamesStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
