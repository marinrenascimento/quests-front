# Jogos: como o código está organizado

Guia para quem vai mexer na tela Jogos ou acrescentar um jogo. O que cada tela **deve fazer** está em `REGRAS_DE_NEGOCIO.md`, seções 13 e 14 (RN-270 em diante). Este arquivo explica **como o código faz**.

Os jogos são só do front: não há rota no back e nada é salvo. O que o back precisaria, se isso mudar, está em `quests-back/docs/RASCUNHO_BACKEND.md`, seção 7.8.

## Telas

```
Home  ──"Jogos"──>  /jogos  ──Elfo Matemático─────>  /jogos/elfo    ──"Jogar"──>  /jogos/elfo/jogar?dificuldade=medio
                    lista   ──Goblin Ortográfico──>  /jogos/goblin  ──"Jogar"──>  /jogos/goblin/jogar?dificuldade=medio
                            ──Caça-Palavras───────>  /jogos/mago    ──"Jogar"──>  /jogos/mago/jogar?dificuldade=medio
                                                     preparação                   partida (tela cheia, sem TopBar)
```

| Rota | Arquivo | Template |
|------|---------|----------|
| `/jogos` | `app/(tabs)/jogos/index.tsx` | `GamesTemplate` |
| `/jogos/elfo` | `app/(tabs)/jogos/elfo/index.tsx` | `GameSetupTemplate` |
| `/jogos/elfo/jogar` | `app/(tabs)/jogos/elfo/jogar.tsx` | `MathGameTemplate` |
| `/jogos/goblin` | `app/(tabs)/jogos/goblin/index.tsx` | `GameSetupTemplate` |
| `/jogos/goblin/jogar` | `app/(tabs)/jogos/goblin/jogar.tsx` | `SpellingGameTemplate` |
| `/jogos/mago` | `app/(tabs)/jogos/mago/index.tsx` | `GameSetupTemplate` |
| `/jogos/mago/jogar` | `app/(tabs)/jogos/mago/jogar.tsx` | `WordSearchTemplate` |

A partida recebe o nível pela rota: `dificuldade` é `facil`, `medio` ou `dificil`. Aberta sem nível válido (ex.: link direto), a partida usa `DEFAULT_GAME_DIFFICULTY`.

A pilha fica em `app/(tabs)/jogos/_layout.tsx`, e a aba é registrada em `app/(tabs)/_layout.tsx`, com `popToTopOnBlur`.

## O que os jogos compartilham

| Arquivo | O que faz |
|---------|-----------|
| `constants/games.ts` | Lista dos jogos, textos, níveis (`GameDifficulty`), valores de cada jogo e imagens. |
| `components/templates/GameSetupTemplate.tsx` | A preparação de um jogo: como jogar, a escolha do nível e "Jogar". Recebe os textos e os níveis por props. |
| `components/molecules/GameCard.tsx` | Um cartão da tela Jogos. |
| `components/molecules/GameStatusBar.tsx` | A barra do topo da partida: "Sair", vidas (opcional) e contagem. |
| `components/molecules/GameAnswerButton.tsx` | Um botão de resposta. `textVariant` escolhe a fonte: `pixel` para números e `word` para palavras. |
| `components/atoms/LivesIndicator.tsx` | Os corações. |
| `components/atoms/GameWordText.tsx` | Uma palavra com acentos, na fonte Lilita One. |

## Elfo Matemático

### Onde está cada coisa

| Arquivo | O que faz |
|---------|-----------|
| `utils/mathEquation.ts` | Sorteia a equação de cada nível e as 3 respostas. Sem React. |
| `hooks/useMathGame.ts` | Regras da partida: vidas, contagem, resposta certa ou errada, próximo monstro. O `mathGameReducer` não tem nada de tela. |
| `hooks/useMonsterWalk.ts` | Animação do monstro: caminhar, parar, retomar, aparecer e sumir. |
| `hooks/useAppActive.ts` | Avisa quando o app vai para segundo plano, para pausar. |
| `components/organisms/MathGameStage.tsx` | Desenha o cenário, o elfo, o monstro e a equação. |
| `components/organisms/MathGameHud.tsx` | Desenha a barra do topo e as respostas. |

### Como uma partida anda

Cada monstro passa por estas fases (`MathGamePhase`):

```
              resposta certa (+1 monstro)
 walking  ──────────────────────────────>  leaving  ──terminou de sumir──>  walking (monstro novo)
    │                                         ^                               ou over (sem vidas)
    └─────────── alcançou o elfo (-1 vida) ───┘
```

- **`walking`:** o monstro anda e as respostas valem. Resposta errada não muda a fase; ela só entra em `wrongOptions`.
- **`leaving`:** o monstro está sumindo. As respostas e a chegada ao elfo são ignoradas. É isso que evita perder vida depois de acertar, quando os dois acontecem juntos.
- **`over`:** sem vidas. A tela mostra o modal de fim de jogo.

