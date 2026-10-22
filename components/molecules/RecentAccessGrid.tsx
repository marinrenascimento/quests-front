import { Image, StyleSheet, Text, View } from 'react-native';

import { PixelText } from '@/components/atoms/PixelText';
import { RecentSlot } from '@/components/atoms/RecentSlot';
import { FontFamily, Palette } from '@/constants/theme';
import { useMockupScale } from '@/hooks/useMockupScale';

/** Um deck ou uma prova acessados recentemente */
export type RecentAccessItem = {
  id: string;
  /** Nome do deck ou da prova */
  label: string;
};

type Props = {
  /** Itens acessados recentemente (os mais recentes primeiro); os slots sem item ficam vazios */
  items?: RecentAccessItem[];
  onItemPress?: (item: RecentAccessItem) => void;
};

/** Os 2 últimos decks ou provas acessados */
const SLOT_COUNT = 2;
const SLOT_INDEXES = Array.from({ length: SLOT_COUNT }, (_, index) => index);
// Medidas do mockup: cada quadrado ocupa o lugar de 4 dos antigos (2 x 2 slots de 34px com vão
// de 6,5px), um embaixo do outro, com o mesmo vão
const SLOT_SIZE = 34 * 2 + 6.5;
const GAP = 6.5;
const NAME_SIZE = 4.4;
const NAME_LETTER_SPACING = 0.4;
const NAME_TOP = 5;
// Mesmo baú dos cartões de Meus Decks e Minhas Provas (bau.png, 1410 x 1115 px)
const CHEST = require('@/assets/images/outros/bau.png');
const CHEST_ASPECT_RATIO = 1410 / 1115;

/**
 * Título "ACESSOS RECENTES" + 2 quadrados grandes, um embaixo do outro. Cada item mostra o baú e
 * o nome (fonte pixel do mesmo tamanho em todos, cortado com reticências se não couber).
 */
export function RecentAccessGrid({ items = [], onItemPress }: Props) {
  const { scale } = useMockupScale();
  const slotSize = scale(SLOT_SIZE);

  return (
    <View style={styles.container}>
      <Text
        accessibilityRole="header"
        maxFontSizeMultiplier={1.2}
        style={[
          styles.title,
          {
            fontSize: scale(8.2),
            lineHeight: scale(9.6),
            letterSpacing: scale(0.9),
            marginBottom: scale(6.5),
          },
        ]}>
        {'ACESSOS\nRECENTES'}
      </Text>
      {/* Só 2 slots fixos: um .map simples basta (FlatList fica para listas longas) */}
      <View style={{ gap: scale(GAP) }}>
        {SLOT_INDEXES.map((index) => {
          const item = items[index];
          return (
            <RecentSlot
              key={item?.id ?? `empty-${index}`}
              size={slotSize}
              accessibilityLabel={item?.label}
              onPress={item && onItemPress ? () => onItemPress(item) : undefined}>
              {item ? (
                <>
                  <Image
                    source={CHEST}
                    resizeMode="contain"
                    accessible={false}
                    style={styles.chest}
                  />
                  <PixelText
                    size={scale(NAME_SIZE)}
                    letterSpacing={scale(NAME_LETTER_SPACING)}
                    color={Palette.white}
                    style={[styles.name, { marginTop: scale(NAME_TOP) }]}>
                    {item.label}
                  </PixelText>
                </>
              ) : null}
            </RecentSlot>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontFamily: FontFamily.homeCaption,
    textAlign: 'center',
    color: Palette.forest,
    includeFontPadding: false,
  },
  chest: {
    width: '70%',
    height: undefined,
    aspectRatio: CHEST_ASPECT_RATIO,
  },
  name: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});
