/** Faixas de nível do ranking, cada uma com ícone em assets/images/niveis. */
export type RankLevel =
  | 'bronze'
  | 'prata'
  | 'ouro'
  | 'ametista'
  | 'rubi'
  | 'esmeralda'
  | 'diamante';

/** Nome exibido de cada faixa (único lugar com esse mapeamento). */
export const RANK_LEVEL_LABELS: Record<RankLevel, string> = {
  bronze: 'BRONZE',
  prata: 'PRATA',
  ouro: 'OURO',
  ametista: 'AMETISTA',
  rubi: 'RUBI',
  esmeralda: 'ESMERALDA',
  diamante: 'DIAMANTE',
};

/** Moedas para subir um nível (nível 1: 1.000 moedas; nível 20: 20.000) */
export const COINS_PER_LEVEL = 1000;
/** Último nível: acima dele as moedas continuam contando, mas o nível fica parado */
export const MAX_LEVEL = 20;
/** Níveis em cada faixa: 0 a 2 Bronze, 3 a 5 Prata, ... 18 a 20 Diamante */
const LEVELS_PER_TIER = 3;

/** Faixas na ordem dos níveis, da primeira à última */
const RANK_LEVEL_ORDER: RankLevel[] = [
  'bronze',
  'prata',
  'ouro',
  'ametista',
  'rubi',
  'esmeralda',
  'diamante',
];

/** Nível (0 a 20) de quem tem essa quantidade de moedas */
export function levelForCoins(coins: number): number {
  return Math.min(MAX_LEVEL, Math.max(0, Math.floor(coins / COINS_PER_LEVEL)));
}

/** Faixa de nível (Bronze a Diamante) de quem tem essa quantidade de moedas */
export function rankLevelForCoins(coins: number): RankLevel {
  return RANK_LEVEL_ORDER[Math.floor(levelForCoins(coins) / LEVELS_PER_TIER)];
}

/** Um jogador no ranking. A faixa de nível sai das moedas (rankLevelForCoins). */
export type RankingEntry = {
  id: string;
  position: number;
  name: string;
  /** Moedas acumuladas */
  points: number;
};
