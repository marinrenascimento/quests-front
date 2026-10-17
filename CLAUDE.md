# CLAUDE.md — quests (front)

Expo SDK 54 + Expo Router 6 + React Native 0.81 + TypeScript strict. Leia também `AGENTS.md` e `README.md`.

## Regras

- Rotas ficam em `app/` (não em `src/app/`). Cada arquivo em `app/` é uma rota, então não coloque componentes, hooks ou utils lá.
- `_layout.tsx` define o navegador do grupo. Grupos: `(tabs)` (existe) e `(auth)` (planejado).
- Fluxo planejado: login em `(auth)` → `router.replace('/(tabs)')` (replace, não push).
- Atomic Design em `components/atoms`, `components/molecules`, `components/organisms`:
  - atoms não importam outros componentes de UI do projeto;
  - molecules combinam atoms;
  - organisms combinam molecules/atoms;
  - telas em `app/` só montam componentes.
- Componentes funcionais em TS, com `type Props` declarado, um por arquivo, arquivo em PascalCase igual ao nome do componente.
- `useState` para estado. `useEffect` sempre com array de dependências.
- Listas: `FlatList` + `keyExtractor`. Nunca `.map()` dentro de `ScrollView` para listas longas.
- Estilos com `StyleSheet.create`, sem estilos inline repetidos. Cores/tema em `constants/` (`constants/theme.ts`).
- Imagens em `assets/images/`, nomes em minúsculas e sem espaços, `require('@/assets/images/...png')` com caminho literal.
- Imports sempre com `@/`.
- Lógica reutilizável em `hooks/`, com nome começando com `use`.
- Para chamar o back, use o IP do PC e não `localhost` (o Expo Go roda no celular).
- Instale libs com `npx expo install`. Verifique compatibilidade com o Expo Go.
- Antes de concluir: `npx expo lint` e `npx tsc --noEmit`.
- Não rode `npm run reset-project`. Não renomeie os arquivos legados fora do padrão (imagens camelCase, componentes kebab-case do template) sem pedido explícito.
- Nunca commitar `node_modules/` nem `.env`. Commits pequenos e com mensagens claras.
