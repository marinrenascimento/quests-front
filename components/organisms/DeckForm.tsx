import { View } from 'react-native';

import { FormField } from '@/components/molecules/FormField';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Field = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Mensagem de erro abaixo do campo (opcional) */
  error?: string;
};

type Props = {
  /** Campo de uma linha */
  name: Field;
  /** Campo de várias linhas */
  description: Field;
};

/** Espaço entre os campos, em px do mockup da Help */
const FIELD_GAP = 12;

/**
 * Campos do cadastro de deck: nome (uma linha) e descrição (várias linhas), no estilo
 * 'outlined' do cadastro de usuário. Os valores e erros vêm por props.
 */
export function DeckForm({ name, description }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View>
      <FormField
        variant="outlined"
        label={name.label}
        placeholder={name.placeholder}
        value={name.value}
        onChangeText={name.onChangeText}
        error={name.error}
        autoCapitalize="sentences"
        returnKeyType="next"
      />
      <View style={{ marginTop: scale(FIELD_GAP) }}>
        <FormField
          variant="outlined"
          label={description.label}
          placeholder={description.placeholder}
          value={description.value}
          onChangeText={description.onChangeText}
          error={description.error}
          autoCapitalize="sentences"
          multiline
        />
      </View>
    </View>
  );
}
