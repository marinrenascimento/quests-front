import type { ImageSourcePropType } from 'react-native';

import type { IconName } from '@/constants/helpContent';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

// Regras dos jogos: docs/REGRAS_DE_NEGOCIO.md, seção 13 (RN-270 em diante).
// Como o código está organizado e como acrescentar um jogo: docs/JOGOS.md.

/** Um jogo da tela Jogos */
export type GameInfo = {
  id: 'elfo-matematico' | 'goblin-ortografico' | 'mago-da-ciencia';
  name: string;
  /** Uma frase sobre o jogo, mostrada no cartão */
  description: string;
  /** Personagem da vitrine e do ícone, sem a margem transparente do arquivo */
  image: TrimmedImageSpec;
  /** Cenário atrás do personagem, na vitrine e no ícone */
  background: ImageSourcePropType;
};

/** Elfo do jogo Elfo Matemático (elfoJogo.png): olha e aponta o arco para a direita */
const ELF_IMAGE: TrimmedImageSpec = {
  source: require('@/assets/images/jogos/elfoJogo.png'),
  imageSize: { width: 1364, height: 1153 },
  content: { x: 352, y: 162, width: 931, height: 971 },
};

/** Monstro do jogo Elfo Matemático (monstro.png): olha para a esquerda, na direção do elfo */
const MONSTER_IMAGE: TrimmedImageSpec = {
  source: require('@/assets/images/jogos/monstro.png'),
  imageSize: { width: 1536, height: 1024 },
  content: { x: 34, y: 120, width: 1477, height: 863 },
};

/** Goblin do jogo Goblin Ortográfico (goblinJogo.png): sentado à mesa, escrevendo */
const GOBLIN_IMAGE: TrimmedImageSpec = {
  source: require('@/assets/images/jogos/goblinJogo.png'),
  imageSize: { width: 1448, height: 1086 },
  content: { x: 234, y: 46, width: 1091, height: 1007 },
};

/** Mago do jogo Mago da Ciência (magoJogo.png): olha para a direita, lendo um livro */
const MAGE_IMAGE: TrimmedImageSpec = {
  source: require('@/assets/images/jogos/magoJogo.png'),
  imageSize: { width: 1086, height: 1448 },
  content: { x: 52, y: 88, width: 955, height: 1297 },
};

/** As 3 opções da tela Jogos, na ordem da lista */
export const GAMES: GameInfo[] = [
  {
    id: 'elfo-matematico',
    name: 'Elfo Matemático',
    description: 'Resolva as equações para impedir que os monstros alcancem o elfo.',
    image: ELF_IMAGE,
    background: require('@/assets/images/cenarios/cenarioElfo.png'),
  },
  {
    id: 'goblin-ortografico',
    name: 'Goblin Ortográfico',
    description: 'Ache a escrita certa de cada palavra antes que as vidas acabem.',
    image: GOBLIN_IMAGE,
    background: require('@/assets/images/cenarios/cenarioGoblin.png'),
  },
  {
    id: 'mago-da-ciencia',
    name: 'Mago da Ciência',
    description:
      'Responda às perguntas de ciências da natureza, biologia e química, achando as respostas na grade.',
    image: MAGE_IMAGE,
    background: require('@/assets/images/cenarios/cenarioMago.png'),
  },
];

/** Textos da tela Jogos (o título é exibido em caixa alta pelo componente) */
export const GAMES_CONTENT = {
  title: 'Jogos',
  /** Ícone de baixo: mostra o jogo no quadrado grande */
  showGameLabel: (name: string) => `Mostrar ${name}`,
  /** Lido pelo leitor de tela no quadrado grande */
  playHint: (description: string) => `${description} Toque para abrir o jogo.`,
};

/**
 * Partidas do Elfo Matemático e do Goblin Ortográfico (RN-313): a cada 6 acertos o jogador completa
 * uma partida, que dá 1 ponto. A partida é o nível dentro do jogo, sem relação com o nível do app.
 */
export const GAME_MATCH_CONFIG = {
  /** Monstros derrotados ou palavras corrigidas em cada partida */
  itemsPerMatch: 6,
  pointsPerMatch: 1,
};

/** Textos iguais nos jogos com partidas */
const GAME_MATCH_CONTENT = {
  matchLabel: 'Partida',
  /** Lido pelo leitor de tela no número da partida */
  matchAccessibilityLabel: (match: number) => `Partida ${match}`,
  /** Frase do modal de fim de jogo */
  pointsEarnedLabels: { one: 'Ponto Ganho', other: 'Pontos Ganhos' },
};

