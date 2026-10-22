import { StyleSheet, Text, View } from 'react-native';

import { Checkbox } from '@/components/atoms/Checkbox';
import { CircleIconButton } from '@/components/atoms/CircleIconButton';
import { ErrorText } from '@/components/atoms/ErrorText';
import { InputField } from '@/components/atoms/InputField';
import type { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  /** Letra pela posição (A, B, C...): muda quando uma alternativa anterior é removida */
  letter: string;
  text: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  /** Rótulo do campo lido pelo leitor de tela (ex.: "Alternativa A") */
  accessibilityLabel: string;
  /** Marcada como a alternativa correta */
  correct: boolean;
  onToggleCorrect: () => void;
  correctLabel: string;
  onRemove: () => void;
  removeIcon: IconName;
  removeLabel: string;
  /** Erro abaixo do campo (ex.: alternativa sem texto). Opcional. */
  error?: string;
};

/** Lado do círculo da letra, em dp (o mesmo da altura do campo 'outlined') */
const CIRCLE = 30;
const GAP = 8;

/**
 * Uma alternativa no formulário de questão: círculo com a letra, campo de texto (que cresce com
 * o texto) e o botão de remover na mesma linha; embaixo, a caixa "Correta" e o erro. A correta
 * tem o círculo amarelo, como a alternativa escolhida na realização da prova.
 */
export function AlternativeEditor({
  letter,
  text,
  onChangeText,
  placeholder,
  accessibilityLabel,
  correct,
  onToggleCorrect,
  correctLabel,
  onRemove,
  removeIcon,
  removeLabel,
  error,
}: Props) {
  return (
    <View>
      <View style={styles.row}>
        <View style={[styles.circle, correct && styles.circleCorrect]}>
          <Text maxFontSizeMultiplier={1.2} style={styles.letter}>
            {letter}
          </Text>
        </View>
        <View style={styles.input}>
          <InputField
            variant="outlined"
            value={text}
            onChangeText={onChangeText}
            placeholder={placeholder}
            accessibilityLabel={accessibilityLabel}
            hasError={!!error}
            autoCapitalize="sentences"
            multiline
            style={styles.inputText}
          />
        </View>
        <CircleIconButton icon={removeIcon} onPress={onRemove} accessibilityLabel={removeLabel} />
      </View>
      <View style={styles.footer}>
        {error ? <ErrorText>{error}</ErrorText> : null}
        <View style={styles.checkbox}>
          <Checkbox
            label={correctLabel}
            checked={correct}
            onChange={onToggleCorrect}
            size="compact"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Palette.forest,
    backgroundColor: Palette.white,
  },
  circleCorrect: {
    borderWidth: 0,
    backgroundColor: Palette.examYellow,
  },
  letter: {
    fontFamily: FontFamily.bodyBold,
    fontSize: 13,
    color: Palette.forest,
  },
  input: {
    flex: 1,
  },
  // Campo de várias linhas mais baixo que o padrão (alternativas costumam ser curtas)
  inputText: {
    minHeight: 34,
    paddingVertical: 7,
  },
  // Alinhado com o campo de texto (depois do círculo)
  footer: {
    marginLeft: CIRCLE + GAP,
  },
  checkbox: {
    marginTop: 6,
  },
});
