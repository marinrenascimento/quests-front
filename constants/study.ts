import { ImageSourcePropType } from 'react-native';

import type { IconName } from '@/constants/helpContent';

/** Dificuldade que o usuário pode marcar em cada card durante a revisão */
export type Difficulty = 'facil' | 'medio' | 'dificil' | 'impossivel';

export type DifficultyConfig = {
  value: Difficulty;
  /** Nome exibido (em caixa alta pelo componente) */
  label: string;
  icon: IconName;
  /** Rótulo de acessibilidade do botão */
  accessibilityLabel: string;
};

/** Opções de dificuldade, na ordem da tela (da mais fácil para a mais difícil) */
export const DIFFICULTY_OPTIONS: DifficultyConfig[] = [
  {
    value: 'facil',
    label: 'Fácil',
    icon: 'emoticon-happy-outline',
    accessibilityLabel: 'Dificuldade Fácil',
  },
  {
    value: 'medio',
    label: 'Médio',
    icon: 'emoticon-outline',
    accessibilityLabel: 'Dificuldade Média',
  },
  {
    value: 'dificil',
    label: 'Difícil',
    icon: 'emoticon-neutral-outline',
    accessibilityLabel: 'Dificuldade Difícil',
  },
  {
    value: 'impossivel',
    label: 'Impossível',
    icon: 'emoticon-sad-outline',
    accessibilityLabel: 'Dificuldade Impossível',
  },
];

/** Textos e ícones da tela de revisão de um deck (os rótulos são exibidos em caixa alta) */
export const STUDY_CONTENT = {
  endLabel: 'Encerrar Revisão',
  /** Rótulos do canto do card: em inglês, como no mockup */
  frontTag: 'Front',
  backTag: 'Back',
  /** Rótulo do card quando o deck não tem cards */
  endTag: 'Fim',
  /** Fim da revisão: texto do card e botão do cabeçalho (volta para os cards do deck) */
  completedTitle: 'Revisão Concluída!',
  completedEndLabel: 'Voltar para o Início',
  emptyMessage: 'Nenhum Card para Revisar',
  notFoundMessage: 'Deck Não Encontrado',
  flipIcon: 'sync' as IconName,
  flipLabel: 'Virar Card',
  nextIcon: 'arrow-right-bold' as IconName,
  nextLabel: 'Próximo Card',
};

export type StudyContent = typeof STUDY_CONTENT;

/**
 * Modal de confirmação ao encerrar uma revisão em andamento (o destaque é o nome do deck).
 * O título segue o mockup ("do card"), embora o nome mostrado seja o do deck.
 */
export const END_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Encerrar a Revisão do Card:',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Imagem com a proporção do arquivo (largura / altura) */
export type SizedImage = { source: ImageSourcePropType; aspectRatio: number };

/** Imagem do card de fim da revisão: o mesmo baú de Meus Decks (bau.png, 1410 x 1115 px) */
export const COMPLETED_IMAGE: SizedImage = {
  source: require('@/assets/images/outros/bau.png'),
  aspectRatio: 1410 / 1115,
};
