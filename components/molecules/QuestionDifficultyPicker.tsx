import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorText } from '@/components/atoms/ErrorText';
import { Label } from '@/components/atoms/Label';
import type { IconName } from '@/constants/helpContent';
import { FontFamily, Palette } from '@/constants/theme';

export type DifficultyPickerOption = {
  value: string;
  /** Nome da dificuldade (ex.: "Médio") */
  label: string;
  /** Estrelas preenchidas, na mesma escala da realização da prova */
  stars: number;
  /** Lido pelo leitor de tela (ex.: "Dificuldade: Médio, 3 de 5 estrelas") */
  accessibilityLabel: string;
};

type Props = {
  label: string;
  options: DifficultyPickerOption[];
  /** Valor escolhido (sem valor: nenhum) */
  selected?: string;
  onSelect: (value: string) => void;
  /** Total de estrelas de cada opção */
  maxStars: number;
  starIcon: IconName;
  starOutlineIcon: IconName;
  /** Erro abaixo das opções (opcional) */
  error?: string;
};

const STAR_SIZE = 12;
const OPTION_GAP = 8;

/**
 * Escolha do nível de dificuldade de uma questão: rótulo e as opções lado a lado, cada uma com
 * as estrelas (a mesma escala da realização da prova) e o nome. A escolhida fica com fundo verde
 * sálvia e borda verde escura. Só uma fica escolhida por vez.
 */
export function QuestionDifficultyPicker({
  label,
  options,
  selected,
  onSelect,
  maxStars,
  starIcon,
  starOutlineIcon,
  error,
}: Props) {
  return (
    <View>
      <Label size="compact">{label}</Label>
      <View accessibilityRole="radiogroup" style={styles.row}>
        {options.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="radio"
              accessibilityLabel={option.accessibilityLabel}
              accessibilityState={{ checked: isSelected }}
              onPress={() => onSelect(option.value)}
              style={({ pressed }) => [
                styles.option,
                isSelected && styles.optionSelected,
                !!error && !isSelected && styles.optionError,
                pressed && styles.pressed,
              ]}>
              <View style={styles.stars}>
                {Array.from({ length: maxStars }, (_, index) => (
                  <MaterialCommunityIcons
                    key={index}
                    name={index < option.stars ? starIcon : starOutlineIcon}
                    size={STAR_SIZE}
                    color={Palette.forest}
                  />
                ))}
              </View>
              <Text maxFontSizeMultiplier={1.3} style={styles.optionLabel}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo espaço entre rótulo e campo do FormField 'outlined'
  row: {
    flexDirection: 'row',
    gap: OPTION_GAP,
    marginTop: 6,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.inputBorder,
    backgroundColor: Palette.white,
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: Palette.forest,
    backgroundColor: Palette.rankCard,
  },
  optionError: {
    borderColor: Palette.error,
  },
  stars: {
    flexDirection: 'row',
  },
  optionLabel: {
    marginTop: 4,
    fontFamily: FontFamily.bodyMedium,
    fontSize: 13,
    color: Palette.forest,
  },
  pressed: {
    opacity: 0.8,
  },
});
