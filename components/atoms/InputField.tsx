import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = TextInputProps & {
  /** 'filled': fundo cinza sem borda (login). 'outlined': fundo branco com borda verde-clara (cadastro). */
  variant?: 'filled' | 'outlined';
  hasError?: boolean;
};

export function InputField({ variant = 'filled', hasError = false, style, ...rest }: Props) {
  return (
    <TextInput
      placeholderTextColor={Palette.placeholder}
      style={[styles.base, styles[variant], hasError && styles.error, style]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: FontFamily.input,
    color: Palette.text,
    paddingVertical: 0,
  },
  filled: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 18,
    fontSize: 15,
    backgroundColor: Palette.inputFill,
    borderWidth: 1,
    borderColor: Palette.inputFill,
  },
  outlined: {
    height: 34,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.inputBorder,
  },
  error: {
    borderColor: Palette.error,
  },
});
