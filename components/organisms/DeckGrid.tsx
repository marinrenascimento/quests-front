import { ReactElement } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { DeckSummary } from '@/components/molecules/DeckSummary';
import { InfoCard } from '@/components/molecules/InfoCard';
import { useGridLayout } from '@/hooks/useGridLayout';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { formatCount } from '@/utils/formatCount';

/** O mínimo de um item da grade: um deck (Meus Decks) ou uma prova (Minhas Provas) */
type GridItem = {
  id: string;
  title: string;
  /** Com descrição (mesmo vazia), o cartão mostra a linha dela; sem, não */
  description?: string;
};

type Props<T extends GridItem> = {
  items: T[];
  /** Conteúdo acima da grade, que rola junto com ela (ex.: cabeçalho e botões) */
  header: ReactElement;
  emptyMessage: string;
  /** Quantidade mostrada no cartão (ex.: cards do deck, questões da prova) */
  getCount: (item: T) => number;
  /** Palavra da quantidade no singular e no plural (ex.: card / cards) */
  countLabels: { one: string; other: string };
  onItemPress: (item: T) => void;
  /** Máximo de linhas do título (padrão: 1); o espaço delas fica reservado em todos os cartões */
  titleLines?: number;
  /** Posição da quantidade no cartão (padrão: centralizada) */
  countAlign?: 'center' | 'right';
  /**
   * O leitor de tela lê o título e a quantidade ("Renascimento, 231 Questões"). Padrão: só o
   * título.
   */
  countInAccessibilityLabel?: boolean;
};

/** Cartões por linha */
const COLUMNS = 2;
const CARD_PADDING = 7;
const EMPTY_TOP = 24;

/**
 * Grade de cartões com baú em 2 colunas (Meus Decks e Minhas Provas): a FlatList é a única
 * rolagem da tela (o cabeçalho entra como ListHeaderComponent, sem ScrollView em volta). A
 * largura de cada cartão é calculada a partir da tela, então todos têm o mesmo tamanho,
 * inclusive o último de uma linha incompleta.
 */
// TODO (dívida): o nome fala em deck/card, mas também é a grade de Minhas Provas e de Vestibulares;
// renomear para um nome neutro num ajuste à parte, sem mudar o comportamento.
export function DeckGrid<T extends GridItem>({
  items,
  header,
  emptyMessage,
  getCount,
  countLabels,
  onItemPress,
  titleLines,
  countAlign,
  countInAccessibilityLabel = false,
}: Props<T>) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { gap, itemWidth, contentContainerStyle } = useGridLayout(COLUMNS);

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={COLUMNS}
      renderItem={({ item }) => {
        const countLabel = formatCount(getCount(item), countLabels);
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              countInAccessibilityLabel ? `${item.title}, ${countLabel}` : item.title
            }
            onPress={() => onItemPress(item)}
            style={({ pressed }) => [{ width: itemWidth }, pressed && styles.pressed]}>
            <InfoCard padding={CARD_PADDING}>
              <DeckSummary
                title={item.title}
                description={item.description}
                countLabel={countLabel}
                titleLines={titleLines}
                countAlign={countAlign}
              />
            </InfoCard>
          </Pressable>
        );
      }}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <BodyText align="center" style={{ marginTop: scale(EMPTY_TOP) }}>
          {emptyMessage}
        </BodyText>
      }
      ItemSeparatorComponent={() => <View style={{ height: gap }} />}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      // TODO: carregar mais itens (onEndReached) quando integrar com o back.
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
