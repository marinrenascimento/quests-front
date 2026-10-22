import { View } from 'react-native';

import { FormActions } from '@/components/molecules/FormActions';
import {
  SearchSelectField,
  SearchSelectFieldProps,
} from '@/components/molecules/SearchSelectField';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Seleção com pesquisa, sem criação */
  discipline: SearchSelectFieldProps;
  content: SearchSelectFieldProps;
  /** Select simples (sem pesquisa nem criação) */
  quantity: SearchSelectFieldProps;
  cancelLabel: string;
  studyLabel: string;
  onCancel: () => void;
  onStudy: () => void;
};

// Medidas em px do mockup da Help (as mesmas do formulário do Novo Flashcard)
const FIELD_GAP = 12;
const BUTTONS_TOP = 20;

/**
 * Formulário de Configurar Deck por Disciplina: disciplina e conteúdo (seleção com pesquisa,
 * sem criação), quantidade de flashcards (select simples) e, embaixo, os botões Cancelar (tom
 * claro) e Estudar Agora (verde escuro), sempre visíveis. Valores, erros e ações vêm por props.
 */
export function DisciplineStudyForm({
  discipline,
  content,
  quantity,
  cancelLabel,
  studyLabel,
  onCancel,
  onStudy,
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
        <SearchSelectField {...quantity} searchable={false} />
      </View>
      <View style={{ marginTop: scale(BUTTONS_TOP) }}>
        <FormActions
          cancelLabel={cancelLabel}
          saveLabel={studyLabel}
          onCancel={onCancel}
          onSave={onStudy}
          visible
        />
      </View>
    </View>
  );
}
