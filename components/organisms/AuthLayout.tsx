import { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette } from '@/constants/theme';

type Props = {
  /** Capa no topo (ex.: <AuthHeader />), encostada nas bordas e sob a barra de status */
  header: ReactNode;
  children: ReactNode;
};

/**
 * Esqueleto comum das telas de autenticação: capa + área branca com o formulário,
 * dentro de KeyboardAvoidingView + ScrollView para o teclado não cobrir os campos.
 * Recebe a capa por prop (e não importa o AuthHeader) para não acoplar um organism a outro.
 */
export function AuthLayout({ header, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {header}
        <View style={[styles.content, { paddingBottom: insets.bottom + 12 }]}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 6,
    paddingHorizontal: 16,
    backgroundColor: Palette.white,
  },
});
