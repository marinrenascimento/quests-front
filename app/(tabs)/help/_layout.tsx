import { Stack } from 'expo-router';

// Pilha da aba Help: a central de ajuda (index) e os tópicos que abrem por cima dela
// (estudos, conta, privacidade, feedback), com botão voltar. Sem header nativo: o TopBar
// fica dentro de cada tela.
export default function HelpStackLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
