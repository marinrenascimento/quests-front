import { StyleSheet, View } from 'react-native';

import { Palette } from '@/constants/theme';

/** Linha vertical fina usada entre as abas do TopBar. */
export function VerticalDivider() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  line: {
    width: 1,
    height: 22,
    marginHorizontal: 4.25,
    backgroundColor: Palette.forest,
  },
});
