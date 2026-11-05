import { useRouter, useSegments } from 'expo-router';

import type { TopBarTabKey } from '@/components/molecules/TopBarTabs';

/**
 * Handler das abas do TopBar, usado por todas as telas com TopBar.
 *
 * Usa `navigate` (e não `replace`): dentro do navegador de abas o Expo Router transforma a
 * navegação em troca de aba, que reaproveita a tela já aberta e não empilha telas.
 * `replace` não é suportado pelo navegador de abas.
 *
 * A aba Help tem uma pilha própria (Help > Estudos). Estando dentro dela, "Help" usa
 * `dismissTo` para voltar à Help que já está na pilha: `navigate` empilharia outra cópia
 * (no React Navigation 7, `navigate` só reaproveita a tela se ela for a atual). Vindo de outra
 * aba, a pilha já está só com a Help (popToTopOnBlur em app/(tabs)/_layout.tsx).
 *
 * O Perfil fica por cima das abas, na pilha raiz: `dismissTo` fecha o Perfil e troca para a aba
 * tocada, em vez de empilhar uma segunda cópia das abas (o que zeraria os dados em memória delas).
 */
export function useTopBarNavigation() {
  const router = useRouter();
  const segments = useSegments() as string[];
  const isInsideHelp = segments.includes('help');
  const isInsideProfile = segments[0] === 'perfil';
  const go = isInsideProfile ? router.dismissTo : router.navigate;

  return (tab: TopBarTabKey) => {
    switch (tab) {
      case 'home':
        go('/(tabs)');
        break;
      case 'rank':
        go('/(tabs)/rank');
        break;
      case 'help':
        if (isInsideHelp) {
          router.dismissTo('/(tabs)/help');
        } else {
          go('/(tabs)/help');
        }
        break;
    }
  };
}
