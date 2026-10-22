import { View } from 'react-native';

import { ReadOnlyField } from '@/components/molecules/ReadOnlyField';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Field = {
  label: string;
  value: string;
};

type Props = {
  discipline: Field;
  content: Field;
  front: Field;
  back: Field;
};

/** Espaço entre os campos em px do mockup da Help (o mesmo do FlashcardForm) */
const FIELD_GAP = 12;

/**
 * Dados de um flashcard, somente leitura: disciplina, conteúdo, frente e verso, na ordem e com
 * o espaçamento do FlashcardForm, sem botões. Frente e verso têm a altura mínima dos campos de
 * várias linhas; todos crescem com o texto. Rótulos e valores vêm por props.
 */
export function FlashcardDetails({ discipline, content, front, back }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const fieldGap = { marginTop: scale(FIELD_GAP) };

  return (
    <View>
      <ReadOnlyField label={discipline.label} value={discipline.value} />
      <View style={fieldGap}>
        <ReadOnlyField label={content.label} value={content.value} />
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={front.label} value={front.value} multiline />
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={back.label} value={back.value} multiline />
      </View>
    </View>
  );
}