Quem conversa com quem:

1. O `useMathGame` guarda o estado e entrega `monsterId` e `phase` para a tela.
2. O `useMonsterWalk` reage a eles: `monsterId` novo recomeça a caminhada, e `phase === 'leaving'` faz o monstro sumir.
3. Quando a animação termina, ele chama de volta `monsterReached` ou `monsterGone`, e o `useMathGame` decide o que vem depois.

A **animação é quem decide** que o monstro chegou: não existe um segundo cronômetro que possa discordar dela. Ela usa o `Animated` do React Native com `useNativeDriver`, na thread nativa, então não trava se o JS estiver ocupado.

### Pausa

`paused` vem da tela (modal de sair aberto ou app em segundo plano). Pausar para a animação e guarda o tempo que falta em `remainingMs`; continuar anima o resto do caminho nesse tempo. Assim, a velocidade não muda depois de uma pausa.

### Como ajustar

| Quero mudar | Onde |
|-------------|------|
| Vidas e tempo do monstro | `MATH_GAME_CONFIG` em `constants/games.ts` |
| Tipos de equação de um nível | `easy`, `medium` e `hard` em `utils/mathEquation.ts`, e o `hint` do nível em `MATH_DIFFICULTY_OPTIONS` |
| Distância das respostas erradas | `MAX_WRONG_DISTANCE` em `utils/mathEquation.ts` |
| Tamanho e posição dos personagens | Constantes no topo de `MathGameStage.tsx` |
| Altura do chão | `groundRatio` em `ELF_GAME_SCENE`, de 0 (topo do arquivo) a 1 (base) |

### Cuidados

- **Fonte pixel:** a Press Start 2P tem `×` e `÷`, mas não tem o sinal de menos `−` (U+2212). Por isso a subtração usa o hífen.
- **Imagens:** `elfoJogo.png` e `monstro.png` têm margem transparente. O recorte visível está em `constants/games.ts` (`content`); se o arquivo mudar, é preciso medir de novo.
- **Direção:** o elfo olha para a direita e o monstro para a esquerda, nos próprios arquivos. Nada é espelhado no código.
- **Chão:** o fundo é cortado como `cover`. A posição do chão é calculada em `groundBottom` (`MathGameStage.tsx`), para os personagens pisarem na grama em qualquer proporção de tela.

## Goblin Ortográfico

### Onde está cada coisa

| Arquivo | O que faz |
|---------|-----------|
| `constants/mockSpellingWords.ts` | As listas de palavras, uma por nível, com a versão do meio da tela e as opções erradas. |
| `utils/spellingRounds.ts` | Embaralha as palavras e as opções de cada uma. Sem React. |
| `hooks/useSpellingGame.ts` | Regras da partida: vidas, contagem e próxima palavra. O `spellingGameReducer` não tem nada de tela. |
| `components/organisms/SpellingGameBoard.tsx` | Desenha a barra do topo, as opções e a palavra do meio. |
| `components/templates/SpellingGameTemplate.tsx` | Desenha o cenário e o goblin, com o painel por cima. |

### Como uma partida anda

```
              opção certa (+1 palavra)                  0,7 s
 choosing  ───────────────────────────>  correct  ─────────────>  choosing (próxima palavra)
    │
    ├── opção errada, ainda com vidas: -1 vida, a opção vai para wrongOptions e a palavra continua
    └── opção errada, última vida: -1 vida e vai para over
```

O nível só decide qual lista entra: a tela passa `MOCK_SPELLING_WORDS[dificuldade]` para o `useSpellingGame`, que não sabe nada sobre níveis.

A partida guarda a lista embaralhada em `queue` e tira uma palavra por vez. Quando ela acaba, a próxima lista já vem pronta na ação `next` (`freshRounds`). Assim, o reducer não tem nada aleatório e pode ser testado sozinho.

Não há tempo correndo. Por isso, ao contrário do Elfo Matemático, este jogo não precisa de pausa nem de `useAppActive`: o único timer é o da pausa de 0,7 s depois de acertar.

### Como acrescentar palavras

Basta acrescentar uma linha na lista do nível, em `constants/mockSpellingWords.ts`:

```ts
{ correct: 'exibição', shown: 'essibissao', wrong: ['exibizão', 'ezibissão'] },
```

- `correct` é a escrita correta; `shown` aparece no meio da tela; `wrong` são as 2 opções erradas.
- As 4 formas precisam ser diferentes entre si, e a palavra fica em um nível só.
- Nenhuma forma errada pode ser uma palavra que existe (ex.: "sessão" como erro de "seção"), porque o jogador estaria certo.
- Escreva em minúsculas e confira se a palavra cabe no botão (até 14 letras cabem sem diminuir muito).

