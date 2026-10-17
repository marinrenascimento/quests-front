import { StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  children: string;
  /** 'regular' (login, preto) ou 'compact' (cadastro, verde escuro) */
  size?: 'regular' | 'compact';
};

export function Label({ children, size = 'regular' }: Props) {
  return <Text style={[styles.text, size === 'compact' && styles.textCompact]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: FontFamily.label,
    fontSize: 16,
    lineHeight: 19,
    color: Palette.text,
  },
  textCompact: {
    fontSize: 14,
    lineHeight: 17,
    color: Palette.labelGreen,
  },
});
