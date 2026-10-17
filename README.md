# Quests — Front (app mobile)

## Visão geral

**Quests** é um projeto dividido em duas partes, cada uma no seu próprio repositório:

| Parte | Repositório | Papel |
|-------|-------------|-------|
| **front** (este) | `quests-front` | App mobile feito com Expo / React Native. Cuida das telas, da navegação e da interação com o usuário. |
| **back** | `quests-back` | API em Node.js + Express que o app vai chamar para buscar e salvar dados. |

O front é a interface do jogo/app: telas, avatares, cenários, níveis etc. (veja as imagens em `assets/images/`). Ele não guarda regras de negócio nem dados permanentes, que ficam a cargo do back.

> **Estado atual:** o front ainda contém o código de exemplo do `create-expo-app` (telas "Home" e "Explore", componentes `themed-*`, `parallax-scroll-view` etc.). A organização em Atomic Design e o fluxo de login descritos abaixo são o **padrão a seguir** e ainda não foram implementados.

## Stack e versões

Versões declaradas no `package.json`:

| Tecnologia | Versão |
|------------|--------|
| Expo SDK | `~54.0.36` (SDK 54) |
| Expo Router | `~6.0.24` |
| React | `19.1.0` |
| React Native | `0.81.5` |
| React Native Web | `~0.21.0` |
| React Native Reanimated | `~4.1.1` |
| React Native Gesture Handler | `~2.28.0` |
| React Navigation (native / bottom-tabs) | `^7.1.8` / `^7.4.0` |
| expo-image | `~3.0.11` |
| @expo/vector-icons | `^15.0.3` |
| TypeScript | `~5.9.2` (modo `strict` ativado) |
| ESLint | `^9.25.0` com `eslint-config-expo ~10.0.0` |

Configurações relevantes do `app.json`:

- `newArchEnabled: true` (Nova Arquitetura do React Native)
- `experiments.typedRoutes: true`: rotas tipadas no Expo Router
- `experiments.reactCompiler: true`: React Compiler ligado
- `userInterfaceStyle: "automatic"`: tema claro/escuro segue o sistema
- `orientation: "portrait"`

> O `app.json` ainda usa `name`, `slug` e `scheme` como `"front"`, herdados do template.

## Como rodar (Windows / PowerShell)

### Pré-requisitos

