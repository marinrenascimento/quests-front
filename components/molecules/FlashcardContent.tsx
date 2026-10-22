import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { CircleIconButton } from '@/components/atoms/CircleIconButton';
import { PixelText } from '@/components/atoms/PixelText';
import { CardAction, CardActionKey } from '@/constants/decks';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  cardId: string;
  /** Rótulo "Disciplina - Tema" no topo */
  label: string;
  title: string;
  /** Botões do canto inferior direito; sem ações (ex.: cards vinculados), a linha não aparece */
  actions?: CardAction[];
  /** Recebe a ação e o id do card: uma função só, estável, para todos os cards */
  onAction?: (action: CardActionKey, cardId: string) => void;
  /** Máximo de linhas do rótulo do topo (padrão: 2, como nos cards de um deck) */
  labelLines?: number;
  /** Peso do rótulo e do texto do rodapé (padrão: regular) */
  labelWeight?: 'regular' | 'medium';
  /**
   * Texto do canto inferior esquerdo (ex.: a dificuldade de uma questão), alinhado pelo centro
   * com os botões. Sem ele, os botões ficam sozinhos à direita, como nos cards de um deck.
   */
  footerLabel?: string;
};

// Medidas do mockup dos cards de um deck convertidas para a escala da Help, em px
const LABEL_SIZE = 8.2;
const LABEL_LINE_HEIGHT = 9.6;
const TITLE_SIZE = 6;
const TITLE_LETTER_SPACING = 0.8;
const TITLE_LINE_HEIGHT = 10;
const TITLE_MARGIN = 4;
const ACTIONS_GAP = 3;
/** Espaço mínimo entre o texto do rodapé e os botões */
const FOOTER_GAP = 4;

/**
 * Conteúdo de um flashcard (e do card de uma questão): rótulo no topo (até 2 linhas, ou o que
 * labelLines definir), título centralizado na área livre (até 2 linhas) e os botões de ação no
 * canto inferior direito, com um texto opcional à esquerda deles. Ocupa toda a altura do cartão;
 * como as linhas são limitadas, o título nunca passa por baixo dos botões.
 * Memorizado: numa lista grande só re-renderiza se os próprios dados mudarem.
 */
export const FlashcardContent = memo(function FlashcardContent({
  cardId,
  label,
  title,
  actions = [],
  onAction,
  labelLines = 2,
  labelWeight = 'regular',
  footerLabel,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const hasActions = actions.length > 0 && onAction !== undefined;
  const buttons = hasActions
    ? actions.map((action) => (
        <CircleIconButton
          key={action.key}
          icon={action.icon}
          accessibilityLabel={action.label}
          onPress={() => onAction(action.key, cardId)}
        />
      ))
    : null;

  return (
    <View style={styles.container}>
      <BodyText
        size={scale(LABEL_SIZE)}
        lineHeight={scale(LABEL_LINE_HEIGHT)}
        numberOfLines={labelLines}
        weight={labelWeight}>
        {label}
      </BodyText>
      <View style={[styles.titleArea, { marginVertical: scale(TITLE_MARGIN) }]}>
        <PixelText
          size={scale(TITLE_SIZE)}
          letterSpacing={scale(TITLE_LETTER_SPACING)}
          lineHeight={scale(TITLE_LINE_HEIGHT)}
          numberOfLines={2}
          color={Palette.forest}
          style={styles.title}>
          {title}
        </PixelText>
      </View>
      {footerLabel !== undefined ? (
        // Rodapé: o texto ocupa o que sobra à esquerda e diminui se não couber numa linha
        <View style={[styles.footer, { gap: scale(FOOTER_GAP) }]}>
          <BodyText
            size={scale(LABEL_SIZE)}
            lineHeight={scale(LABEL_LINE_HEIGHT)}
            numberOfLines={1}
            adjustsFontSizeToFit
            weight={labelWeight}
            style={styles.footerLabel}>
            {footerLabel}
          </BodyText>
          {buttons ? (
            <View style={[styles.footerActions, { gap: scale(ACTIONS_GAP) }]}>{buttons}</View>
          ) : null}
        </View>
      ) : buttons ? (
        <View style={[styles.actions, { gap: scale(ACTIONS_GAP) }]}>{buttons}</View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Área entre o rótulo e os botões: o título fica centralizado nela
  titleArea: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLabel: {
    flex: 1,
  },
  footerActions: {
    flexDirection: 'row',
  },
});
