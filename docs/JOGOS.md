# Jogos: como o código está organizado

Guia para quem vai mexer na tela Jogos ou acrescentar um jogo. O que cada tela **deve fazer** está em `REGRAS_DE_NEGOCIO.md`, seção 13 (RN-270 em diante). Este arquivo explica **como o código faz**.

Os jogos são só do front: não há rota no back e nada é salvo. O que o back precisaria, se isso mudar, está em `quests-back/docs/RASCUNHO_BACKEND.md`, seção 7.8.

## Telas

```
Home  ──"Jogos"──>  /jogos  ──Elfo Matemático──>  /jogos/elfo  ──"Jogar"──>  /jogos/elfo/jogar?dificuldade=medio
                    lista dos 3 jogos             preparação                 partida (tela cheia, sem TopBar)
```

| Rota | Arquivo | Template |
|------|---------|----------|
| `/jogos` | `app/(tabs)/jogos/index.tsx` | `GamesTemplate` |
| `/jogos/elfo` | `app/(tabs)/jogos/elfo/index.tsx` | `MathGameSetupTemplate` |
| `/jogos/elfo/jogar` | `app/(tabs)/jogos/elfo/jogar.tsx` | `MathGameTemplate` |

A pilha fica em `app/(tabs)/jogos/_layout.tsx`, e a aba é registrada em `app/(tabs)/_layout.tsx`, com `popToTopOnBlur`.

## Elfo Matemático

### Onde está cada coisa

| Arquivo | O que faz |
|---------|-----------|
| `constants/games.ts` | Lista dos jogos, textos, níveis, imagens e `MATH_GAME_CONFIG` (vidas, tempo do monstro). |
| `utils/mathEquation.ts` | Sorteia a equação de cada nível e as 3 respostas. Sem React. |
| `hooks/useMathGame.ts` | Regras da partida: vidas, contagem, resposta certa ou errada, próximo monstro. O `mathGameReducer` não tem nada de tela. |
| `hooks/useMonsterWalk.ts` | Animação do monstro: caminhar, parar, retomar, aparecer e sumir. |
| `hooks/useAppActive.ts` | Avisa quando o app vai para segundo plano, para pausar. |
| `components/organisms/MathGameStage.tsx` | Desenha o cenário, o elfo, o monstro e a equação. |
| `components/organisms/MathGameHud.tsx` | Desenha "Sair", as vidas, a contagem e as respostas. |
| `components/molecules/GameAnswerButton.tsx` | Um botão de resposta. |
| `components/molecules/GameCard.tsx` | Um cartão da tela Jogos. |
| `components/atoms/LivesIndicator.tsx` | Os corações. |

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

Toda mudança de comportamento deve ser registrada também em `REGRAS_DE_NEGOCIO.md`.

### Cuidados

- **Fonte pixel:** a Press Start 2P tem `×` e `÷`, mas não tem o sinal de menos `−` (U+2212). Por isso a subtração usa o hífen.
- **Imagens:** `elfoJogo.png` e `monstro.png` têm margem transparente. O recorte visível está em `constants/games.ts` (`content`); se o arquivo mudar, é preciso medir de novo.
- **Direção:** o elfo olha para a direita e o monstro para a esquerda, nos próprios arquivos. Nada é espelhado no código.
- **Chão:** o fundo é cortado como `cover`. A posição do chão é calculada em `groundBottom` (`MathGameStage.tsx`), para os personagens pisarem na grama em qualquer proporção de tela.

## Como acrescentar um jogo

Caça-Palavras e Quiz Relâmpago já têm cartão, com `available: false`. Quando um deles for definido:

1. Registre as regras em `REGRAS_DE_NEGOCIO.md`, seção 13, e ajuste a RN-273.
2. Em `constants/games.ts`, troque para `available: true` e ajuste o nome, a descrição e a imagem.
3. Crie as rotas em `app/(tabs)/jogos/<jogo>/`.
4. Em `app/(tabs)/jogos/index.tsx`, abra a rota nova em `handleGamePress`.
5. Na partida, siga o padrão de saída da RN-285: `useLeaveConfirm`, o `ConfirmModal` e a pausa com `useAppActive`.

O `GameCard`, o `GameAnswerButton` e o `LivesIndicator` não dependem do Elfo Matemático e podem ser reaproveitados. Já o `MathGameStage`, o `MathGameHud` e o `useMathGame` são específicos desse jogo.

## Como testar à mão

Com `npx expo start`, abra o app e confira:

- [ ] Home > Jogos abre a lista; Caça-Palavras e Quiz Relâmpago só mostram o aviso.
- [ ] Na preparação, cada nível muda o texto do que cai.
- [ ] Resposta errada fica vermelha e não tira vida.
- [ ] Resposta certa faz o monstro sumir, soma 1 e traz outra equação.
- [ ] Sem responder, o monstro alcança o elfo em cerca de 12 s e tira 1 vida.
- [ ] Sem vidas, aparece "Fim de Jogo!"; "Jogar" recomeça no mesmo nível e "Sair" volta para a preparação.
- [ ] "Sair" sem progresso sai direto; com progresso, pergunta, e o monstro para enquanto o aviso está aberto.
- [ ] Mandar o app para segundo plano e voltar: o monstro continua de onde estava.
- [ ] No Android, o botão de voltar segue as mesmas regras do "Sair".