### Como ajustar

| Quero mudar | Onde |
|-------------|------|
| Vidas e pausa depois de acertar | `SPELLING_GAME_CONFIG` em `constants/games.ts` |
| Texto do que cai em cada nível | `SPELLING_DIFFICULTY_OPTIONS` em `constants/games.ts` |
| Tamanho e posição do goblin | Constantes no topo de `SpellingGameTemplate.tsx` |
| Tamanho da palavra e das opções | `WORD_SIZE` em `SpellingGameBoard.tsx` e `WORD_TEXT_SIZE` em `GameAnswerButton.tsx` |

### Cuidados

- **Fonte das palavras:** use sempre o `GameWordText`, nunca o `PixelText`. A fonte pixel escreve em caixa alta e quase não mostra os acentos, e aqui o acento faz parte da resposta.
- **Opções empilhadas:** a linha em volta de cada botão (`optionRow`) dá a largura ao `flex: 1` do `GameAnswerButton`. Sem ela, o botão perderia a altura numa coluna.
- **Leitor de tela:** ele lê a palavra errada e as opções como estão escritas, então a pronúncia pode não mostrar a diferença entre elas.

## Caça-Palavras

### Onde está cada coisa

| Arquivo | O que faz |
|---------|-----------|
| `constants/mockWordSearchQuestions.ts` | As perguntas, uma lista por nível. |
| `utils/wordSearch.ts` | Monta a grade (`buildPuzzle`), tira as perguntas da fila (`takeQuestions`) e calcula a linha reta de uma seleção (`lineCells`). Sem React. |
| `hooks/useWordSearchGame.ts` | Regras da partida: conferir a seleção, contagem e próximo caça-palavras. O `wordSearchReducer` não tem nada de tela. |
| `components/organisms/WordSearchGrid.tsx` | A grade e os gestos: arrastar e tocar. |
| `components/organisms/WordSearchBoard.tsx` | Desenha a barra do topo, as perguntas e a grade. |
| `components/molecules/WordSearchQuestionRow.tsx` | Uma pergunta, com a resposta depois de achada. |
| `components/atoms/WordSearchCell.tsx` | Uma casa da grade. |
| `components/templates/WordSearchTemplate.tsx` | Desenha o cenário e o mago, com o painel e o aviso por cima. |

### Como uma partida anda

```
              achou a 3ª resposta (+1 completo)                    2,5 s
 searching  ───────────────────────────────────>  completed  ─────────────>  searching (outro caça-palavras)
    │
    ├── achou a 1ª ou a 2ª resposta: as casas entram em foundCells
    └── seleção errada: as casas entram em missCells e saem depois de 0,4 s
```

A seleção é conferida pelas **letras**, nos dois sentidos, e não pela posição em que a resposta foi escondida. Assim, se as letras do preenchimento formarem a mesma palavra por acaso em outro lugar, ela também vale, porque o jogador não teria como saber qual é a "certa".

### O gesto

A grade usa o sistema de responder do React Native (`onResponderGrant`, `onResponderMove` e `onResponderRelease`), sem bibliotecas:

- **Coordenadas:** `pointerEvents="box-only"` faz os toques caírem sempre na grade, então `locationX` é relativo a ela. No arraste, a casa sai do começo do toque somado à distância em `pageX`, que funciona igual em todas as plataformas.
- **Arraste ou toque:** se o dedo soltar em outra casa, foi um arraste; na mesma casa, foi um toque, que fica guardado em `anchor` à espera do segundo.
- **Linha reta:** `lineCells` escolhe a reta mais próxima. Se o dedo andou o dobro numa direção, a linha fica nessa direção; senão, fica na diagonal.

### Como ajustar

| Quero mudar | Onde |
|-------------|------|
| Tamanho da grade e direções de um nível | `WORD_SEARCH_LEVELS` em `constants/games.ts`, e o texto em `WORD_SEARCH_DIFFICULTY_OPTIONS` |
| Quantidade de perguntas e pausas | `WORD_SEARCH_CONFIG` em `constants/games.ts` |
| Tamanho e posição do mago | Constantes no topo de `WordSearchTemplate.tsx` |

### Como acrescentar perguntas

Basta acrescentar uma linha na lista do nível, em `constants/mockWordSearchQuestions.ts`:

```ts
{ subject: 'biologia', question: 'Qual órgão bombeia o sangue pelo corpo?', answer: 'coração' },
```

- A resposta precisa ser **uma palavra só**, sem espaço nem hífen.
- Ela precisa caber na grade do nível: até 8 letras no Fácil, 10 no Médio e 12 no Difícil. Se não couber, `buildPuzzle` dá erro.
- Escreva a resposta com os acentos: a versão sem acentos da grade é gerada por `answerLetters`.
- Uma resposta não pode repetir nem estar dentro de outra do mesmo nível, e a pergunta não pode conter a resposta.

