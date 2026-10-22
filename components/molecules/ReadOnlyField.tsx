import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/atoms/Label';
import { ReadOnlyValue } from '@/components/atoms/ReadOnlyValue';

type Props = {
  label: string;
  value: string;
  /** Caixa com a altura mínima do campo de várias linhas */
  multiline?: boolean;
};

/**
 * Rótulo + valor somente leitura, no estilo do FormField 'outlined' (mesmo rótulo e mesmo
 * espaço até a caixa). O leitor de tela lê os dois juntos, "rótulo, valor".
 */
export function ReadOnlyField({ label, value, multiline }: Props) {
  return (
    <View accessible accessibilityLabel={`${label}, ${value}`}>
      <Label size="compact">{label}</Label>
      <View style={styles.labelGap} />
      <ReadOnlyValue multiline={multiline}>{value}</ReadOnlyValue>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo espaço entre rótulo e campo do FormField 'outlined'
  labelGap: {
    height: 6,
  },
});
