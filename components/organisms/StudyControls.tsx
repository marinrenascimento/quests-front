import { StyleSheet, View } from 'react-native';

import { IconButton } from '@/components/atoms/IconButton';
import { DifficultyOption } from '@/components/molecules/DifficultyOption';
import { IconName } from '@/constants/helpContent';
import { Difficulty, DifficultyConfig } from '@/constants/study';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Opções na ordem da tela */
  options: DifficultyConfig[];
  /** Opção marcada (null: nenhuma) */
  selected: Difficulty | null;
  onSelect: (value: Difficulty) => void;
  /** Botão de avançar à direita das opções */
  nextIcon: IconName;
  nextLabel: string;
  onNext: () => void;
};

// Medidas do mockup da revisão de um deck convertidas para a escala da Help, em px
const NEXT_ICON_SIZE = 28;
/** Coluna da seta: as opções dividem igualmente o resto da largura */
const NEXT_COLUMN = 36;

/**
 * Linha de controles abaixo do card da revisão: as opções de dificuldade com a mesma largura
 * e, à direita, a seta de avançar, centralizada na altura das opções.
 */
export function StudyControls({ options, selected, onSelect, nextIcon, nextLabel, onNext }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.row}>
      <View style={styles.options}>
        {options.map((option) => (
          <DifficultyOption
            key={option.value}
            label={option.label}
            icon={option.icon}
            accessibilityLabel={option.accessibilityLabel}
            selected={option.value === selected}
            onPress={() => onSelect(option.value)}
          />
        ))}
      </View>
      <View style={[styles.next, { width: scale(NEXT_COLUMN) }]}>
        <IconButton
          icon={nextIcon}
          onPress={onNext}
          accessibilityLabel={nextLabel}
          size={NEXT_ICON_SIZE}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  options: {
    flex: 1,
    flexDirection: 'row',
  },
  next: {
    alignItems: 'center',
  },
});
