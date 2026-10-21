import { RankingEntry } from '@/constants/ranking';
import { TrimmedImageSpec } from '@/utils/trimmedImage';

// TODO: substituir pelos dados do back. Ranking fictício, só para montar a tela.
// Fonte única do pódio (os 3 primeiros) e da lista, para que fiquem consistentes.
export const MOCK_RANKING: RankingEntry[] = [
  { id: '1', position: 1, name: 'Eloria', points: 19000, level: 'diamante' },
  { id: '2', position: 2, name: 'Durg', points: 16000, level: 'esmeralda' },
  { id: '3', position: 3, name: 'Edmund', points: 14000, level: 'rubi' },
  { id: '4', position: 4, name: 'Maria', points: 9000, level: 'ametista' },
];

// TODO: substituir pelos dados do back (posição e avatar do usuário logado).
export const MOCK_CURRENT_USER_RANK: RankingEntry = {
  id: 'me',
  position: 34,
  name: 'Gabriel B.',
  points: 2000,
  level: 'bronze',
};

// Área visível de cavaleiro.png (1024 x 1536, com margem transparente)
export const MOCK_CURRENT_USER_AVATAR: TrimmedImageSpec = {
  source: require('@/assets/images/avatares/sem-upgrade/cavaleiro.png'),
  imageSize: { width: 1024, height: 1536 },
  content: { x: 78, y: 228, width: 696, height: 948 },
};
