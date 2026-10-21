import { StyleSheet, View } from 'react-native';

import { HelpMenuButton } from '@/components/molecules/HelpMenuButton';
import { HelpMenuItem, HelpMenuKey } from '@/constants/helpContent';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  items: HelpMenuItem[];
  onSelect: (key: HelpMenuKey) => void;
};

/** Botões por linha */
const COLUMNS = 2;
/** Vão entre os botões (na horizontal e na vertical), em px do mockup da Help */
const GAP = 11;

/** Grade de botões da Help (2 por linha), todos do mesmo tamanho, ocupando a largura útil. */
export function HelpMenuGrid({ items, onSelect }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const gap = scale(GAP);

  // Divide em linhas de 2: cada botão tem flex 1, então os dois de uma linha ficam iguais
  const rows: HelpMenuItem[][] = [];
  for (let index = 0; index < items.length; index += COLUMNS) {
    rows.push(items.slice(index, index + COLUMNS));
  }

  return (
    <View style={{ gap }}>
      {rows.map((row) => (
        <View key={row.map((item) => item.key).join('-')} style={[styles.row, { gap }]}>
          {row.map((item) => (
            <HelpMenuButton
              key={item.key}
              label={item.label}
              icon={item.icon}
              onPress={() => onSelect(item.key)}
            />
          ))}
          {/* Linha incompleta: um espaço vazio mantém o botão com metade da largura */}
          {row.length < COLUMNS ? <View style={styles.filler} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  filler: {
    flex: 1,
  },
});
