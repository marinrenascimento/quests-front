import { StyleSheet, View } from 'react-native';

import { IconTextButton } from '@/components/atoms/IconTextButton';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { GRID_GAP } from '@/hooks/useGridLayout';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

export type HeaderAction = {
  key: string;
  label: string;
  onPress: () => void;
};

type Props = {
  title: string;
  onBack: () => void;
  backLabel: string;
  /** Título variável (ex.: nome do deck): diminui a fonte se não couber */
  fitTitle?: boolean;
  /** Botões lado a lado, com a mesma largura, abaixo do título (opcional) */
  actions?: HeaderAction[];
};

// Medidas do mockup de Meus Decks convertidas para a escala da Help, em px
const BUTTONS_TOP = 12;
/** Espaço entre o cabeçalho e o que vem embaixo (a grade) */
const BOTTOM = 14;

/**
 * Topo das telas de grade (Meus Decks, cards de um deck): voltar + título e, embaixo, os
 * botões de ação lado a lado, com o mesmo vão das colunas da grade.
 */
export function ListPageHeader({ title, onBack, backLabel, fitTitle, actions = [] }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={{ marginBottom: scale(BOTTOM) }}>
      <ReportHeader title={title} onBack={onBack} backLabel={backLabel} fitTitle={fitTitle} />
      {actions.length > 0 ? (
        <View style={[styles.buttons, { gap: scale(GRID_GAP), marginTop: scale(BUTTONS_TOP) }]}>
          {actions.map((action) => (
            <IconTextButton
              key={action.key}
              label={action.label}
              onPress={action.onPress}
              variant="block"
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
  },
});