/**
 * Nível de dificuldade de um jogo. Muda só o desafio: o tipo de equação no Elfo Matemático
 * (RN-278), as palavras no Goblin Ortográfico (RN-301) e as perguntas e a grade no Mago da Ciência
 * (RN-305).
 */
export type GameDifficulty = 'facil' | 'medio' | 'dificil';

/** Dificuldade que já vem escolhida na preparação de um jogo */
export const DEFAULT_GAME_DIFFICULTY: GameDifficulty = 'facil';

/** Estrelas do seletor de dificuldade: a mesma escala das questões (RN-156) */
export const GAME_DIFFICULTY_MAX_STARS = 5;

/** Uma opção do seletor de dificuldade */
export type GameDifficultyOption = {
  value: GameDifficulty;
  label: string;
  stars: number;
  accessibilityLabel: string;
  /** O que cai nesse nível, mostrado abaixo do seletor */
  hint: string;
};

/** Os 3 níveis, da mais fácil para a mais difícil, com o que cai em cada um naquele jogo */
function difficultyOptions(hints: Record<GameDifficulty, string>): GameDifficultyOption[] {
  return [
    {
      value: 'facil',
      label: 'Fácil',
      stars: 1,
      accessibilityLabel: 'Dificuldade Fácil, 1 de 5 estrelas',
      hint: hints.facil,
    },
    {
      value: 'medio',
      label: 'Médio',
      stars: 3,
      accessibilityLabel: 'Dificuldade Médio, 3 de 5 estrelas',
      hint: hints.medio,
    },
    {
      value: 'dificil',
      label: 'Difícil',
      stars: 5,
      accessibilityLabel: 'Dificuldade Difícil, 5 de 5 estrelas',
      hint: hints.dificil,
    },
  ];
}

/** Níveis do Elfo Matemático */
export const MATH_DIFFICULTY_OPTIONS = difficultyOptions({
  facil: 'Contas de mais, menos e vezes. Ex.: 7 + 5 = ? e 3 × 4 = ?',
  medio:
    'Contas com até 4 números, sem variáveis, raízes ou potências. Faça × e ÷ primeiro. Ex.: 3 + 4 × 2 - 1 = ?',
  dificil: 'Equações com x, potências e raízes. Ex.: 3x + 4 = 19, 5² = ?, √49 = ? e ³√27 = ?',
});

/** Níveis do Goblin Ortográfico */
export const SPELLING_DIFFICULTY_OPTIONS = difficultyOptions({
  facil: 'Palavras do dia a dia. Ex.: cachorro',
  medio: 'Palavras com s, z, x e ç que confundem. Ex.: exibição',
  dificil: 'Palavras longas ou pouco comuns. Ex.: ascensão',
});

/** Níveis do Mago da Ciência */
export const WORD_SEARCH_DIFFICULTY_OPTIONS = difficultyOptions({
  facil: 'Perguntas básicas e grade 8 x 8, com as respostas na horizontal e na vertical.',
  medio: 'Perguntas médias e grade 10 x 10, com as respostas também na diagonal.',
  dificil: 'Perguntas difíceis e grade 12 x 12, com as respostas também de trás para a frente.',
});

/**
 * Valores do Elfo Matemático: é aqui que o jogo fica mais fácil ou mais difícil de vencer.
 * O tempo é o mesmo em todos os níveis (RN-278).
 */
export const MATH_GAME_CONFIG = {
  /** Vidas no início da partida */
  lives: 3,
  /** Respostas oferecidas para cada equação (a certa e as erradas) */
  optionsCount: 3,
  /** Quanto o monstro leva para alcançar o elfo, em ms */
  crossingMs: 12000,
  /** Quanto o monstro leva para aparecer e para sumir, em ms */
  fadeMs: 300,
};

/** Cenário do Elfo Matemático: o fundo, os personagens e a altura do chão */
export type GameScene = {
  background: ImageSourcePropType;
  /** Tamanho do arquivo do fundo, em pixels (para achar o chão depois do corte de "cover") */
  backgroundSize: { width: number; height: number };
  /** Altura onde os personagens pisam, de 0 (topo do arquivo) a 1 (base do arquivo) */
  groundRatio: number;
  elf: TrimmedImageSpec;
  monster: TrimmedImageSpec;
};

export const ELF_GAME_SCENE: GameScene = {
  background: require('@/assets/images/jogos/cenarioJogoElfo.png'),
  backgroundSize: { width: 940, height: 1672 },
  // A grama de cenarioJogoElfo.png
  groundRatio: 0.805,
  elf: ELF_IMAGE,
  monster: MONSTER_IMAGE,
};

