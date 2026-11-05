import { StyleSheet, View } from 'react-native';

import { ImageOptionTile } from '@/components/atoms/ImageOptionTile';
import { Label } from '@/components/atoms/Label';
import { InfoCard } from '@/components/molecules/InfoCard';
import type { IconName } from '@/constants/helpContent';
import type { ProfileImageOption } from '@/constants/profile';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Group = {
  /** Título acima do grupo (opcional) */
  title?: string;
  options: ProfileImageOption[];
};

type Props = {
  title: string;
  groups: Group[];
  /** Id da opção escolhida (sem valor: a opção `none`, se houver) */
  selectedId?: string;
  onSelect: (id: string) => void;
  /** Opção de não usar nenhuma imagem, no início da grade (opcional) */
  none?: { label: string; icon: IconName; onSelect: () => void };
  /** Fração do quadrado ocupada pela imagem (ver ImageOptionTile) */
  imageFill?: number;
  selectedIcon: IconName;
};

// Medidas em px do mockup da Help
const COLUMNS = 4;
const GRID_GAP = 8;
const CARD_PADDING = 15;
const GROUP_GAP = 14;
const GROUP_TITLE_GAP = 7;

/**
 * Cartão de escolha de uma imagem (avatar ou fundo) do Perfil: grades de 4 colunas, com grupos
 * opcionais. As listas são curtas e fixas, então a grade rola junto com a tela, sem FlatList.
 */
export function ImagePickerCard({
  title,
  groups,
  selectedId,
  onSelect,
  none,
  imageFill,
  selectedIcon,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();
  const gridWidth = layoutWidth - paddingHorizontal * 2 - scale(CARD_PADDING) * 2;
  const tileSize = Math.floor((gridWidth - scale(GRID_GAP) * (COLUMNS - 1)) / COLUMNS);

  return (
    <InfoCard title={title}>
      <View accessibilityRole="radiogroup" style={{ gap: scale(GROUP_GAP) }}>
        {groups.map((group, index) => (
          <View key={group.title ?? index}>
            {group.title ? (
              <View style={{ marginBottom: scale(GROUP_TITLE_GAP) }}>
                <Label size="compact">{group.title}</Label>
              </View>
            ) : null}
            <View style={[styles.grid, { gap: scale(GRID_GAP) }]}>
              {index === 0 && none ? (
                <ImageOptionTile
                  label={none.label}
                  icon={none.icon}
                  size={tileSize}
                  selected={selectedId === undefined}
                  selectedIcon={selectedIcon}
                  onPress={none.onSelect}
                />
              ) : null}
              {group.options.map((option) => (
                <ImageOptionTile
                  key={option.id}
                  label={option.name}
                  image={option.image}
                  size={tileSize}
                  imageFill={imageFill}
                  selected={option.id === selectedId}
                  selectedIcon={selectedIcon}
                  onPress={() => onSelect(option.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
