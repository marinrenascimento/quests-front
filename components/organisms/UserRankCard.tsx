import { StyleSheet, View } from 'react-native';

import { LevelIcon } from '@/components/atoms/LevelIcon';
import { PixelNumber } from '@/components/atoms/PixelNumber';
import { PixelText } from '@/components/atoms/PixelText';
import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { RANK_LEVEL_LABELS, rankLevelForCoins, RankingEntry } from '@/constants/ranking';
import { Palette } from '@/constants/theme';
import { formatThousands } from '@/utils/formatNumber';
import { TrimmedImageSpec } from '@/utils/trimmedImage';

type Props = {
  /** Posição, nome, pontuação e nível do usuário logado */
  entry: RankingEntry;
  /** Avatar do usuário (PNG com margem transparente) */
  avatar: TrimmedImageSpec;
  /** dp equivalentes a 1px do mockup do Rank */
  unit: number;
};

// Medidas do mockup do Rank, em px
const CARD_RADIUS = 10;
const PADDING_TOP = 31.3;
const PADDING_BOTTOM = 10.7;
const PADDING_HORIZONTAL = 12;
const POSITION_TOP = 10;
const POSITION_LEFT = 18;
const POSITION_SIZE = 33;
const AVATAR_HEIGHT = 115.4;
const NAME_GAP = 9;
const NAME_SIZE = 10.5;
const NAME_LETTER_SPACING = 1.1;
const SCORE_GAP = 7;
const POINTS_SIZE = 7.5;
const POINTS_LETTER_SPACING = 0.7;
const LEVEL_SIZE = 5.3;
const LEVEL_LETTER_SPACING = 0.8;
const POINTS_LEVEL_GAP = 3;
const ICON_GAP = 14;
const ICON_SIZE = 35.7;
/** Menor tamanho (dp) do nome do nível, para continuar legível em telas baixas */
const MIN_LEVEL_FONT = 5;

/** Cartão do usuário logado: posição no canto, avatar grande, nome, pontuação, nível e ícone. */
export function UserRankCard({ entry, avatar, unit }: Props) {
  const level = rankLevelForCoins(entry.points);

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: CARD_RADIUS * unit,
          paddingTop: PADDING_TOP * unit,
          paddingBottom: PADDING_BOTTOM * unit,
          paddingHorizontal: PADDING_HORIZONTAL * unit,
        },
      ]}>
      <View style={[styles.position, { top: POSITION_TOP * unit, left: POSITION_LEFT * unit }]}>
        <PixelNumber number={entry.position} size={POSITION_SIZE * unit} />
      </View>
      <TrimmedImage
        source={avatar.source}
        imageSize={avatar.imageSize}
        content={avatar.content}
        style={{ height: AVATAR_HEIGHT * unit }}
        accessibilityLabel={`Avatar de ${entry.name}`}
      />
      <PixelText
        size={NAME_SIZE * unit}
        letterSpacing={NAME_LETTER_SPACING * unit}
        color={Palette.forest}
        style={[styles.name, { marginTop: NAME_GAP * unit }]}>
        {entry.name}
      </PixelText>
      <View style={[styles.scoreRow, { marginTop: SCORE_GAP * unit }]}>
        <View style={styles.score}>
          <PixelText
            size={POINTS_SIZE * unit}
            letterSpacing={POINTS_LETTER_SPACING * unit}
            color={Palette.forest}>
            {formatThousands(entry.points)}
          </PixelText>
          <PixelText
            size={Math.max(LEVEL_SIZE * unit, MIN_LEVEL_FONT)}
            letterSpacing={LEVEL_LETTER_SPACING * unit}
            color={Palette.forest}
            style={{ marginTop: POINTS_LEVEL_GAP * unit }}>
            {RANK_LEVEL_LABELS[level]}
          </PixelText>
        </View>
        <View style={{ marginLeft: ICON_GAP * unit }}>
          <LevelIcon level={level} size={ICON_SIZE * unit} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: Palette.rankCard,
  },
  position: {
    position: 'absolute',
  },
  name: {
    maxWidth: '100%',
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  score: {
    alignItems: 'center',
  },
});
