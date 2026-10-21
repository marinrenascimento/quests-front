import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

/**
 * Vão entre os cartões das grades (na horizontal e na vertical), em px do mockup da Help.
 * Também é o espaço entre os botões de ação acima das grades.
 */
export const GRID_GAP = 11;

/**
 * Medidas de uma grade de cartões em colunas (Meus Decks, cards de um deck): a largura de
 * cada cartão sai da largura da tela, das margens laterais e dos vãos, então todos têm o
 * mesmo tamanho, inclusive o último de uma linha incompleta. Também devolve o estilo do
 * contentContainer da FlatList, com as mesmas margens das outras telas.
 */
export function useGridLayout(columns: number = 2) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal, paddingTop, paddingBottom } = useLayoutPadding();
  const gap = scale(GRID_GAP);

  return {
    gap,
    itemWidth: (layoutWidth - paddingHorizontal * 2 - gap * (columns - 1)) / columns,
    contentContainerStyle: { width: layoutWidth, paddingHorizontal, paddingTop, paddingBottom },
  };
}
