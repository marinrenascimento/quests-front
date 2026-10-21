import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FadedScenery } from '@/components/atoms/FadedScenery';
import { Palette } from '@/constants/theme';
import { useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Barra do topo (ex.: <TopBar />) */
  topBar: ReactNode;
  /** Banner logo abaixo do TopBar; preenche a altura que o layout reservar */
  banner: ReactNode;
  /** Coluna estreita da esquerda (acessos recentes) */
  sidebar: ReactNode;
  /** Coluna larga da direita (menu) */
  children: ReactNode;
};

/** Banner: ~29% da área abaixo do TopBar (167 de 572px no mockup) */
const BANNER_HEIGHT_RATIO = 0.29;
/** Cenário de fundo: ~1/3 inferior da tela */
const SCENERY_HEIGHT_RATIO = 0.36;

/**
 * Esqueleto da Home: TopBar, banner e duas colunas sobre o fundo cinza, com o cenário
 * esmaecido fixo atrás. Se a tela for baixa demais, o conteúdo rola e o cenário fica parado.
 * Recebe as partes por prop (e não importa outros organisms) para não acoplar organisms.
 */
export function HomeLayout({ topBar, banner, sidebar, children }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const { layoutWidth, scale } = useMockupScale();
  const insets = useSafeAreaInsets();
  const [bodyHeight, setBodyHeight] = useState(0);

  // Antes da primeira medição, estima a área abaixo do TopBar
  const availableHeight = bodyHeight || windowHeight * 0.88;

  return (
    <View style={styles.screen}>
      {topBar}
      <View style={styles.body} onLayout={(event) => setBodyHeight(event.nativeEvent.layout.height)}>
        <FadedScenery height={Math.round(windowHeight * SCENERY_HEIGHT_RATIO)} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: insets.bottom + scale(12) }}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          <View style={{ height: Math.round(availableHeight * BANNER_HEIGHT_RATIO) }}>{banner}</View>
          {/* Medidas do mockup: margens de 8 e 10px, coluna esquerda de 74,5px, vão de 12px */}
          <View
            style={[
              styles.columns,
              {
                width: layoutWidth,
                paddingTop: scale(19),
                paddingLeft: scale(8),
                paddingRight: scale(10),
                gap: scale(12),
              },
            ]}>
            <View style={{ width: scale(74.5), paddingTop: scale(1.5) }}>{sidebar}</View>
            <View style={styles.main}>{children}</View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Palette.homeBackground,
  },
  body: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  columns: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  main: {
    flex: 1,
  },
});