### Cuidados

- **Última letra do arraste:** ao soltar, a casa final sai do próprio evento, e os dados do gesto ficam numa ref. Num arraste rápido, o dedo solta antes de a tela desenhar o último movimento, e o estado `press` ainda teria a casa anterior. Por isso ele serve só para mostrar a seleção.
- **A grade não pode pular:** cada pergunta tem sempre a altura de 2 linhas (`WordSearchQuestionRow`). Sem isso, a grade desceria a cada resposta achada, com o jogador procurando nela.
- **Seleção de texto na web:** as casas usam `selectable={false}`. Sem isso, o navegador seleciona as letras, e o arraste seguinte vira "arrastar texto".
- **Leitor de tela:** o jogo não pode ser jogado com ele, porque a grade é um elemento só, sem casas individuais. As perguntas e as respostas são lidas, mas selecionar letras exige ver a grade.

## Como acrescentar um jogo

A tela Jogos mostra os 3 jogos da lista `GAMES`. Para acrescentar outro:

1. Registre as regras em `REGRAS_DE_NEGOCIO.md`, na seção 14, com o próximo ID livre.
2. Em `constants/games.ts`, acrescente o jogo em `GAMES`, com um `id` novo, e crie os textos dele.
3. Crie as rotas em `app/(tabs)/jogos/<jogo>/`. Se o jogo tiver níveis, a preparação é um `GameSetupTemplate` com os textos e os níveis dele, criados com `difficultyOptions`.
4. Em `app/(tabs)/jogos/index.tsx`, abra a rota nova em `handleGamePress`.
5. Na partida, siga o padrão de saída da RN-285: `GameStatusBar`, `useLeaveConfirm` e o `ConfirmModal`. Se houver tempo correndo, pause também com `useAppActive`.
6. Deixe as regras num reducer sem nada de tela, como `mathGameReducer`, `spellingGameReducer` e `wordSearchReducer`.

O `MathGameStage`, o `MathGameHud`, o `SpellingGameBoard`, o `WordSearchBoard` e os hooks de cada partida são específicos daquele jogo.

## Como testar à mão

Com `npx expo start`, abra o app e confira.

**Tela Jogos**

- [ ] Home > Jogos abre a lista, com os 3 jogos.

**Elfo Matemático**

- [ ] Na preparação, cada nível muda o texto do que cai.
- [ ] Resposta errada fica vermelha e não tira vida.
- [ ] Resposta certa faz o monstro sumir, soma 1 e traz outra equação.
- [ ] Sem responder, o monstro alcança o elfo em cerca de 12 s e tira 1 vida.
- [ ] Sem vidas, aparece "Fim de Jogo!"; "Jogar" recomeça no mesmo nível e "Sair" volta para a preparação.
- [ ] "Sair" sem progresso sai direto; com progresso, pergunta, e o monstro para enquanto o aviso está aberto.
- [ ] Mandar o app para segundo plano e voltar: o monstro continua de onde estava.

**Goblin Ortográfico**

- [ ] Na preparação, cada nível muda o texto do que cai, e a partida só traz palavras daquele nível.
- [ ] As palavras aparecem com os acentos visíveis, como em "exibição".
- [ ] Opção errada fica vermelha, tira 1 vida e a palavra continua; tocar nela de novo não tira outra vida.
- [ ] Opção certa fica verde, soma 1 e vem outra palavra.
- [ ] Sem vidas, aparece "Fim de Jogo!"; "Jogar" recomeça no mesmo nível e "Sair" volta para a preparação.
- [ ] "Sair" sem progresso sai direto; com progresso, pergunta.

**Caça-Palavras**

- [ ] Na preparação, cada nível muda o texto, e a grade tem 8, 10 ou 12 casas por lado.
- [ ] Arrastar da primeira à última letra acha a resposta, também de trás para a frente e rápido, sem perder a última letra.
- [ ] Tocar na primeira e na última letra também acha; tocar duas vezes na mesma casa desmarca.
- [ ] Seleção errada fica vermelha por um instante e não conta.
- [ ] Ao achar uma resposta, ela aparece abaixo da pergunta e a grade não sai do lugar.
- [ ] Ao achar as 3, aparece o aviso, a contagem sobe e vem outro caça-palavras sozinho.
- [ ] Arrastar na grade não rola nem volta a tela (no iOS, conferir perto da borda esquerda).
- [ ] "Sair" sem progresso sai direto; com progresso, pergunta.

**Nos jogos em geral**

- [ ] No Android, o botão de voltar segue as mesmas regras do "Sair".
- [ ] No iOS, com progresso, o gesto de voltar por deslize fica desligado.
