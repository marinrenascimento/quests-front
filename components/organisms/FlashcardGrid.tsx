import { ReactElement, useCallback } from 'react';
import { FlatList, ListRenderItem, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { FlashcardContent } from '@/components/molecules/FlashcardContent';
import { InfoCard } from '@/components/molecules/InfoCard';
import { CardAction, CardActionKey, DeckCard } from '@/constants/decks';
import { useGridLayout } from '@/hooks/useGridLayout';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  cards: DeckCard[];
  /** Rótulo "Disciplina - Tema", igual em todos os cards do deck */
  label: string;
  /** Conteúdo acima da grade, que rola junto com ela (cabeçalho e botões) */
  header: ReactElement;
  emptyMessage: string;
  actions: CardAction[];
  onAction: (action: CardActionKey, cardId: string) => void;
};

/** Cartões por linha */
const COLUMNS = 2;
/**
 * Altura fixa do cartão em relação à largura (~80%, como no mockup). Exportada com o espaço
 * interno para os cards vinculados do cadastro de deck terem o mesmo tamanho.
 */
export const CARD_HEIGHT_RATIO = 0.8;
export const CARD_PADDING = 10;
const EMPTY_TOP = 24;
// Linhas (não cards) renderizadas de início e por lote: ~2 telas, o bastante para não piscar
const INITIAL_ROWS = 5;
const ROWS_PER_BATCH = 5;
/** Telas mantidas montadas (a visível + 3 acima e 3 abaixo); o padrão do React Native é 21 */
const WINDOW_SIZE = 7;

const keyExtractor = (card: DeckCard) => card.id;

/**
 * Grade de flashcards em 2 colunas, para decks com muitos cards: uma FlatList só (o cabeçalho
 * entra como ListHeaderComponent), cartões de largura e altura fixas, item memorizado e
 * callbacks estáveis.
 */
export function FlashcardGrid({ cards, label, header, emptyMessage, actions, onAction }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { gap, itemWidth, contentContainerStyle } = useGridLayout(COLUMNS);
  const itemHeight = itemWidth * CARD_HEIGHT_RATIO;

  const renderItem = useCallback<ListRenderItem<DeckCard>>(
    ({ item }) => (
      <View style={{ width: itemWidth, height: itemHeight }}>
        <InfoCard padding={CARD_PADDING} style={styles.fill}>
          <FlashcardContent
            cardId={item.id}
            label={label}
            title={item.title}
            actions={actions}
            onAction={onAction}
          />
        </InfoCard>
      </View>
    ),
    [itemWidth, itemHeight, label, actions, onAction],
  );

  const renderSeparator = useCallback(() => <View style={{ height: gap }} />, [gap]);

  return (
    <FlatList
      data={cards}
      keyExtractor={keyExtractor}
      numColumns={COLUMNS}
      renderItem={renderItem}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <BodyText align="center" style={{ marginTop: scale(EMPTY_TOP) }}>
          {emptyMessage}
        </BodyText>
      }
      ItemSeparatorComponent={renderSeparator}
      columnWrapperStyle={{ gap }}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      initialNumToRender={INITIAL_ROWS}
      maxToRenderPerBatch={ROWS_PER_BATCH}
      windowSize={WINDOW_SIZE}
      // TODO: carregar mais cards (onEndReached) ao integrar com o back.
      bounces={false}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
  },
  fill: {
    flex: 1,
  },
});
