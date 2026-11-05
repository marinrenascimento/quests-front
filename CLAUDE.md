# CLAUDE.md — quests (front)

Expo SDK 54 + Expo Router 6 + React Native 0.81 + TypeScript strict. Leia também `AGENTS.md` e `README.md`.

## Regras

- Rotas ficam em `app/` (não em `src/app/`). Cada arquivo em `app/` é uma rota, então não coloque componentes, hooks ou utils lá.
- `_layout.tsx` define o navegador do grupo. Grupos: `(tabs)` e `(auth)`. O Perfil (`app/perfil.tsx`) fica na pilha raiz, por cima das abas, para não descartar a tela de origem (as abas usam `popToTopOnBlur`).
- Fluxo do login: `(auth)` → `router.replace('/(tabs)')` (replace, não push).
- Atomic Design em `components/atoms`, `components/molecules`, `components/organisms`, `components/templates`:
  - atoms não importam outros componentes de UI do projeto;
  - molecules combinam atoms;
  - organisms combinam molecules/atoms;
  - templates montam o esqueleto de uma tela;
  - telas em `app/` só montam componentes.
- Componentes funcionais em TS, com `type Props` declarado, um por arquivo, arquivo em PascalCase igual ao nome do componente.
- `useState` para estado. `useEffect` sempre com array de dependências.
- Listas: `FlatList` + `keyExtractor`. Nunca `.map()` dentro de `ScrollView` para listas longas.
- Estilos com `StyleSheet.create`, sem estilos inline repetidos. Cores/tema em `constants/` (`constants/theme.ts`).
- Imagens em `assets/images/`, nomes em minúsculas e sem espaços, `require('@/assets/images/...png')` com caminho literal.
- Imports sempre com `@/`.
- Lógica reutilizável em `hooks/`, com nome começando com `use`. O usuário logado vem do `useUser`, que o `TopBar` já lê: não passe nome, moedas ou avatar por props.
- Para chamar o back, use o IP do PC e não `localhost` (o Expo Go roda no celular).
- Instale libs com `npx expo install`. Verifique compatibilidade com o Expo Go.
- Antes de concluir: `npx expo lint` e `npx tsc --noEmit`.
- Toda tela ou regra de negócio nova (ou alterada) deve ser registrada em `docs/REGRAS_DE_NEGOCIO.md`, com ID, tela e status.
- Não rode `npm run reset-project`. Não renomeie os arquivos legados fora do padrão (imagens camelCase, componentes kebab-case do template) sem pedido explícito.
- Nunca commitar `node_modules/` nem `.env`. Commits pequenos e com mensagens claras.
