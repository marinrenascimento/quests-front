import { useRouter, useSegments } from 'expo-router';

/**
 * Ação de abrir o Perfil, tocado na pílula do TopBar. O Perfil abre por cima das abas (rota na
 * pilha raiz), então a tela de origem continua como estava e o voltar retorna para ela. Já no
 * Perfil, devolve undefined: a pílula não faz nada.
 */
export function useOpenProfile() {
  const router = useRouter();
  const segments = useSegments() as string[];

  return segments[0] === 'perfil' ? undefined : () => router.push('/perfil');
}
