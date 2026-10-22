import { View } from 'react-native';

import { FormActions } from '@/components/molecules/FormActions';
import { FormField } from '@/components/molecules/FormField';
import {
  SearchSelectField,
  SearchSelectFieldProps,
} from '@/components/molecules/SearchSelectField';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type TextField = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  /** Mensagem de erro abaixo do campo (opcional) */
  error?: string;
  /** Foco do campo (opcional), ex.: para rolar até os botões quando eles aparecem */
  onFocus?: () => void;
  onBlur?: () => void;
};

type Props = {
  /** Campos de seleção com pesquisa e criação */
  discipline: SearchSelectFieldProps;
  content: SearchSelectFieldProps;
  /** Campos de várias linhas */
  front: TextField;
  back: TextField;
  saveLabel: string;
  cancelLabel: string;
  onSave: () => void;
  onCancel: () => void;
  /**
   * Visibilidade de cada botão (decidida no useFlashcardForm); escondidos, o espaço deles fica
   * reservado
   */
  showCancel: boolean;
  showSave: boolean;
};

// Medidas em px do mockup da Help
/** Espaço entre os campos (o mesmo do cadastro de deck) */
const FIELD_GAP = 12;
const BUTTONS_TOP = 20;

/**
 * Formulário do Novo Flashcard e do Editar Flashcard: disciplina e conteúdo (seleção com pesquisa e criação), frente
 * e verso (várias linhas) no estilo 'outlined' do cadastro e, embaixo, os botões Cancelar e
 * Salvar (FormActions), que ocupam o espaço mesmo escondidos, para o layout não pular.
 * Valores, erros, visibilidade e ações vêm por props.
 */
export function FlashcardForm({
  discipline,
  content,
  front,
  back,
  saveLabel,
  cancelLabel,
  onSave,
  onCancel,
  showCancel,
  showSave,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const fieldGap = { marginTop: scale(FIELD_GAP) };

  return (
    <View>
      <SearchSelectField {...discipline} />
      <View style={fieldGap}>
        <SearchSelectField {...content} />
      </View>
      <View style={fieldGap}>
        <FormField
          variant="outlined"
          label={front.label}
          placeholder={front.placeholder}
          value={front.value}
          onChangeText={front.onChangeText}
          error={front.error}
          onFocus={front.onFocus}
          onBlur={front.onBlur}
          autoCapitalize="sentences"
          multiline
        />
      </View>
      <View style={fieldGap}>
        <FormField
          variant="outlined"
          label={back.label}
          placeholder={back.placeholder}
          value={back.value}
          onChangeText={back.onChangeText}
          error={back.error}
          onFocus={back.onFocus}
          onBlur={back.onBlur}
          autoCapitalize="sentences"
          multiline
        />
      </View>
      <View style={{ marginTop: scale(BUTTONS_TOP) }}>
        <FormActions
          saveLabel={saveLabel}
          cancelLabel={cancelLabel}
          onSave={onSave}
          onCancel={onCancel}
          visible={showCancel || showSave}
          cancelVisible={showCancel}
          saveVisible={showSave}
        />
      </View>
    </View>
  );
}
