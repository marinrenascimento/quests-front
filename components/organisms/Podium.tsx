import { StyleSheet, View } from 'react-native';

import { PodiumColumn } from '@/components/molecules/PodiumColumn';
import { RankingEntry } from '@/constants/ranking';

type Props = {
  /** Ranking; o pódio usa os jogadores nas posições 1, 2 e 3 */
  entries: RankingEntry[];
  /** dp equivalentes a 1px do mockup do Rank */
  unit: number;
};

/** Ordem visual das colunas: 2º, 1º, 3º */
const PODIUM_ORDER = [2, 1, 3];

/** Altura do bloco de cada posição, em px do mockup (o 3º um pouco mais baixo que o 2º) */
const BLOCK_HEIGHTS: Record<number, number> = { 1: 80, 2: 53.5, 3: 48 };

/** Vão entre as colunas, em px do mockup */
const COLUMN_GAP = 3;

/** Pódio com os três primeiros colocados, colunas lado a lado com a base alinhada. */
export function Podium({ entries, unit }: Props) {
  const columns = PODIUM_ORDER.map((position) =>
    entries.find((entry) => entry.position === position),
  ).filter((entry): entry is RankingEntry => entry !== undefined);

  return (
    <View style={[styles.row, { gap: COLUMN_GAP * unit }]}>
      {columns.map((entry) => (
        <PodiumColumn
          key={entry.id}
          position={entry.position}
          name={entry.name}
          height={BLOCK_HEIGHTS[entry.position]}
          highlighted={entry.position === 1}
          unit={unit}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'center',
  },
});
