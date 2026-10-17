import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontFamily, Palette } from '@/constants/theme';

type Props = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** 'regular' (login) ou 'compact' (cadastro) */
  size?: 'regular' | 'compact';
};

export function Checkbox({ label, checked, onChange, size = 'regular' }: Props) {
  const compact = size === 'compact';

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onChange(!checked)}
      hitSlop={6}
      style={styles.row}>
      <View style={[styles.box, compact ? styles.boxCompact : styles.boxRegular]}>
        {checked && (
          <MaterialIcons name="check" size={compact ? 15 : 17} color={Palette.checkmark} />
        )}
      </View>
      <Text style={[styles.label, compact && styles.labelCompact]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.checkbox,
  },
  boxRegular: {
    width: 22,
    height: 22,
    borderRadius: 5,
    marginRight: 12,
  },
  boxCompact: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  label: {
    fontFamily: FontFamily.label,
    fontSize: 16,
    color: Palette.text,
  },
  labelCompact: {
    fontSize: 14,
  },
});
