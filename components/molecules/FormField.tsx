import { StyleSheet, TextInputProps, View } from 'react-native';

import { ErrorText } from '@/components/atoms/ErrorText';
import { InputField } from '@/components/atoms/InputField';
import { Label } from '@/components/atoms/Label';

type Props = TextInputProps & {
  label: string;
  /** 'filled' (login) ou 'outlined' (cadastro); também define o tamanho do label */
  variant?: 'filled' | 'outlined';
  error?: string;
};

export function FormField({ label, variant = 'filled', error, ...inputProps }: Props) {
  const outlined = variant === 'outlined';

  return (
    <View>
      <Label size={outlined ? 'compact' : 'regular'}>{label}</Label>
      <View style={outlined ? styles.gapCompact : styles.gapRegular} />
      <InputField variant={variant} hasError={!!error} accessibilityLabel={label} {...inputProps} />
      {error ? <ErrorText>{error}</ErrorText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  gapRegular: {
    height: 7,
  },
  gapCompact: {
    height: 6,
  },
});
