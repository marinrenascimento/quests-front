import { StyleSheet, View, ViewProps } from 'react-native';

import { IconTextButton } from '@/components/atoms/IconTextButton';
import { GRID_GAP } from '@/hooks/useGridLayout';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  saveLabel: string;
  cancelLabel: string;
  onSave: () => void;
  onCancel: () => void;
  /** Quem usa decide (na lógica do formulário) se os botões aparecem */
  visible: boolean;
  /**
   * Visibilidade de cada botão, quando ela é diferente (ex.: na edição, Cancelar sempre e Salvar
   * só com alteração). Padrão: a de `visible`.
   */
  cancelVisible?: boolean;
  saveVisible?: boolean;
  /**
   * Escondidos, os botões continuam ocupando o espaço (invisíveis, sem toque e fora do leitor de
   * tela), para o layout não pular quando aparecem. false: com os dois escondidos, a linha não
   * ocupa espaço. Padrão: true.
   */
  reserveSpace?: boolean;
};

/** Props do lugar de um botão na linha: escondido, continua ocupando a mesma metade */
function slotProps(visible: boolean): ViewProps {
  return {
    pointerEvents: visible ? 'auto' : 'none',
    accessibilityElementsHidden: !visible,
    importantForAccessibility: visible ? 'auto' : 'no-hide-descendants',
    style: [styles.slot, !visible && styles.hidden],
  };
}

/**
 * Botões de um formulário lado a lado, com a mesma largura e o mesmo vão das grades: Cancelar
 * (tom claro) à esquerda e Salvar (verde escuro) à direita, como no modal de confirmação. Cada
 * um fica sempre na mesma posição, mesmo quando o outro está escondido.
 */
export function FormActions({
  saveLabel,
  cancelLabel,
  onSave,
  onCancel,
  visible,
  cancelVisible = visible,
  saveVisible = visible,
  reserveSpace = true,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  if (!cancelVisible && !saveVisible && !reserveSpace) {
    return null;
  }

  return (
    <View style={[styles.row, { gap: scale(GRID_GAP) }]}>
      <View {...slotProps(cancelVisible)}>
        <IconTextButton label={cancelLabel} onPress={onCancel} variant="block" tone="light" />
      </View>
      <View {...slotProps(saveVisible)}>
        <IconTextButton label={saveLabel} onPress={onSave} variant="block" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  // Metade da linha; o botão ('block') ocupa o lugar inteiro
  slot: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
});
