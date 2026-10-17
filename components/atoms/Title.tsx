import { StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  children: string;
  /** 'regular' (login) ou 'compact' (cadastro) */
  size?: 'regular' | 'compact';
};

export function Title({ children, size = 'regular' }: Props) {
  return (
    <Text accessibilityRole="header" style={[styles.text, size === 'compact' && styles.textCompact]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.title,
    fontSize: 24,
    lineHeight: 33,
    textAlign: 'center',
    color: Palette.title,
  },
  textCompact: {
    fontSize: 22,
    lineHeight: 30,
  },
});
