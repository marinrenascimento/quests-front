import type { ImageSourcePropType } from 'react-native';

import type { IconName } from '@/constants/helpContent';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

// Regras dos jogos: docs/REGRAS_DE_NEGOCIO.md, seção 13 (RN-270 em diante).
// Como o código está organizado e como acrescentar um jogo: docs/JOGOS.md.

/** Um jogo da tela Jogos */
export type GameInfo = {
  id: 'elfo-matematico' | 'caca-palavras' | 'quiz-relampago';
  name: string;
  /** Uma frase sobre o jogo, mostrada no cartão */
  description: string;
  /** Imagem do cartão, sem a margem transparente do arquivo */
  image: TrimmedImageSpec;
  /** false: o cartão mostra "Em Breve" e o toque só avisa (o jogo ainda não foi feito) */
  available: boolean;
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

/** As 3 opções da tela Jogos, na ordem da lista */
export const GAMES: GameInfo[] = [
  {
    id: 'elfo-matematico',
    name: 'Elfo Matemático',
    description: 'Resolva as equações para impedir que os monstros alcancem o elfo.',
    image: ELF_IMAGE,
    available: true,
  },
  // Os dois abaixo são os jogos citados na ajuda (Help > Estudos). Nomes, descrições e imagens são
  // provisórios até o grupo descrever os jogos (RN-273).
  {
    id: 'caca-palavras',
    name: 'Caça-Palavras',
    description: 'Encontre as palavras escondidas na grade de letras.',
    image: {
      source: require('@/assets/images/jogos/goblinJogo.png'),
      imageSize: { width: 1448, height: 1086 },
      content: { x: 234, y: 46, width: 1091, height: 1007 },
    },
    available: false,
  },
  {
    id: 'quiz-relampago',
    name: 'Quiz Relâmpago',
    description: 'Responda às perguntas o mais rápido que conseguir.',
    image: {
      source: require('@/assets/images/outros/dragao.png'),
      imageSize: { width: 1536, height: 1024 },
      content: { x: 448, y: 158, width: 688, height: 620 },
    },
    available: false,
  },
];

/** Textos da tela Jogos (o título é exibido em caixa alta pelo componente) */
export const GAMES_CONTENT = {
  title: 'Jogos',
  comingSoonLabel: 'Em Breve',
  /** Toque num jogo que ainda não foi feito */
  comingSoonToast: 'Esse Jogo Estará Disponível em Breve!',
};

/** Nível de dificuldade do Elfo Matemático: muda só o tipo de equação (RN-278) */
export type MathDifficulty = 'facil' | 'medio' | 'dificil';

/** Dificuldade que já vem escolhida na preparação do jogo */
export const DEFAULT_MATH_DIFFICULTY: MathDifficulty = 'facil';

/** Estrelas do seletor de dificuldade: a mesma escala das questões (RN-156) */
export const MATH_DIFFICULTY_MAX_STARS = 5;

/** Opções do seletor de dificuldade, da mais fácil para a mais difícil */
export const MATH_DIFFICULTY_OPTIONS: {
  value: MathDifficulty;
  label: string;
  stars: number;
  accessibilityLabel: string;
  /** O que cai nesse nível, mostrado abaixo do seletor */
  hint: string;
}[] = [
  {
    value: 'facil',
    label: 'Fácil',
    stars: 1,
    accessibilityLabel: 'Dificuldade Fácil, 1 de 5 estrelas',
    hint: 'Somas e subtrações até 20. Ex.: 7 + 5 = ?',
  },
  {
    value: 'medio',
    label: 'Médio',
    stars: 3,
    accessibilityLabel: 'Dificuldade Médio, 3 de 5 estrelas',
    hint: 'Multiplicações, divisões e contas até 99. Ex.: 6 × 7 = ?',
  },
  {
    value: 'dificil',
    label: 'Difícil',
    stars: 5,
    accessibilityLabel: 'Dificuldade Difícil, 5 de 5 estrelas',
    hint: 'Equações em que é preciso achar o x. Ex.: 3x + 4 = 19',
  },
];

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

/** Textos do Elfo Matemático: preparação e partida */
export const MATH_GAME_CONTENT = {
  title: 'Elfo Matemático',
  howToTitle: 'Como Jogar',
  /** Um parágrafo por item */
  howTo: [
    'Um monstro por vez caminha na direção do elfo, com uma equação em cima da cabeça.',
    'Toque na resposta certa, no topo da tela, para o monstro desaparecer.',
    'Se o monstro alcançar o elfo, você perde 1 das 3 vidas. Sem vidas, o jogo acaba.',
  ],
  difficultyLabel: 'Nível de Dificuldade',
  starIcon: 'star' as IconName,
  starOutlineIcon: 'star-outline' as IconName,
  playLabel: 'Jogar',
  exitLabel: 'Sair',
  exitIcon: 'logout' as IconName,
  /** Contagem durante a partida (exibida em caixa alta) */
  scoreLabels: { one: 'Monstro', other: 'Monstros' },
  /** Lido pelo leitor de tela: a contagem na tela não diz o que os monstros têm */
  scoreAccessibilityLabel: (score: number) => `Monstros derrotados: ${score}`,
  livesLabel: (lives: number, total: number) => `Vidas: ${lives} de ${total}`,
  answerLabel: (value: number) => `Resposta ${value}`,
  equationLabel: (text: string) => `Equação: ${text}`,
  lifeIcon: 'heart' as IconName,
  lifeLostIcon: 'heart-outline' as IconName,
};

export type MathGameContent = typeof MATH_GAME_CONTENT;

/** Modal ao sair da partida com algo a perder (RN-285) */
export const EXIT_GAME_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Sair do Jogo?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal do fim da partida, sem vidas (o destaque é a quantidade de monstros derrotados) */
export const GAME_OVER_CONTENT = {
  title: 'Fim de Jogo!',
  highlightLabels: { one: 'Monstro Derrotado', other: 'Monstros Derrotados' },
  /** Curto: os botões do modal são estreitos */
  playAgainLabel: 'Jogar',
  exitLabel: 'Sair',
};

/** Confere o nível recebido pela rota */
export function isMathDifficulty(value: unknown): value is MathDifficulty {
  return MATH_DIFFICULTY_OPTIONS.some((option) => option.value === value);
}
