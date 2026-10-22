import { Stack } from 'expo-router';

// Pilha de Minhas Provas: a lista de provas (index), por cima dela as questões de uma prova
// ([provaId]/index) e, por cima das questões, a realização da prova ([provaId]/estudar). As
// próximas telas (criar prova, vestibulares, estudar por disciplina) entram aqui, como na pilha
// de Meus Decks. Sem header nativo: o TopBar fica dentro de cada tela.
export default function ExamsStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Sem o gesto de voltar por deslize: sair da prova sempre passa pela confirmação */}
      <Stack.Screen name="[provaId]/estudar" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
