import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { Label } from '@/components/atoms/Label';
import { FlashcardContent } from '@/components/molecules/FlashcardContent';
import { InfoCard } from '@/components/molecules/InfoCard';
import { CARD_HEIGHT_RATIO, CARD_PADDING } from '@/components/organisms/FlashcardGrid';
import { LinkedCard, linkedCardLabel } from '@/constants/decks';
import { useGridLayout } from '@/hooks/useGridLayout';

type Props = {
  /** Rótulo acima da área (mesmo estilo dos rótulos dos campos) */
  label: string;
  /** Texto mostrado enquanto não há cards */
  emptyMessage: string;
  /** Cards vinculados ao deck em criação (padrão: nenhum) */
  cards?: LinkedCard[];
};

/** Espaço interno do cartão do estado vazio, em px do mockup da Help */
const EMPTY_PADDING = 20;

/**
 * Seção "Cards vinculados" do cadastro de deck: rótulo e, abaixo, o cartão verde sálvia com a
 * mensagem centralizada enquanto não há cards. Com cards, mostra a grade em 2 colunas com o
 * mesmo cartão da tela de cards de um deck ("Disciplina - Conteúdo" no topo e a frente no
 * centro), sem os botões de ação. Um deck em criação tem poucos cards, então a grade é montada
 * direto (sem FlatList, que não pode ficar dentro do ScrollView da tela).
 */
// TODO: listar os cards vinculados ao deck vindos do back (hoje só os criados nesta sessão).
export function LinkedCardsSection({ label, emptyMessage, cards = [] }: Props) {
  const { gap, itemWidth: gridItemWidth } = useGridLayout();
  // Arredondada para baixo: com a soma exata, o arredondamento do layout pode jogar o segundo
  // cartão para a linha de baixo (a grade quebra linha com flexWrap)
  const itemWidth = Math.floor(gridItemWidth);

  return (
    <View>
      <Label size="compact">{label}</Label>
      <View style={styles.labelGap} />
      {cards.length === 0 ? (
        <InfoCard padding={EMPTY_PADDING}>
          <BodyText align="center">{emptyMessage}</BodyText>
        </InfoCard>
      ) : (
        <View style={[styles.grid, { gap }]}>
          {cards.map((card) => (
            <View key={card.id} style={{ width: itemWidth, height: itemWidth * CARD_HEIGHT_RATIO }}>
              <InfoCard padding={CARD_PADDING} style={styles.fill}>
                <FlashcardContent
                  cardId={card.id}
                  label={linkedCardLabel(card)}
                  title={card.front}
                />
              </InfoCard>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo espaço entre rótulo e campo do FormField 'outlined'
  labelGap: {
    height: 6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  fill: {
    flex: 1,
  },
});
