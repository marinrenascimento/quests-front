import { TextInputProps, View } from 'react-native';

import { FormActions } from '@/components/molecules/FormActions';
import { FormField } from '@/components/molecules/FormField';
import { InfoCard } from '@/components/molecules/InfoCard';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

/** Um campo do formulário: rótulo, valor, erro e as opções do teclado */
export type ProfileFormField = Pick<
  TextInputProps,
  'value' | 'placeholder' | 'onChangeText' | 'secureTextEntry' | 'keyboardType' | 'autoCapitalize'
> & {
  label: string;
  error?: string;
};

type Props = {
  title: string;
  fields: ProfileFormField[];
  saveLabel: string;
  cancelLabel: string;
  onSave: () => void;
  onCancel: () => void;
  /** Só com algo a salvar: sem nada, os botões não ocupam espaço */
  showActions: boolean;
};

// Medidas em px do mockup da Help (as mesmas dos outros formulários)
const FIELD_GAP = 12;
const BUTTONS_TOP = 16;

/**
 * Cartão de um formulário do Perfil (dados da conta ou senha): título, campos no estilo 'outlined'
 * do cadastro e os botões Cancelar e Salvar, que só aparecem com algo a salvar.
 */
export function ProfileFormCard({
  title,
  fields,
  saveLabel,
  cancelLabel,
  onSave,
  onCancel,
  showActions,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <InfoCard title={title}>
      <View style={{ gap: scale(FIELD_GAP) }}>
        {/* Poucos campos fixos: um .map simples basta */}
        {fields.map(({ label, error, ...input }) => (
          <FormField
            key={label}
            variant="outlined"
            label={label}
            error={error}
            autoCorrect={false}
            {...input}
          />
        ))}
      </View>
      {showActions ? (
        <View style={{ marginTop: scale(BUTTONS_TOP) }}>
          <FormActions
            saveLabel={saveLabel}
            cancelLabel={cancelLabel}
            onSave={onSave}
            onCancel={onCancel}
            visible
          />
        </View>
      ) : null}
    </InfoCard>
  );
}
