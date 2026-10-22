import { Modal, StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { CornerFrame } from '@/components/atoms/CornerFrame';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  visible: boolean;
  /** Pergunta no topo (exibida em caixa alta) */
  title: string;
  /**
   * Texto em destaque dentro da moldura de cantos (ex.: nome do deck), em caixa alta. Opcional:
   * sem ele (ou vazio), a moldura não aparece e os botões ficam logo abaixo da pergunta.
   */
  highlight?: string;
  /**
   * Máximo de linhas do destaque (padrão: 2). Com 1 (ex.: um e-mail, que não deve quebrar), a
   * fonte diminui até o texto inteiro caber numa linha.
   */
  highlightLines?: number;
  /**
   * Frase entre a moldura e os botões (ex.: "Foram respondidas 3 de 9 questões."). Opcional: sem
   * ela, o modal fica como antes.
   */
  description?: string;
  /** Botão claro, à esquerda (ex.: "Sim"); sozinho (sem cancelLabel), fica escuro */
  confirmLabel: string;
  /**
   * Botão escuro, à direita (ex.: "Não"). Opcional: sem ele, o modal é só um aviso, com o botão
   * de confirmar sozinho (ex.: "Entendi").
   */
  cancelLabel?: string;
  onConfirm: () => void;
  /** Também chamado pelo voltar do Android */
  onCancel: () => void;
};

// Medidas do mockup do modal de confirmação convertidas para a escala da Help, em px
const MARGIN = 24;
const RADIUS = 17;
const PADDING_HORIZONTAL = 20;
const PADDING_VERTICAL = 24;
const TITLE_SIZE = 17;
const TITLE_LINE_HEIGHT = 21.6;
const FRAME_TOP = 16;
const HIGHLIGHT_SIZE = 7;
const HIGHLIGHT_LETTER_SPACING = 1;
const HIGHLIGHT_LINE_HEIGHT = 13;
/** Frase opcional: 15dp numa tela de 360dp, convertidos para a escala da Help */
const DESCRIPTION_TOP = 14;
const DESCRIPTION_SIZE = 12.9;
const DESCRIPTION_LINE_HEIGHT = 17;
const BUTTONS_TOP = 18;
const BUTTONS_WIDTH = 177;
const BUTTONS_GAP = 12;
/** Em telas largas a caixa para de crescer nesta largura (dp) */
const MAX_WIDTH = 420;

/**
 * Modal de confirmação: caixa branca centralizada com a pergunta, um texto em destaque numa
 * moldura de cantos e dois botões lado a lado (confirmar, claro, à esquerda; cancelar, escuro,
 * à direita), ou um botão só, nos avisos. Sem fundo escurecido: a sobreposição é transparente e só bloqueia os toques na
 * tela de baixo (tocar fora da caixa não faz nada); a caixa se destaca pela sombra.
 */
export function ConfirmModal({
  visible,
  title,
  highlight,
  highlightLines = 2,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onCancel}>
      <View style={[styles.overlay, { paddingHorizontal: scale(MARGIN) }]}>
        <View
          accessibilityViewIsModal
          style={[
            styles.box,
            {
              borderRadius: scale(RADIUS),
              paddingHorizontal: scale(PADDING_HORIZONTAL),
              paddingVertical: scale(PADDING_VERTICAL),
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: scale(8),
                  blurRadius: scale(24),
                  color: Palette.modalShadowWide,
                },
                {
                  offsetX: 0,
                  offsetY: scale(2),
                  blurRadius: scale(6),
                  color: Palette.modalShadowNear,
                },
              ],
            },
          ]}>
          <BodyText
            size={scale(TITLE_SIZE)}
            lineHeight={scale(TITLE_LINE_HEIGHT)}
            weight="bold"
            align="center"
            style={styles.title}>
            {title}
          </BodyText>
          {highlight ? (
            <View style={[styles.frame, { marginTop: scale(FRAME_TOP) }]}>
              <CornerFrame>
                <PixelText
                  size={scale(HIGHLIGHT_SIZE)}
                  letterSpacing={scale(HIGHLIGHT_LETTER_SPACING)}
                  lineHeight={scale(HIGHLIGHT_LINE_HEIGHT)}
                  numberOfLines={highlightLines}
                  adjustsFontSizeToFit
                  color={Palette.forest}
                  style={styles.highlight}>
                  {highlight}
                </PixelText>
              </CornerFrame>
            </View>
          ) : null}
          {description ? (
            <BodyText
              size={scale(DESCRIPTION_SIZE)}
              lineHeight={scale(DESCRIPTION_LINE_HEIGHT)}
              align="center"
              style={[styles.description, { marginTop: scale(DESCRIPTION_TOP) }]}>
              {description}
            </BodyText>
          ) : null}
          <View
            style={[
              styles.buttons,
              {
                width: scale(BUTTONS_WIDTH),
                gap: scale(BUTTONS_GAP),
                marginTop: scale(BUTTONS_TOP),
              },
            ]}>
            <IconTextButton
              label={confirmLabel}
              onPress={onConfirm}
              variant="dialog"
              tone={cancelLabel ? 'light' : 'dark'}
            />
            {cancelLabel ? (
              <IconTextButton label={cancelLabel} onPress={onCancel} variant="dialog" />
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Sem cor de fundo: nada escurece atrás da caixa
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    alignItems: 'center',
    backgroundColor: Palette.white,
  },
  title: {
    alignSelf: 'stretch',
    textTransform: 'uppercase',
  },
  frame: {
    alignSelf: 'stretch',
  },
  highlight: {
    alignSelf: 'stretch',
    textAlign: 'center',
  },
  description: {
    alignSelf: 'stretch',
  },
  buttons: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
});
