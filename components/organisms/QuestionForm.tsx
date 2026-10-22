import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { Label } from '@/components/atoms/Label';
import { AlternativeEditor } from '@/components/molecules/AlternativeEditor';
import { FormActions } from '@/components/molecules/FormActions';
import { FormField } from '@/components/molecules/FormField';
import { InfoCard } from '@/components/molecules/InfoCard';
import { QuestionDifficultyPicker } from '@/components/molecules/QuestionDifficultyPicker';
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
};

/** Uma alternativa da lista: os dados do AlternativeEditor e o id (chave da lista) */
export type AlternativeItem = ComponentProps<typeof AlternativeEditor> & { id: string };

type Props = {
  /** Campos de seleção com pesquisa e criação (o mesmo catálogo dos cards) */
  discipline: SearchSelectFieldProps;
  content: SearchSelectFieldProps;
  /** Campo de uma linha */
  title: TextField;
  /** Campo de várias linhas */
  statement: TextField;
  difficulty: ComponentProps<typeof QuestionDifficultyPicker>;
  alternatives: {
    label: string;
    /** Mensagem enquanto não há alternativas */
    emptyMessage: string;
    items: AlternativeItem[];
    addLabel: string;
    onAdd: () => void;
  };
  saveLabel: string;
  cancelLabel: string;
  onSave: () => void;
  onCancel: () => void;
  /** Visibilidade de cada botão (decidida no useQuestionForm); escondidos, o espaço fica reservado */
  showCancel: boolean;
  showSave: boolean;
};

// Medidas em px do mockup da Help (as mesmas do formulário do Novo Flashcard)
const FIELD_GAP = 12;
const ALTERNATIVES_GAP = 10;
const BUTTONS_TOP = 20;
const EMPTY_PADDING = 20;

/**
 * Formulário do Adicionar Questão e do Editar Questão, no estilo do Novo Flashcard: disciplina e
 * conteúdo (seleção com pesquisa e criação), título, enunciado (várias linhas), nível de
 * dificuldade (estrelas), as alternativas com o botão de adicionar e, embaixo, Cancelar e Salvar
 * (FormActions). Valores, erros, visibilidade e ações vêm por props.
 */
export function QuestionForm({
  discipline,
  content,
  title,
  statement,
  difficulty,
  alternatives,
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
          label={title.label}
          placeholder={title.placeholder}
          value={title.value}
          onChangeText={title.onChangeText}
          error={title.error}
          autoCapitalize="sentences"
          returnKeyType="next"
        />
      </View>
      <View style={fieldGap}>
        <FormField
          variant="outlined"
          label={statement.label}
          placeholder={statement.placeholder}
          value={statement.value}
          onChangeText={statement.onChangeText}
          error={statement.error}
          autoCapitalize="sentences"
          multiline
        />
      </View>
      <View style={fieldGap}>
        <QuestionDifficultyPicker {...difficulty} />
      </View>
      <View style={fieldGap}>
        <Label size="compact">{alternatives.label}</Label>
        <View style={[styles.list, { gap: scale(ALTERNATIVES_GAP) }]}>
          {alternatives.items.length === 0 ? (
            <InfoCard padding={EMPTY_PADDING}>
              <BodyText align="center">{alternatives.emptyMessage}</BodyText>
            </InfoCard>
          ) : (
            // Poucas alternativas, dentro do ScrollView da tela: um .map simples basta
            alternatives.items.map(({ id, ...item }) => <AlternativeEditor key={id} {...item} />)
          )}
        </View>
        <IconTextButton
          label={alternatives.addLabel}
          onPress={alternatives.onAdd}
          variant="compact"
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

const styles = StyleSheet.create({
  // Mesmo espaço entre rótulo e campo do FormField 'outlined', e o mesmo até o botão de adicionar
  list: {
    marginTop: 6,
    marginBottom: 12,
  },
});
