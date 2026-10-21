import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

// Medidas do mockup da Help, em px
const SIDE = 15;
const TOP = 16;
const BOTTOM = 16;

/**
 * Largura e espaçamentos do conteúdo rolável abaixo do TopBar (telas de ajuda, Relatórios,
 * Meus Decks): margens laterais, espaço no topo e, embaixo, a área segura + um respiro.
 * Usado tanto pelo ScrollView do HelpLayout quanto por listas (FlatList) com as mesmas margens.
 */
export function useLayoutPadding() {
  const { layoutWidth, scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const insets = useSafeAreaInsets();

  return {
    /** Largura do conteúdo (a tela, limitada em tablets); centralize com alignSelf */
    layoutWidth,
    paddingHorizontal: scale(SIDE),
    paddingTop: scale(TOP),
    paddingBottom: insets.bottom + scale(BOTTOM),
  };
}
