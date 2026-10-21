import { ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { RecentSlot } from '@/components/atoms/RecentSlot';
import { FontFamily, Palette } from '@/constants/theme';
import { useMockupScale } from '@/hooks/useMockupScale';

export type RecentAccessItem = {
  id: string;
  label: string;
  icon: ImageSourcePropType;
};

type Props = {
  /** Itens acessados recentemente; os slots sem item aparecem vazios */
  items?: RecentAccessItem[];
  onItemPress?: (item: RecentAccessItem) => void;
};

// Grade fixa de 2 colunas x 3 linhas
const COLUMNS = 2;
const SLOT_COUNT = 6;
const SLOT_INDEXES = Array.from({ length: SLOT_COUNT }, (_, index) => index);

/** Título "ACESSOS RECENTES" + grade de 6 slots (medidas do mockup: slot 34px, vão 6px). */
export function RecentAccessGrid({ items = [], onItemPress }: Props) {
  const { scale } = useMockupScale();
  const slotSize = scale(34);
  const gap = scale(6.5);

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
      {/* Só 6 slots fixos: um .map simples basta (FlatList fica para listas longas) */}
      <View style={[styles.grid, { width: slotSize * COLUMNS + gap, gap }]}>
        {SLOT_INDEXES.map((index) => {
          const item = items[index];
          return (
            <RecentSlot
              key={item?.id ?? `empty-${index}`}
              size={slotSize}
              icon={item?.icon}
              accessibilityLabel={item?.label}
              onPress={item && onItemPress ? () => onItemPress(item) : undefined}
            />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
