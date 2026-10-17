/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

/**
 * Paleta do Quests, extraída do mockup das telas de login/cadastro.
 * As telas de autenticação usam sempre esta paleta (o mockup só tem versão clara).
 */
export const Palette = {
  white: '#FFFFFF',
  /** Verde escuro dos títulos */
  title: '#0D4535',
  /** Verde escuro dos botões (início e fim do degradê do PrimaryButton) */
  primaryGradient: ['#1A5546', '#0F4235'] as const,
  primaryShadow: '#0B3127',
  /** Texto e borda do SecondaryButton */
  secondaryText: '#154235',
  secondaryBorder: '#3E5F57',
  /** Textos escuros: labels do login e "Lembrar de mim" */
  text: '#111111',
  /** Labels do cadastro (verde quase preto) */
  labelGreen: '#0F3329',
  /** Campo 'filled' (login) */
  inputFill: '#F1F1F3',
  /** Borda verde-clara do campo 'outlined' (cadastro) */
  inputBorder: '#C3D4CF',
  placeholder: '#B9B9BC',
  /** Link "Esqueceu sua senha?" */
  link: '#DD8A3E',
  /** Checkbox */
  checkbox: '#FFBC00',
  checkmark: '#1A1A1A',
  error: '#D32F2F',
  /** Fundo verde-sálvia do TopBar */
  sage: '#A4C8AD',
  /** Verde escuro do TopBar: abas inativas, divisores, pílula e silhueta do avatar */
  forest: '#123A32',
};

/**
 * Famílias carregadas em app/_layout.tsx (@expo-google-fonts).
 * Mockups: títulos e campos em Poppins; labels, botões e link em Inter; TopBar em Roboto.
 */
export const FontFamily = {
  title: 'Poppins_800ExtraBold',
  input: 'Poppins_400Regular',
  label: 'Inter_700Bold',
  button: 'Inter_700Bold',
  buttonSecondary: 'Inter_600SemiBold',
  link: 'Inter_500Medium',
  topBarTab: 'Roboto_700Bold',
  topBarCoins: 'Roboto_500Medium',
  topBarName: 'Roboto_400Regular',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