- [Node.js](https://nodejs.org/) LTS instalado
- App **Expo Go** instalado no celular (Android ou iOS), em uma versão compatível com o SDK 54

### Passo a passo

```powershell
# 1. Entrar na pasta do front
cd caminho\para\quests\front

# 2. Instalar as dependências (só na primeira vez ou quando o package.json mudar)
npm install

# 3. Iniciar o servidor de desenvolvimento
npx expo start
```

4. Um **QR code** vai aparecer no terminal.
   - **Android:** abra o Expo Go e use "Scan QR code".
   - **iOS:** aponte a câmera do iPhone para o QR code e toque no link.

### Rede: celular e PC na mesma Wi-Fi

- O celular e o computador **precisam estar na mesma rede Wi-Fi**.
- Se não conectar (rede da faculdade, firewall, Wi-Fi com isolamento de clientes etc.), use o modo túnel:

  ```powershell
  npx expo start --tunnel
  ```

  O túnel é mais lento, mas funciona mesmo em redes diferentes.

- Se o Windows perguntar sobre o Firewall na primeira execução, **permita o acesso em redes privadas**.

### Chamando o back a partir do app

O app roda **no celular**, então para ele `localhost` é o próprio celular, não o seu PC. **O Expo Go não acessa `localhost` do computador.**

Para chamar o back, use o **IP do computador na rede local**:

```powershell
ipconfig
# Procure "Endereço IPv4" do adaptador Wi-Fi, ex.: 192.168.0.15
```

```ts
// Errado: não funciona no celular
fetch('http://localhost:3000/...')

// Certo: IP do PC + porta do back
fetch('http://192.168.0.15:3000/...')
```

> O IP muda conforme a rede, então não deixe IP fixo espalhado pelo código. A forma de centralizar a URL da API (arquivo em `constants/`, variável de ambiente etc.) ainda será definida pelo grupo.

### Outros comandos úteis

```powershell
npx expo install <pacote>   # SEMPRE use para instalar libs (escolhe a versão compatível com o SDK 54)
npx expo lint               # lint (ESLint)
npx tsc --noEmit            # checagem de tipos
npx expo-doctor             # diagnosticar problemas de dependências/config
npx expo start --clear      # iniciar limpando o cache do Metro
```

> Não use `npm install <pacote>` para libs do Expo/React Native, use `npx expo install`.
> O Expo Go só tem os módulos nativos que já vêm nele. Uma lib com código nativo próprio exige um *development build*.

> **Não rode `npm run reset-project`** sem combinar com o grupo: ele move a pasta `app/` atual para `app-example/` e cria uma `app/` vazia.

## Estrutura de pastas

### Estrutura atual

```
front/
├── app/                      # Rotas (Expo Router): cada arquivo é uma tela
│   ├── _layout.tsx           # Layout raiz: Stack + tema claro/escuro + StatusBar
│   ├── modal.tsx             # Tela modal de exemplo
│   └── (tabs)/               # Grupo de rotas com navegação por abas
│       ├── _layout.tsx       # Define as abas (Tabs)
│       ├── index.tsx         # Aba "Home" (exemplo do template)
│       └── explore.tsx       # Aba "Explore" (exemplo do template)
├── assets/
│   └── images/               # Imagens do app
│       ├── avatares/
│       │   ├── com-upgrade/  # Avatares evoluídos
│       │   └── sem-upgrade/  # Avatares básicos
│       ├── cenarios/         # Fundos/cenários
│       ├── niveis/           # Ícones de nível (bronze, prata, ouro, rubi...)
│       ├── numeros/          # Números ilustrados (0–9)
│       ├── outros/           # Itens diversos (baú, espada, pergaminho...)
│       └── *.png             # Ícone, splash, favicon e imagens do template
├── components/               # Componentes reutilizáveis (hoje: componentes do template)
│   └── ui/                   # collapsible, icon-symbol (do template)
├── constants/
│   └── theme.ts              # Cores (claro/escuro) e fontes
├── hooks/                    # Hooks: use-color-scheme, use-theme-color
├── scripts/
│   └── reset-project.js      # Script do template (ver aviso acima)
├── .vscode/                  # Configurações recomendadas do VS Code
├── AGENTS.md                 # Instruções para assistentes de IA (do template Expo)
├── CLAUDE.md                 # Regras resumidas do projeto para o Claude
├── app.json                  # Configuração do Expo
├── eslint.config.js          # Configuração do ESLint
├── package.json              # Dependências e scripts
└── tsconfig.json             # TypeScript (strict + atalho @/)
```

### Estrutura alvo (Atomic Design)

Novos componentes devem ir para:

```
components/
├── atoms/        # Peças básicas e indivisíveis
├── molecules/    # Combinações de atoms
└── organisms/    # Blocos maiores da tela
```

Os componentes atuais do template (`themed-text.tsx`, `parallax-scroll-view.tsx` etc.) ainda não foram reorganizados.

## Padrões e regras

### 1. Atomic Design

| Nível | O que é | Exemplos | Pode importar |
|-------|---------|----------|---------------|
| **atoms** | Menor unidade visual, sem depender de outros componentes do projeto | `Button`, `Title`, `Avatar`, `Input`, `Icon` | Só React Native/Expo (`View`, `Text`, `Image`, `Pressable`...), `constants/` e `hooks/`. **Nunca outros componentes de UI do projeto.** |
| **molecules** | Combinação de atoms com uma função simples | `InputWithLabel`, `LevelBadge` (ícone + texto), `QuestCard` | atoms |
| **organisms** | Seção completa e mais complexa da interface | `Header`, `QuestList`, `LoginForm`, `ProfileSummary` | molecules e atoms |
| **screens** (`app/`) | Telas/rotas | `app/(tabs)/index.tsx` | organisms, molecules e atoms. **Só montam componentes**, sem UI complexa criada direto na tela. |

As importações seguem uma direção só: **atoms ← molecules ← organisms ← screens**. Um nível nunca importa um nível acima dele.

### 2. Expo Router (navegação)

- **Cada arquivo dentro de `app/` é uma rota.** Por isso, não coloque componentes, hooks ou utilitários dentro de `app/`.
  > O `AGENTS.md` cita `src/app/`, mas **neste projeto as rotas ficam em `app/`** (na raiz do front).
- **Grupos** usam parênteses e não aparecem na URL:
  - `(tabs)`: telas com barra de abas (já existe).
  - `(auth)`: telas de autenticação, como o login (**planejado, ainda não existe**).
- **`_layout.tsx`** define o layout/navegador do grupo (Stack, Tabs...). O `app/_layout.tsx` é o layout raiz.
- Importe `Link`, `router` e `useLocalSearchParams` de `expo-router`.
- **Fluxo planejado:** o usuário abre o app → tela de login em `(auth)` → após o login, `router.replace('/(tabs)')`.
  Use `replace`, e não `push`, para o usuário não conseguir "voltar" para o login.

### 3. Componentes

- **Componentes funcionais** em **TypeScript** (`.tsx`).
- **Tipo das Props sempre declarado**:

  ```tsx
  import { Pressable, StyleSheet, Text } from 'react-native';

  type Props = {
    title: string;
    onPress: () => void;
  };

  export function Button({ title, onPress }: Props) {
    return (
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    );
  }

  const styles = StyleSheet.create({
    button: { padding: 12, borderRadius: 8 },
    text: { fontWeight: '600' },
  });
  ```

- **Um componente por arquivo.**
- **Nome do arquivo = nome do componente, em PascalCase**: `Button.tsx` exporta `Button`.
  > Os componentes do template usam kebab-case (`themed-text.tsx`, `haptic-tab.tsx`...) e estão fora do padrão. Serão renomeados/reorganizados depois. Componentes **novos** já seguem PascalCase.

### 4. Estado, efeitos e listas

- Estado local com **`useState`**.
- Efeitos com **`useEffect`**, **sempre com array de dependências** (`[]` para rodar uma vez, ou `[valor]` para reagir a mudanças).
- Listas com **`FlatList`** + **`keyExtractor`**:

  ```tsx
  <FlatList
    data={quests}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => <QuestCard quest={item} />}
  />
  ```

- **Nunca** use `.map()` dentro de `ScrollView` para listas longas, porque isso renderiza tudo de uma vez e deixa o app lento.

### 5. Estilos e tema

- Estilos com **`StyleSheet.create`**, no final do arquivo do componente.
- Evite estilos inline soltos e repetidos. Se um estilo se repete, ele vira um componente (atom) ou uma constante.
- **Cores e tema ficam em `constants/`** (hoje: `constants/theme.ts`, com as cores de claro/escuro). Não espalhe códigos de cor (`'#0a7ea4'`) pelo código.

### 6. Imagens

- Ficam em **`assets/images/`** (pode usar subpastas, como as atuais `avatares/`, `cenarios/` etc.).
- **Nomes em minúsculas e sem espaços** (use hífen se precisar separar palavras): `cavaleiro-dourado.png`.
- Use com `require` e **caminho literal** (o bundler precisa do caminho fixo no código):

  ```tsx
  // Certo
  <Image source={require('@/assets/images/niveis/ouro.png')} />

  // Errado: caminho montado dinamicamente não funciona
  <Image source={require(`@/assets/images/niveis/${nivel}.png`)} />
  ```

  Para escolher imagens dinamicamente, monte um objeto com os `require` literais e escolha pela chave.

> **Fora do padrão hoje:** várias imagens usam camelCase, por exemplo `avatares/com-upgrade/cavaleiroDourado.png`, `elfoMantoBranco.png`, `cenarios/cenarioCavaleiro.png`, `outros/bolaDeCristal.png`, `outros/knightOfQuestions.png`. Além disso, `avatares/sem-upgrade/esqueloMantoNegro.png` parece ter um erro de digitação ("esquelo"). Esses arquivos serão renomeados depois. Ao renomear, atualize todos os `require` que apontam para eles.

### 7. Imports

- Use sempre o atalho **`@/`** (configurado no `tsconfig.json`, aponta para a raiz do front):

  ```ts
  import { Colors } from '@/constants/theme';   // certo
  import { Colors } from '../../constants/theme'; // evite
  ```

### 8. Hooks

- Lógica reutilizável (buscar dados, controlar formulário, tema...) vai para **`hooks/`**.
- O nome **sempre começa com `use`**: `useQuests`, `useAuth`.
  > Os hooks atuais do template usam kebab-case no nome do arquivo (`use-color-scheme.ts`). O nome da função exportada já segue o padrão (`useColorScheme`).

## Fluxo de Git

- **Um repositório para o front e outro para o back.**
  - Front: `https://github.com/marinrenascimento/quests-front.git`
  - Back: `https://github.com/marinrenascimento/quests-back.git`
- **Commits pequenos e frequentes**, cada um com uma mudança só.
- **Mensagens claras** dizendo o que mudou, por exemplo:
  - `Cria atom Button`
  - `Adiciona tela de login no grupo (auth)`
  - `Corrige cor do texto no tema escuro`
- **Nunca commitar:**
  - `node_modules/`
  - arquivos `.env` (senhas, chaves, URLs privadas)
- Antes de commitar, confira o que vai entrar:

  ```powershell
  git status
  git diff
  ```

> **Atenção:** o `.gitignore` do front ignora `node_modules/`, mas só ignora `.env*.local`. Um arquivo `.env` comum **não** está ignorado hoje, então tome cuidado com ele.

## Checklist: antes de criar uma funcionalidade nova

- [ ] Fiz `git pull` para pegar a versão mais recente.
- [ ] Sei qual(is) tela(s) em `app/` serão criadas ou alteradas e em qual grupo (`(auth)`, `(tabs)`...).
- [ ] Separei a interface em **atoms → molecules → organisms** e verifiquei se algum componente já existe para reaproveitar.
- [ ] Cada componente novo tem seu arquivo em **PascalCase**, com `type Props` declarado.
- [ ] Lógica reutilizável vai para um hook em `hooks/` começando com `use`.
- [ ] Cores novas vão para `constants/`, não direto no componente.
- [ ] Imagens novas estão em `assets/images/`, com nome em minúsculas e sem espaços.
- [ ] Listas usam `FlatList` + `keyExtractor`.
- [ ] Todo `useEffect` tem array de dependências.
- [ ] Imports usam `@/`.
- [ ] Se preciso de uma lib nova, instalo com `npx expo install` e confiro se funciona no Expo Go.
- [ ] Se vou chamar o back, uso o IP do PC (não `localhost`) e confirmei a rota com quem cuida do back.
- [ ] Rodei `npx expo lint` e `npx tsc --noEmit` sem erros.
- [ ] Testei no celular pelo Expo Go.
- [ ] Commits pequenos, com mensagens claras, sem `node_modules` nem `.env`.
