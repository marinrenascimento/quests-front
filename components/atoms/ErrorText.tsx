import { StyleSheet, Text } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  children: string;
};

export function ErrorText({ children }: Props) {
  return (
    <Text accessibilityRole="alert" style={styles.text}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    marginTop: 3,
    fontFamily: FontFamily.link,
    fontSize: 12,
    color: Palette.error,
  },
});
