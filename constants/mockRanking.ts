import { RankingEntry } from '@/constants/ranking';

// TODO: substituir pelos dados do back. Ranking fictício, só para montar a tela.
// Fonte única do pódio (os 3 primeiros) e da lista, para que fiquem consistentes. A faixa de
// nível de cada jogador sai das moedas (constants/ranking).
export const MOCK_RANKING: RankingEntry[] = [
  { id: '1', position: 1, name: 'Eloria', points: 19000 },
  { id: '2', position: 2, name: 'Durg', points: 16000 },
  { id: '3', position: 3, name: 'Edmund', points: 14000 },
  { id: '4', position: 4, name: 'Maria', points: 9000 },
];

// TODO: substituir pelos dados do back (posição do usuário logado).
export const MOCK_CURRENT_USER_POSITION = 34;