/** Textos iguais em todos os jogos: a barra do topo da partida */
const GAME_STATUS_CONTENT = {
  exitLabel: 'Sair',
  exitIcon: 'logout' as IconName,
  livesLabel: (lives: number, total: number) => `Vidas: ${lives} de ${total}`,
  lifeIcon: 'heart' as IconName,
  lifeLostIcon: 'heart-outline' as IconName,
};

/** Textos iguais em todos os jogos: a tela de preparação */
const GAME_SETUP_CONTENT = {
  howToTitle: 'Como Jogar',
  difficultyLabel: 'Nível de Dificuldade',
  starIcon: 'star' as IconName,
  starOutlineIcon: 'star-outline' as IconName,
  playLabel: 'Jogar',
};

/** O que a tela de preparação usa dos textos de um jogo */
export type GameSetupContent = typeof GAME_SETUP_CONTENT & {
  title: string;
  /** Um parágrafo por item */
  howTo: string[];
};

/** Textos do Elfo Matemático: preparação e partida */
export const MATH_GAME_CONTENT = {
  ...GAME_STATUS_CONTENT,
  ...GAME_SETUP_CONTENT,
  ...GAME_MATCH_CONTENT,
  title: 'Elfo Matemático',
  howTo: [
    'Um monstro por vez caminha na direção do elfo, com uma equação em cima da cabeça.',
    'Toque na resposta certa, no topo da tela, para o monstro desaparecer.',
    'A cada 6 monstros derrotados, você completa uma partida e ganha 1 ponto.',
    'Se o monstro alcançar o elfo, você perde 1 das 3 vidas. Sem vidas, o jogo acaba.',
  ],
  /** Progresso na partida (exibido em caixa alta): "3/6 Monstros" */
  progressLabel: (done: number, total: number) => `${done}/${total} Monstros`,
  /** Lido pelo leitor de tela: a contagem na tela não diz o que os monstros têm */
  progressAccessibilityLabel: (done: number, total: number) =>
    `Monstros derrotados nesta partida: ${done} de ${total}`,
  answerLabel: (value: number) => `Resposta ${value}`,
  equationLabel: (text: string) => `Equação: ${text}`,
};

export type MathGameContent = typeof MATH_GAME_CONTENT;

/**
 * Uma palavra do Goblin Ortográfico. As 4 formas são sempre diferentes entre si: `shown` não é uma
 * das opções (o jogador não acerta só por eliminação).
 */
export type SpellingWord = {
  /** A escrita correta */
  correct: string;
  /** A versão errada, mostrada no meio da tela */
  shown: string;
  /** As 2 opções erradas, mostradas junto com a correta */
  wrong: [string, string];
};

/** Valores do Goblin Ortográfico */
export const SPELLING_GAME_CONFIG = {
  /** Vidas no início da partida */
  lives: 3,
  /** Quanto a resposta certa fica verde antes da próxima palavra, em ms */
  correctPauseMs: 700,
};

/** Cenário do Goblin Ortográfico: o fundo e o goblin, no canto inferior */
export const GOBLIN_GAME_SCENE = {
  background: require('@/assets/images/jogos/cenarioJogoGoblin.png') as ImageSourcePropType,
  goblin: GOBLIN_IMAGE,
};

/** Textos do Goblin Ortográfico: preparação e partida */
export const SPELLING_GAME_CONTENT = {
  ...GAME_STATUS_CONTENT,
  ...GAME_SETUP_CONTENT,
  ...GAME_MATCH_CONTENT,
  title: 'Goblin Ortográfico',
  howTo: [
    'No meio da tela aparece uma palavra escrita errado.',
    'Acima dela há 3 opções, e só uma está escrita da forma certa. Toque nela para ir para a próxima palavra.',
    'A cada 6 palavras certas, você completa uma partida e ganha 1 ponto.',
    'Cada opção errada tira 1 das 3 vidas. Sem vidas, o jogo acaba.',
  ],
  /** Acima da palavra errada */
  prompt: 'Qual é a Escrita Certa?',
  /** Progresso na partida (exibido em caixa alta): "3/6 Palavras" */
  progressLabel: (done: number, total: number) => `${done}/${total} Palavras`,
  progressAccessibilityLabel: (done: number, total: number) =>
    `Palavras corrigidas nesta partida: ${done} de ${total}`,
  optionLabel: (word: string) => `Opção ${word}`,
  shownLabel: (word: string) => `Palavra errada: ${word}`,
  /** Destaque do modal de fim de jogo */
  gameOverLabels: { one: 'Palavra Corrigida', other: 'Palavras Corrigidas' },
};

