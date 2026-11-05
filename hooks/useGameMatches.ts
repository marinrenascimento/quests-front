import { useEffect, useRef } from 'react';

import { GAME_MATCH_CONFIG } from '@/constants/games';
import { useUser } from '@/hooks/useUser';

/**
 * Partidas de um jogo, a partir dos acertos (`score`): cada partida completa soma 1 ponto às moedas
 * do usuário (RN-313). Os pontos ganhos não voltam atrás: recomeçar o jogo zera só a contagem de
 * partidas.
 */
export function useGameMatches(score: number) {
  const { addCoins } = useUser();
  const { itemsPerMatch, pointsPerMatch } = GAME_MATCH_CONFIG;
  const completedMatches = Math.floor(score / itemsPerMatch);
  // Ref (e não estado): só evita dar de novo os pontos de uma partida já contada
  const awardedMatches = useRef(0);

  useEffect(() => {
    if (completedMatches > awardedMatches.current) {
      addCoins((completedMatches - awardedMatches.current) * pointsPerMatch);
    }
    awardedMatches.current = completedMatches;
  }, [completedMatches, pointsPerMatch, addCoins]);

  return {
    /** Partida em andamento, começando em 1 */
    match: completedMatches + 1,
    /** Acertos na partida em andamento */
    matchProgress: score % itemsPerMatch,
    /** Pontos ganhos desde o começo do jogo */
    pointsEarned: completedMatches * pointsPerMatch,
  };
}
