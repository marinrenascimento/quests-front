import { StyleSheet, View } from 'react-native';

import { RankingRow } from '@/components/molecules/RankingRow';
import { RankingEntry } from '@/constants/ranking';

type Props = {
  entries: RankingEntry[];
  /** dp equivalentes a 1px do mockup do Rank */
  unit: number;
};

/** Vão entre as linhas, em px do mockup */
const ROW_GAP = 9;

/** Linhas do ranking empilhadas com o mesmo espaçamento. */
export function RankingList({ entries, unit }: Props) {
  return (
    // Lista curta e fixa (o top da tela) dentro do ScrollView do layout: um .map simples basta.
    // Uma FlatList aqui ficaria aninhada no ScrollView (o React Native avisa contra isso).
    <View style={[styles.column, { gap: ROW_GAP * unit }]}>
      {entries.map((entry) => (
        <RankingRow
          key={entry.id}
          position={entry.position}
          name={entry.name}
          points={entry.points}
          level={entry.level}
          unit={unit}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignSelf: 'stretch',
  },
});
