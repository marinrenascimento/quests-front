import { StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  children: string;
  /** Mesma altura mínima do campo de várias linhas (frente e verso) */
  multiline?: boolean;
};

/**
 * Valor somente leitura com a aparência do campo 'outlined' do InputField (fundo branco, borda
 * verde-clara, mesmos raio, margens e fonte), mas em texto: sem cursor, teclado nem placeholder.
 * Quebra em quantas linhas precisar e cresce com o texto.
 */
export function ReadOnlyValue({ children, multiline = false }: Props) {
  return (
    <View style={[styles.box, multiline && styles.multiline]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

// Mesmas medidas do InputField 'outlined', com altura mínima no lugar da fixa
const styles = StyleSheet.create({
  box: {
    minHeight: 34,
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Palette.white,
    borderWidth: 1,
    borderColor: Palette.inputBorder,
  },
  multiline: {
    minHeight: 96,
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  text: {
    fontFamily: FontFamily.input,
    fontSize: 14,
    color: Palette.text,
  },
});
