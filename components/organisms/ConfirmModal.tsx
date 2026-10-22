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
  /** Botão claro, à esquerda (ex.: "Sim") */
  confirmLabel: string;
  /** Botão escuro, à direita (ex.: "Não") */
  cancelLabel: string;
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
const BUTTONS_TOP = 18;
const BUTTONS_WIDTH = 177;
const BUTTONS_GAP = 12;
/** Em telas largas a caixa para de crescer nesta largura (dp) */
const MAX_WIDTH = 420;

/**
 * Modal de confirmação: caixa branca centralizada com a pergunta, um texto em destaque numa
 * moldura de cantos e dois botões lado a lado (confirmar, claro, à esquerda; cancelar, escuro,
 * à direita). Sem fundo escurecido: a sobreposição é transparente e só bloqueia os toques na
 * tela de baixo (tocar fora da caixa não faz nada); a caixa se destaca pela sombra.
 */
export function ConfirmModal({
  visible,
  title,
  highlight,
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
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  color={Palette.forest}
                  style={styles.highlight}>
                  {highlight}
                </PixelText>
              </CornerFrame>
            </View>
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
              tone="light"
            />
            <IconTextButton label={cancelLabel} onPress={onCancel} variant="dialog" />
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
  buttons: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
});
