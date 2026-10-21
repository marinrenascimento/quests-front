import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Barra do topo (ex.: <TopBar />) */
  topBar: ReactNode;
  /** Seções da tela, empilhadas com o mesmo espaçamento */
  children: ReactNode;
  /** Último item (bloco de suporte): fica encostado embaixo em telas altas. Opcional. */
  footer?: ReactNode;
  /**
   * Padrão: o conteúdo rola num ScrollView com as margens da tela. false: o conteúdo ocupa
   * a área abaixo do TopBar sem ScrollView nem margens, para uma lista (FlatList) que rola
   * sozinha e aplica as margens com useLayoutPadding (sem aninhar listas em ScrollView).
   */
  scrollable?: boolean;
};

// Medidas do mockup da Help, em px
const SECTION_GAP = 15;
/** Espaço mínimo entre o conteúdo e o rodapé (quando a tela rola) */
const FOOTER_GAP = 18;

/**
 * Esqueleto das telas de ajuda (Help e tópicos), dos Relatórios e de Meus Decks: TopBar fixo
 * e, abaixo, o conteúdo rolando sobre o mesmo cinza da Home. O rodapé é empurrado para a base
 * em telas altas; em telas baixas o conteúdo todo rola. Recebe as partes por prop para não
 * acoplar organisms.
 */
export function HelpLayout({ topBar, children, footer, scrollable = true }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal, paddingTop, paddingBottom } = useLayoutPadding();

  return (
    <View style={styles.screen}>
      {topBar}
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { width: layoutWidth, paddingHorizontal, paddingTop, paddingBottom },
          ]}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View style={{ gap: scale(SECTION_GAP) }}>{children}</View>
          {footer ? (
            <View style={[styles.footer, { paddingTop: scale(FOOTER_GAP) }]}>{footer}</View>
          ) : null}
        </ScrollView>
      ) : (
        <View style={styles.scroll}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo cinza claro de fundo da Home e da Rank
  screen: {
    flex: 1,
    backgroundColor: Palette.homeBackground,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignSelf: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
});
