import { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { Label } from '@/components/atoms/Label';
import { AlternativeOption } from '@/components/molecules/AlternativeOption';
import { DifficultyStars } from '@/components/molecules/DifficultyStars';
import { ReadOnlyField } from '@/components/molecules/ReadOnlyField';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Field = {
  label: string;
  value: string;
};

type Props = {
  title: Field;
  discipline: Field;
  content: Field;
  /** Nome da dificuldade e as estrelas (a mesma escala da realização da prova) */
  difficulty: Field & { stars: ComponentProps<typeof DifficultyStars> };
  statement: Field;
  alternatives: {
    label: string;
    /** Letra, texto e se é a correta (destacada), na ordem */
    items: { id: string; letter: string; text: string; correct: boolean }[];
    /** Lido pelo leitor de tela junto com a correta (ex.: "Correta") */
    correctLabel: string;
  };
};

/** Espaço entre os campos em px do mockup da Help (o mesmo do formulário) */
const FIELD_GAP = 12;
const ALTERNATIVES_GAP = 7;

/**
 * Dados de uma questão, somente leitura: título, disciplina, conteúdo, dificuldade (nome e
 * estrelas), enunciado e as alternativas, com a correta destacada no mesmo visual da alternativa
 * escolhida na realização da prova. Nada é tocável. Rótulos e valores vêm por props.
 */
export function QuestionDetails({
  title,
  discipline,
  content,
  difficulty,
  statement,
  alternatives,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const fieldGap = { marginTop: scale(FIELD_GAP) };

  return (
    <View>
      <ReadOnlyField label={title.label} value={title.value} />
      <View style={fieldGap}>
        <ReadOnlyField label={discipline.label} value={discipline.value} />
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={content.label} value={content.value} />
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={difficulty.label} value={difficulty.value} />
        <View style={styles.stars}>
          <DifficultyStars {...difficulty.stars} />
        </View>
      </View>
      <View style={fieldGap}>
        <ReadOnlyField label={statement.label} value={statement.value} multiline />
      </View>
      <View style={fieldGap}>
        <Label size="compact">{alternatives.label}</Label>
        <View style={[styles.alternatives, { gap: scale(ALTERNATIVES_GAP) }]}>
          {/* Poucas alternativas, dentro do ScrollView da tela: um .map simples basta */}
          {alternatives.items.map((item) => (
            <AlternativeOption
              key={item.id}
              letter={item.letter}
              text={item.text}
              selected={item.correct}
              statusLabel={item.correct ? alternatives.correctLabel : undefined}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stars: {
    marginTop: 6,
  },
  // Mesmo espaço entre rótulo e campo do FormField 'outlined'
  alternatives: {
    marginTop: 6,
  },
});
