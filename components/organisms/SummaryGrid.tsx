import { StyleSheet, View } from 'react-native';

import { InfoCard } from '@/components/molecules/InfoCard';
import { SummaryStat } from '@/components/molecules/SummaryStat';
import { ReportSummaryItem } from '@/constants/reports';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  items: ReportSummaryItem[];
};

/** Cartões por linha */
const COLUMNS = 2;
// Medidas do mockup dos Relatórios convertidas para a escala da Help, em px
const GAP = 6.6;
const CARD_PADDING = 10;

/** Grade de cartões de resumo (2 por linha), todos do mesmo tamanho. */
export function SummaryGrid({ items }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const gap = scale(GAP);

  // Divide em linhas de 2: cada cartão tem flex 1, então os dois de uma linha ficam iguais
  const rows: ReportSummaryItem[][] = [];
  for (let index = 0; index < items.length; index += COLUMNS) {
    rows.push(items.slice(index, index + COLUMNS));
  }

  return (
    <View style={{ gap }}>
      {rows.map((row) => (
        <View key={row.map((item) => item.id).join('-')} style={[styles.row, { gap }]}>
          {row.map((item) => (
            <View key={item.id} style={styles.cell}>
              <InfoCard padding={CARD_PADDING}>
                <SummaryStat icon={item.icon} value={item.value} label={item.label} />
              </InfoCard>
            </View>
          ))}
          {/* Linha incompleta: um espaço vazio mantém o cartão com metade da largura */}
          {row.length < COLUMNS ? <View style={styles.cell} /> : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
  },
});
