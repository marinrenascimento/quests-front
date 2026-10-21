import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Barra do topo (ex.: <TopBar />) */
  topBar: ReactNode;
  /** Seções da tela, empilhadas com o mesmo espaçamento */
  children: ReactNode;
  /** Último item (bloco de suporte): fica encostado embaixo em telas altas. Opcional. */
  footer?: ReactNode;
};

// Medidas do mockup da Help, em px
const SIDE = 15;
const TOP = 16;
const SECTION_GAP = 15;
/** Espaço mínimo entre o conteúdo e o rodapé (quando a tela rola) */
const FOOTER_GAP = 18;
const BOTTOM = 16;

/**
 * Esqueleto das telas de ajuda (Help e tópicos) e dos Relatórios: TopBar fixo e, abaixo, o
 * conteúdo rolando sobre o mesmo cinza da Home. O rodapé é empurrado para a base em telas altas; em telas
 * baixas o conteúdo todo rola. Recebe as partes por prop para não acoplar organisms.
 */
export function HelpLayout({ topBar, children, footer }: Props) {
  const { layoutWidth, scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.screen}>
      {topBar}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          {
            width: layoutWidth,
            paddingHorizontal: scale(SIDE),
            paddingTop: scale(TOP),
            paddingBottom: insets.bottom + scale(BOTTOM),
          },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={{ gap: scale(SECTION_GAP) }}>{children}</View>
        {footer ? (
          <View style={[styles.footer, { paddingTop: scale(FOOTER_GAP) }]}>{footer}</View>
        ) : null}
      </ScrollView>
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
