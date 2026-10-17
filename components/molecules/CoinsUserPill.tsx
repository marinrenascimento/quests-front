import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/atoms/Avatar';
import { TrimmedImage } from '@/components/atoms/TrimmedImage';
import { FontFamily, Palette } from '@/constants/theme';
import { formatThousands } from '@/utils/formatNumber';

type Props = {
  coins: number;
  userName: string;
  onPress?: () => void;
};

// Área visível de sacolaDeMoedas.png (1024 x 1024, com margem transparente)
const BAG_IMAGE_SIZE = { width: 1024, height: 1024 };
const BAG_CONTENT = { x: 195, y: 219, width: 607, height: 624 };

export function CoinsUserPill({ coins, userName, onPress }: Props) {
  const formattedCoins = formatThousands(coins);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${userName}, ${formattedCoins} moedas`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
      <View style={styles.pill}>
        <View style={styles.texts}>
          <Text numberOfLines={1} maxFontSizeMultiplier={1.2} style={styles.coins}>
            {formattedCoins}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            maxFontSizeMultiplier={1.2}
            style={styles.name}>
            {userName}
          </Text>
        </View>
        <Avatar />
      </View>
      {/* A sacola fica por cima da borda esquerda da pílula e sai um pouco para fora */}
      <TrimmedImage
        source={require('@/assets/images/outros/sacolaDeMoedas.png')}
        imageSize={BAG_IMAGE_SIZE}
        content={BAG_CONTENT}
        style={styles.bag}
      />
    </Pressable>
  );
}

const PILL_HEIGHT = 35;
const BAG_HEIGHT = 39;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  pill: {
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 45,
    paddingRight: 4.5,
    backgroundColor: Palette.forest,
  },
  texts: {
    alignItems: 'center',
    marginRight: 2.5,
  },
  coins: {
    fontFamily: FontFamily.topBarCoins,
    fontSize: 9.5,
    lineHeight: 11.5,
    color: Palette.white,
  },
  name: {
    maxWidth: 40,
    fontFamily: FontFamily.topBarName,
    fontSize: 8,
    lineHeight: 10,
    color: Palette.white,
  },
  bag: {
    position: 'absolute',
    left: 0,
    top: -3,
    height: BAG_HEIGHT,
  },
  pressed: {
    opacity: 0.85,
  },
});
