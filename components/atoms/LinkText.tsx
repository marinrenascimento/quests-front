import { StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  title: string;
  /** Opcional: sem onPress o link fica sem ação */
  onPress?: () => void;
  /** 'regular' (login) ou 'compact' (cadastro) */
  size?: 'regular' | 'compact';
};

export function LinkText({ title, onPress, size = 'regular' }: Props) {
  return (
    <Text
      accessibilityRole="link"
      onPress={onPress}
      suppressHighlighting
      style={[styles.text, size === 'compact' && styles.textCompact]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    alignSelf: 'center',
    fontFamily: FontFamily.link,
    fontSize: 15,
    color: Palette.link,
    textDecorationLine: 'underline',
  },
  textCompact: {
    fontSize: 14,
  },
});