export type SpellingGameContent = typeof SPELLING_GAME_CONTENT;

/** Uma pergunta do Mago da Ciência: a resposta é uma palavra só, escondida na grade */
export type WordSearchQuestion = {
  subject: 'biologia' | 'quimica';
  question: string;
  /** A resposta como é escrita (ex.: "coração"); na grade, ela fica em maiúsculas e sem acentos */
  answer: string;
};

/** Direção de uma palavra na grade: quanto a linha e a coluna mudam a cada letra */
export type WordDirection = readonly [row: number, column: number];

const RIGHT: WordDirection = [0, 1];
const DOWN: WordDirection = [1, 0];
const DOWN_RIGHT: WordDirection = [1, 1];
const DOWN_LEFT: WordDirection = [1, -1];
const LEFT: WordDirection = [0, -1];
const UP: WordDirection = [-1, 0];
const UP_LEFT: WordDirection = [-1, -1];
const UP_RIGHT: WordDirection = [-1, 1];

/** A grade de um nível: lados e direções das palavras (RN-305) */
export type WordSearchLevel = {
  size: number;
  directions: readonly WordDirection[];
};

export const WORD_SEARCH_LEVELS: Record<GameDifficulty, WordSearchLevel> = {
  facil: { size: 8, directions: [RIGHT, DOWN] },
  medio: { size: 10, directions: [RIGHT, DOWN, DOWN_RIGHT, DOWN_LEFT] },
  dificil: {
    size: 12,
    directions: [RIGHT, DOWN, DOWN_RIGHT, DOWN_LEFT, LEFT, UP, UP_LEFT, UP_RIGHT],
  },
};

/** Valores do Mago da Ciência */
export const WORD_SEARCH_CONFIG = {
  /** Perguntas em cada caça-palavras */
  questionsPerPuzzle: 3,
  /** Quanto o caça-palavras completo fica na tela antes do próximo, em ms (o tempo do aviso) */
  completedPauseMs: 2500,
  /** Quanto uma seleção errada fica vermelha, em ms */
  missFlashMs: 400,
};

/** Cenário do Mago da Ciência: o fundo e o mago, no canto inferior */
export const MAGE_GAME_SCENE = {
  background: require('@/assets/images/jogos/cenarioJogoMago.png') as ImageSourcePropType,
  mage: MAGE_IMAGE,
};

/** Textos do Mago da Ciência: preparação e partida */
export const WORD_SEARCH_CONTENT = {
  ...GAME_STATUS_CONTENT,
  ...GAME_SETUP_CONTENT,
  title: 'Mago da Ciência',
  howTo: [
    'Cada caça-palavras tem 3 perguntas de ciências da natureza, de biologia ou química, e as respostas estão escondidas na grade.',
    'Arraste da primeira até a última letra da resposta, ou toque nas duas.',
    'Não há vidas nem tempo. Ao achar as 3 respostas, vem o próximo caça-palavras.',
  ],
  /** Contagem durante a partida (exibida em caixa alta) */
  scoreLabels: { one: 'Completo', other: 'Completos' },
  scoreAccessibilityLabel: (score: number) => `Caça-palavras completos: ${score}`,
  /** Aviso ao achar as 3 respostas */
  completedToast: 'Caça-Palavras Completo!',
  questionLabel: (position: number, question: string, answer?: string) =>
    answer
      ? `Pergunta ${position}: ${question} Resposta encontrada: ${answer}`
      : `Pergunta ${position}: ${question}`,
  gridLabel: (size: number) => `Caça-palavras de ${size} por ${size} letras`,
  foundIcon: 'check-circle' as IconName,
};

export type WordSearchContent = typeof WORD_SEARCH_CONTENT;

/** Modal ao sair da partida com algo a perder (RN-285, RN-295 e RN-307) */
export const EXIT_GAME_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Sair do Jogo?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/**
 * Modal do fim da partida, sem vidas. O destaque é a contagem: `highlightLabels` é a do Elfo
 * Matemático, e o Goblin Ortográfico usa SPELLING_GAME_CONTENT.gameOverLabels.
 */
export const GAME_OVER_CONTENT = {
  title: 'Fim de Jogo!',
  highlightLabels: { one: 'Monstro Derrotado', other: 'Monstros Derrotados' },
  /** Curto: os botões do modal são estreitos */
  playAgainLabel: 'Jogar',
  exitLabel: 'Sair',
};

/** Confere o nível recebido pela rota */
export function isGameDifficulty(value: unknown): value is GameDifficulty {
  return value === 'facil' || value === 'medio' || value === 'dificil';
}
