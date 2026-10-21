import { ImageSourcePropType, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/atoms/Avatar';
import { PixelNumber } from '@/components/atoms/PixelNumber';
import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';

type Props = {
  position: number;
  name: string;
  /** Altura do bloco colorido em px do mockup */
  height: number;
  /** 1º lugar: bloco verde escuro. Demais: verde sálvia. */
  highlighted?: boolean;
  /** dp equivalentes a 1px do mockup do Rank */
  unit: number;
  // TODO: avatar real do jogador. Sem imagem, fica só o círculo.
  avatarSource?: ImageSourcePropType;
};

// Medidas do mockup do Rank, em px
const COLUMN_WIDTH = 68.5;
const AVATAR_SIZE = 31;
const AVATAR_NAME_GAP = 4;
const NAME_SIZE = 6.3;
const NAME_LETTER_SPACING = 0.7;
const NAME_BLOCK_GAP = 3.5;
const NUMBER_SIZE = 28.5;
/** Os números ficam a ~11px da base em todas as colunas, como no mockup */
const NUMBER_BOTTOM = 11;

/**
 * Uma coluna do pódio: avatar e nome em cima, bloco com a posição embaixo.
 * A coluna cresce para cima, então várias lado a lado ficam com a base alinhada.
 */
export function PodiumColumn({
  position,
  name,
  height,
  highlighted = false,
  unit,
  avatarSource,
}: Props) {
  return (
    <View style={[styles.column, { width: COLUMN_WIDTH * unit }]}>
      <Avatar
        size={AVATAR_SIZE * unit}
        color={Palette.sage}
        showSilhouette={false}
        source={avatarSource}
      />
      <PixelText
        size={NAME_SIZE * unit}
        letterSpacing={NAME_LETTER_SPACING * unit}
        color={Palette.forest}
        style={[
          styles.name,
          { marginTop: AVATAR_NAME_GAP * unit, marginBottom: NAME_BLOCK_GAP * unit },
        ]}>
        {name}
      </PixelText>
      <View
        style={[
          styles.block,
          highlighted ? styles.blockHighlighted : styles.blockDefault,
          { height: height * unit, paddingBottom: NUMBER_BOTTOM * unit },
        ]}>
        <PixelNumber number={position} size={NUMBER_SIZE * unit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  name: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  block: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blockHighlighted: {
    backgroundColor: Palette.forest,
  },
  blockDefault: {
    backgroundColor: Palette.sage,
  },
});
