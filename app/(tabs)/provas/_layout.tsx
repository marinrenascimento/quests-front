import { Stack } from 'expo-router';

import { ExamCreationProvider } from '@/hooks/useExamCreation';
import { ExamsProvider } from '@/hooks/useExams';

// Pilha de Minhas Provas, no padrão da de Meus Decks: a lista de provas (index); Criar Nova Prova
// (nova/index) e, por cima dela, o Adicionar Questão do rascunho (nova/questao); Vestibulares
// (vestibulares); Configurar Prova por Disciplina (disciplina/index); as questões de uma prova
// ([provaId]/index) e, por cima delas, a realização da prova ([provaId]/estudar), o Adicionar
// Questão da prova ([provaId]/questao), o Visualizar Questão ([provaId]/questoes/[questaoId]/index)
// e o Editar Questão ([provaId]/questoes/[questaoId]/editar). O estudo por disciplina abre a mesma
// realização da prova, com o id reservado da prova temporária. As rotas fixas têm prioridade
// sobre [provaId]. Sem header nativo: o TopBar fica dentro de cada tela. O ExamsProvider é a fonte
// única das provas e questões e o ExamCreationProvider guarda o rascunho da prova em criação.
// Tudo em memória.
export default function ExamsStackLayout() {
  return (
    <ExamsProvider>
      <ExamCreationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Sem o gesto de voltar por deslize: sair da prova sempre passa pela confirmação */}
          <Stack.Screen name="[provaId]/estudar" options={{ gestureEnabled: false }} />
        </Stack>
      </ExamCreationProvider>
    </ExamsProvider>
  );
}
