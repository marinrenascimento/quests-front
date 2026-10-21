/** Níveis do ranking que têm ícone em assets/images/niveis. */
export type RankLevel = 'diamante' | 'esmeralda' | 'rubi' | 'ametista' | 'bronze';

/** Nome exibido de cada nível (único lugar com esse mapeamento). */
export const RANK_LEVEL_LABELS: Record<RankLevel, string> = {
  diamante: 'DIAMANTE',
  esmeralda: 'ESMERALDA',
  rubi: 'RUBI',
  ametista: 'AMETISTA',
  bronze: 'BRONZE',
};

/** Um jogador no ranking. */
export type RankingEntry = {
  id: string;
  position: number;
  name: string;
  points: number;
  level: RankLevel;
};
