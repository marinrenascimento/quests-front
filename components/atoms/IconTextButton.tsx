import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  label: string;
  /** Ícone à esquerda do texto (opcional) */
  icon?: IconName;
  onPress: () => void;
  /**
   * 'support' (padrão): largura fixa e centralizado, texto semi-negrito, como o "Falar com o
   * suporte". 'block': ocupa a largura que o pai der (flex 1), mais alto, texto de peso médio,
   * como os botões de Meus Decks. 'compact': mesmo estilo do 'block', mas com a largura do
   * texto (mais o espaço lateral), para ficar ao lado de outro conteúdo (ex.: "Encerrar Revisão").
   * 'dialog': como o 'block' (flex 1), com texto maior, para os botões lado a lado de um modal.
   * 'action': como o 'compact' (largura do texto), mais alto, com mais espaço lateral e texto
   * semi-negrito (ex.: "Entregar prova").
   */
  variant?: 'support' | 'block' | 'compact' | 'dialog' | 'action';
  /** Desabilitado: opacidade reduzida, sem toque e informado ao leitor de tela */
  disabled?: boolean;
  /**
   * 'dark' (padrão): fundo verde escuro e texto branco. 'light': fundo verde sálvia (o dos
   * cartões) e texto verde escuro, para a opção secundária ao lado de um botão escuro.
   */
  tone?: 'dark' | 'light';
};

// Medidas do mockup da Help, em px
const VARIANTS = {
  support: { height: 28.5, radius: 6, paddingHorizontal: 10, fontSize: 10.5 },
  block: { height: 33, radius: 7, paddingHorizontal: 8, fontSize: 9.5 },
  // Medidas do mockup da revisão de um deck convertidas para a escala da Help
  compact: { height: 31, radius: 5, paddingHorizontal: 12, fontSize: 10.5 },
  // Medidas do mockup do modal de confirmação convertidas para a escala da Help
  dialog: { height: 33, radius: 7, paddingHorizontal: 8, fontSize: 11 },
  // Medidas do mockup da realização de prova (38, 8, 20 e 13px) convertidas para a escala da Help
  action: { height: 33.8, radius: 7.1, paddingHorizontal: 17.8, fontSize: 11.5 },
};
const SUPPORT_WIDTH = 177.5;
const ICON_SIZE = 14;
const ICON_GAP = 5;
/** Área de toque mínima recomendada, em dp: botões mais baixos ganham hitSlop vertical */
const MIN_TOUCH = 44;

/**
 * Botão compacto de cor sólida (verde escuro ou, no tom claro, verde sálvia), com ícone opcional
 * à esquerda do texto em sem serifa, sem caixa alta. Diferente do PrimaryButton (degradê,
 * largura total e texto em caixa alta), usado no login e cadastro.
 */
export function IconTextButton({
  label,
  icon,
  onPress,
  variant = 'support',
  tone = 'dark',
  disabled = false,
}: Props) {
  const { scale, layoutWidth } = useMockupScale(HELP_MOCKUP_WIDTH);
  const size = VARIANTS[variant];
  const isSupport = variant === 'support';
  const isLight = tone === 'light';
  const fitsText = variant === 'compact' || variant === 'action';
  const slop = Math.max(0, (MIN_TOUCH - scale(size.height)) / 2);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={disabled ? { disabled } : undefined}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{ top: slop, bottom: slop }}
      style={({ pressed }) => [
        styles.button,
        isLight && styles.buttonLight,
        isSupport
          ? {
              // Em telas estreitas (ou fonte grande) o botão não passa da largura útil
              width: scale(SUPPORT_WIDTH),
              maxWidth: layoutWidth - scale(30),
            }
          : fitsText
            ? styles.compact
            : styles.block,
        {
          minHeight: scale(size.height),
          borderRadius: scale(size.radius),
          paddingHorizontal: scale(size.paddingHorizontal),
          gap: scale(ICON_GAP),
          boxShadow: [
            { offsetX: 0, offsetY: scale(1.5), blurRadius: scale(3), color: Palette.cardShadow },
          ],
        },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      {icon ? (
        <MaterialCommunityIcons
          name={icon}
          size={scale(ICON_SIZE)}
          color={isLight ? Palette.forest : Palette.white}
        />
      ) : null}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        maxFontSizeMultiplier={1.3}
        style={[
          styles.label,
          isLight && styles.labelLight,
          isSupport || variant === 'action' ? styles.labelSupport : styles.labelBlock,
          { fontSize: scale(size.fontSize) },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Palette.forest,
  },
  buttonLight: {
    backgroundColor: Palette.rankCard,
  },
  block: {
    flex: 1,
    alignSelf: 'stretch',
  },
  // Largura do texto: não encolhe ao lado de um título flexível
  compact: {
    flexShrink: 0,
  },
  label: {
    flexShrink: 1,
    color: Palette.white,
  },
  labelLight: {
    color: Palette.forest,
  },
  labelSupport: {
    fontFamily: FontFamily.buttonCompact,
  },
  labelBlock: {
    fontFamily: FontFamily.buttonMedium,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.45,
  },
});
