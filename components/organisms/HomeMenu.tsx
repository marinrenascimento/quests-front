import { StyleSheet, View } from 'react-native';

import { MenuButton, TrimmedSource } from '@/components/molecules/MenuButton';
import { Palette } from '@/constants/theme';
import { useMockupScale } from '@/hooks/useMockupScale';

export type HomeMenuKey = 'questoes' | 'jogos' | 'decks' | 'relatorios';

type MenuItem = {
  key: HomeMenuKey;
  label: string;
  color: string;
  icon: TrimmedSource;
};

type Props = {
  onSelect: (key: HomeMenuKey) => void;
};

// Ícones de 1536 x 1024 com margem transparente; `content` é a área visível de cada um
const ICON_IMAGE_SIZE = { width: 1536, height: 1024 };

const MENU_ITEMS: MenuItem[] = [
  {
    key: 'questoes',
    label: 'QUESTÕES',
    color: Palette.menuBlue,
    icon: {
      source: require('@/assets/images/outros/pergaminho.png'),
      imageSize: ICON_IMAGE_SIZE,
      content: { x: 357, y: 105, width: 821, height: 765 },
    },
  },
  {
    key: 'jogos',
    label: 'JOGOS',
    color: Palette.menuGreen,
    icon: {
      source: require('@/assets/images/outros/dragao.png'),
      imageSize: ICON_IMAGE_SIZE,
      content: { x: 448, y: 158, width: 688, height: 620 },
    },
  },
  {
    key: 'decks',
    label: 'DECKS',
    color: Palette.menuPurple,
    icon: {
      source: require('@/assets/images/outros/grimorio.png'),
      imageSize: ICON_IMAGE_SIZE,
      content: { x: 373, y: 95, width: 764, height: 797 },
    },
  },
  {
    key: 'relatorios',
    label: 'RELATÓRIOS',
    color: Palette.menuRed,
    icon: {
      source: require('@/assets/images/outros/bolaDeCristal.png'),
      imageSize: ICON_IMAGE_SIZE,
      content: { x: 487, y: 90, width: 565, height: 803 },
    },
  },
];

/** Coluna com os 4 botões do menu da Home, empilhados com o mesmo espaçamento. */
export function HomeMenu({ onSelect }: Props) {
  const { scale } = useMockupScale();

  return (
    <View style={[styles.column, { gap: scale(12) }]}>
      {MENU_ITEMS.map((item) => (
        <MenuButton
          key={item.key}
          label={item.label}
          color={item.color}
          icon={item.icon}
          onPress={() => onSelect(item.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
  },
});
