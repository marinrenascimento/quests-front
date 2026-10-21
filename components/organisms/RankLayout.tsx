import { ReactNode, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';
import { useMockupScale } from '@/hooks/useMockupScale';

/** Recebe `unit` (dp equivalentes a 1px do mockup do Rank) e devolve a seção. */
type Section = (unit: number) => ReactNode;

type Props = {
  /** Barra do topo (ex.: <TopBar />) */
  topBar: ReactNode;
  renderPodium: Section;
  renderList: Section;
  renderUserCard: Section;
};

// Medidas do mockup do Rank, em px
/** Largura da tela no mockup do Rank */
const MOCKUP_SCREEN_WIDTH = 314;
/**
 * Altura de todo o conteúdo abaixo do TopBar (pódio, lista, cartão, vãos e margem inferior):
 * 27.5 + 125.5 + 24.3 + 200.6 + 18 + 221 + 14
 */
const MOCKUP_BODY_HEIGHT = 631;
const PODIUM_TOP = 27.5;
const LIST_TOP = 24.3;
const CARD_TOP = 18;
const BOTTOM = 14;
/** Margens laterais da lista e do cartão */
const LIST_SIDE = 9.7;
const CARD_SIDE = 22.3;
/**
 * Em telas baixas, tudo encolhe por igual para caber sem rolagem, até 0,75dp por px do mockup
 * (numa tela de 360dp, a escala pela largura é ~1,15). Abaixo disso o conteúdo para de
 * encolher e a tela rola (último recurso).
 */
const MIN_UNIT = 0.75;

/**
 * Esqueleto da tela Rank: TopBar e, sobre o fundo cinza da Home, pódio, lista e cartão do
 * usuário. As medidas do mockup escalam pela largura e, se a tela for baixa, pela altura,
 * para caber sem rolar. Recebe as seções por prop (e não importa outros organisms) para não
 * acoplar organisms.
 */
export function RankLayout({ topBar, renderPodium, renderList, renderUserCard }: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const { layoutWidth, factor: widthUnit } = useMockupScale(MOCKUP_SCREEN_WIDTH);
  const insets = useSafeAreaInsets();
  const [bodyHeight, setBodyHeight] = useState(0);

  // Antes da primeira medição, estima a área abaixo do TopBar
  const availableHeight = (bodyHeight || windowHeight * 0.88) - insets.bottom;
  const heightUnit = Math.max(availableHeight / MOCKUP_BODY_HEIGHT, MIN_UNIT);
  const unit = Math.min(widthUnit, heightUnit);

  return (
    <View style={styles.screen}>
      {topBar}
      <ScrollView
        style={styles.body}
        onLayout={(event) => setBodyHeight(event.nativeEvent.layout.height)}
        contentContainerStyle={[
          styles.content,
          { width: layoutWidth, paddingBottom: insets.bottom + BOTTOM * unit },
        ]}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: PODIUM_TOP * unit }}>{renderPodium(unit)}</View>
        <View style={{ marginTop: LIST_TOP * unit, marginHorizontal: LIST_SIDE * widthUnit }}>
          {renderList(unit)}
        </View>
        <View style={{ marginTop: CARD_TOP * unit, marginHorizontal: CARD_SIDE * widthUnit }}>
          {renderUserCard(unit)}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo cinza claro de fundo da Home
  screen: {
    flex: 1,
    backgroundColor: Palette.homeBackground,
  },
  body: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
  },
});
