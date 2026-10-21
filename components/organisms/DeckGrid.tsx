import { ReactElement } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { DeckSummary } from '@/components/molecules/DeckSummary';
import { InfoCard } from '@/components/molecules/InfoCard';
import { Deck } from '@/constants/decks';
import { useGridLayout } from '@/hooks/useGridLayout';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { formatCount } from '@/utils/formatCount';

type Props = {
  decks: Deck[];
  /** Conteúdo acima da grade, que rola junto com ela (ex.: cabeçalho e botões) */
  header: ReactElement;
  emptyMessage: string;
  /** Palavra da quantidade no singular e no plural (ex.: card / cards) */
  countLabels: { one: string; other: string };
  onDeckPress: (deck: Deck) => void;
};

/** Cartões por linha */
const COLUMNS = 2;
const CARD_PADDING = 7;
const EMPTY_TOP = 24;

/**
 * Grade de decks em 2 colunas: a FlatList é a única rolagem da tela (o cabeçalho entra como
 * ListHeaderComponent, sem ScrollView em volta). A largura de cada cartão é calculada a partir
 * da tela, então todos têm o mesmo tamanho, inclusive o último de uma linha incompleta.
 */
export function DeckGrid({ decks, header, emptyMessage, countLabels, onDeckPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { gap, itemWidth, contentContainerStyle } = useGridLayout(COLUMNS);

  return (
    <FlatList
      data={decks}
      keyExtractor={(deck) => deck.id}
      numColumns={COLUMNS}
      renderItem={({ item }) => (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={item.title}
          onPress={() => onDeckPress(item)}
          style={({ pressed }) => [{ width: itemWidth }, pressed && styles.pressed]}>
          <InfoCard padding={CARD_PADDING}>
            <DeckSummary
              title={item.title}
              description={item.description}
              countLabel={formatCount(item.cardsCount, countLabels)}
            />
          </InfoCard>
        </Pressable>
      )}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <BodyText align="center" style={{ marginTop: scale(EMPTY_TOP) }}>
          {emptyMessage}
        </BodyText>
      }
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      // TODO: carregar mais decks (onEndReached) quando integrar com o back.
      bounces={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
