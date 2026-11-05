import { View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { Checkbox } from '@/components/atoms/Checkbox';
import { FormActions } from '@/components/molecules/FormActions';
import { InfoCard } from '@/components/molecules/InfoCard';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  title: string;
  twoFactorLabel: string;
  twoFactorText: string;
  twoFactorEnabled: boolean;
  onTwoFactorChange: (enabled: boolean) => void;
  dataText: string;
  exportLabel: string;
  deleteLabel: string;
  onExport: () => void;
  onDelete: () => void;
};

// Medidas em px do mockup da Help
const TEXT_GAP = 6;
const SECTION_GAP = 14;
const BUTTONS_TOP = 10;

/**
 * Cartão de privacidade e segurança do Perfil, com o que a ajuda (Help > Privacidade) promete:
 * autenticação em duas etapas e os pedidos de exportar os dados e de excluir a conta.
 */
export function ProfileSecurityCard({
  title,
  twoFactorLabel,
  twoFactorText,
  twoFactorEnabled,
  onTwoFactorChange,
  dataText,
  exportLabel,
  deleteLabel,
  onExport,
  onDelete,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <InfoCard title={title}>
      <Checkbox
        label={twoFactorLabel}
        checked={twoFactorEnabled}
        onChange={onTwoFactorChange}
        size="compact"
      />
      <BodyText style={{ marginTop: scale(TEXT_GAP) }}>{twoFactorText}</BodyText>
      <BodyText style={{ marginTop: scale(SECTION_GAP) }}>{dataText}</BodyText>
      <View style={{ marginTop: scale(BUTTONS_TOP) }}>
        {/* Excluir (claro) e a ação principal (escuro), como no Visualizar Questão */}
        <FormActions
          cancelLabel={deleteLabel}
          saveLabel={exportLabel}
          onCancel={onDelete}
          onSave={onExport}
          visible
        />
      </View>
    </InfoCard>
  );
}
