import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { LevelIcon } from '@/components/atoms/LevelIcon';
import { PixelText } from '@/components/atoms/PixelText';
import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { InfoCard } from '@/components/molecules/InfoCard';
import { ReadOnlyField } from '@/components/molecules/ReadOnlyField';
import type { RankLevel } from '@/constants/ranking';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

type Field = { label: string; value: string };

type Props = {
  name: string;
  /** Rótulo do avatar, lido pelo leitor de tela */
  avatarLabel: string;
  avatar: TrimmedImageSpec;
  /** Fundo atrás do avatar. Sem ele, o quadro fica verde escuro. */
  background?: TrimmedImageSpec;
  /** Nível e faixa (ex.: "Nível 10 · Ametista") e o ícone da faixa */
  levelLabel: string;
  rankLevel: RankLevel;
  points: Field;
  username: Field;
  email: Field;
};

// Medidas em px do mockup da Help (o Perfil não tem mockup: segue os cartões da Help)
const HERO_HEIGHT = 150;
const HERO_RADIUS = 8;
const AVATAR_HEIGHT = 128;
const AVATAR_BOTTOM = 8;
const NAME_TOP = 13;
const NAME_SIZE = 9;
const NAME_LETTER_SPACING = 0.8;
const LEVEL_TOP = 8;
const LEVEL_ICON_SIZE = 18;
const LEVEL_GAP = 6;
const FIELD_GAP = 10;
const FIELDS_TOP = 13;

/**
 * Topo do Perfil: o avatar sobre o fundo escolhido, o nome, o nível e os dados da conta (pontos,
 * usuário e e-mail), somente leitura.
 */
export function ProfileSummaryCard({
  name,
  avatarLabel,
  avatar,
  background,
  levelLabel,
  rankLevel,
  points,
  username,
  email,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const fieldGap = { marginTop: scale(FIELD_GAP) };

  return (
    <InfoCard>
      <View style={[styles.hero, { height: scale(HERO_HEIGHT), borderRadius: scale(HERO_RADIUS) }]}>
        {background ? (
          <Image source={background.source} contentFit="cover" style={StyleSheet.absoluteFill} />
        ) : null}
        <TrimmedImage
          source={avatar.source}
          imageSize={avatar.imageSize}
          content={avatar.content}
          style={{ height: scale(AVATAR_HEIGHT), marginBottom: scale(AVATAR_BOTTOM) }}
          accessibilityLabel={avatarLabel}
        />
      </View>
      <PixelText
        size={scale(NAME_SIZE)}
        letterSpacing={scale(NAME_LETTER_SPACING)}
        numberOfLines={0}
        color={Palette.forest}
        style={[styles.name, { marginTop: scale(NAME_TOP) }]}>
        {name}
      </PixelText>
      <View style={[styles.level, { marginTop: scale(LEVEL_TOP), gap: scale(LEVEL_GAP) }]}>
        <LevelIcon level={rankLevel} size={scale(LEVEL_ICON_SIZE)} />
        <BodyText weight="medium">{levelLabel}</BodyText>
      </View>
      <View style={{ marginTop: scale(FIELDS_TOP) }}>
        <ReadOnlyField label={points.label} value={points.value} />
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={username.label} value={username.value} />
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={email.label} value={email.value} />
      </View>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: Palette.forest,
  },
  name: {
    textAlign: 'center',
  },
  level: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
