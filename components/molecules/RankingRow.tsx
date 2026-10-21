import { ImageSourcePropType, StyleSheet, View } from 'react-native';

import { Avatar } from '@/components/atoms/Avatar';
import { LevelIcon } from '@/components/atoms/LevelIcon';
import { PixelNumber } from '@/components/atoms/PixelNumber';
import { PixelText } from '@/components/atoms/PixelText';
import { RANK_LEVEL_LABELS, RankLevel } from '@/constants/ranking';
import { Palette } from '@/constants/theme';
import { formatThousands } from '@/utils/formatNumber';

type Props = {
  position: number;
  name: string;
  points: number;
  level: RankLevel;
  /** dp equivalentes a 1px do mockup do Rank */
  unit: number;
  // TODO: avatar real do jogador. Sem imagem, fica só o círculo branco.
  avatarSource?: ImageSourcePropType;
};

// Medidas do mockup do Rank, em px
const ROW_HEIGHT = 43.4;
const ROW_RADIUS = 8;
const PADDING_LEFT = 10.5;
const PADDING_RIGHT = 6.7;
/** Largura mínima da área do número: as posições de 1 dígito ficam centralizadas no mesmo eixo */
const NUMBER_SLOT_WIDTH = 24;
const NUMBER_SIZE = 28;
const AVATAR_SIZE = 31.4;
const AVATAR_GAP = 8;
const NAME_GAP = 8.6;
const NAME_SIZE = 9.5;
const NAME_LETTER_SPACING = 0.8;
const NAME_POINTS_GAP = 6;
const POINTS_SIZE = 6.5;
const POINTS_LETTER_SPACING = 0.2;
const LEVEL_SIZE = 4.4;
const LEVEL_LETTER_SPACING = 0.3;
const POINTS_LEVEL_GAP = 3.5;
const ICON_GAP = 10.7;
/** Caixa fixa do ícone: a pontuação fica alinhada em todas as linhas, qualquer que seja a pedra */
const ICON_BOX_WIDTH = 30;
const ICON_SIZE = 26;
/** Menor tamanho (dp) do nome do nível, para continuar legível em telas baixas */
const MIN_LEVEL_FONT = 5;

/** Linha da lista do ranking: posição, avatar, nome, pontuação com nível e pedra do nível. */
export function RankingRow({ position, name, points, level, unit, avatarSource }: Props) {
  return (
    <View
      style={[
        styles.row,
        {
          height: ROW_HEIGHT * unit,
          borderRadius: ROW_RADIUS * unit,
          paddingLeft: PADDING_LEFT * unit,
          paddingRight: PADDING_RIGHT * unit,
        },
      ]}>
      <View style={[styles.numberSlot, { minWidth: NUMBER_SLOT_WIDTH * unit }]}>
        <PixelNumber number={position} size={NUMBER_SIZE * unit} />
      </View>
      <View style={{ marginLeft: AVATAR_GAP * unit }}>
        <Avatar size={AVATAR_SIZE * unit} showSilhouette={false} source={avatarSource} />
      </View>
      <PixelText
        size={NAME_SIZE * unit}
        letterSpacing={NAME_LETTER_SPACING * unit}
        color={Palette.white}
        style={[styles.name, { marginLeft: NAME_GAP * unit, marginRight: NAME_POINTS_GAP * unit }]}>
        {name}
      </PixelText>
      <View style={styles.score}>
        <PixelText
          size={POINTS_SIZE * unit}
          letterSpacing={POINTS_LETTER_SPACING * unit}
          color={Palette.white}>
          {formatThousands(points)}
        </PixelText>
        <PixelText
          size={Math.max(LEVEL_SIZE * unit, MIN_LEVEL_FONT)}
          letterSpacing={LEVEL_LETTER_SPACING * unit}
          color={Palette.white}
          style={{ marginTop: POINTS_LEVEL_GAP * unit }}>
          {RANK_LEVEL_LABELS[level]}
        </PixelText>
      </View>
      <View style={[styles.iconBox, { width: ICON_BOX_WIDTH * unit, marginLeft: ICON_GAP * unit }]}>
        <LevelIcon level={level} size={ICON_SIZE * unit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.forest,
  },
  numberSlot: {
    alignItems: 'center',
  },
  // Ocupa o espaço que sobra; nomes longos terminam em reticências
  name: {
    flex: 1,
  },
  score: {
    alignItems: 'center',
  },
  iconBox: {
    alignItems: 'center',
  },
});
