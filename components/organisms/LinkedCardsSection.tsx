import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { Label } from '@/components/atoms/Label';
import { InfoCard } from '@/components/molecules/InfoCard';

type Props = {
  /** Rótulo acima da área (mesmo estilo dos rótulos dos campos) */
  label: string;
  /** Texto mostrado enquanto não há cards */
  emptyMessage: string;
};

/** Espaço interno do cartão, em px do mockup da Help */
const CARD_PADDING = 20;

/**
 * Seção "Cards vinculados" do cadastro de deck: rótulo e, abaixo, o cartão verde sálvia.
 * Por enquanto só existe o estado vazio, com a mensagem centralizada.
 */
// TODO: listar os cards vinculados ao deck (back) quando houver cadastro de card.
export function LinkedCardsSection({ label, emptyMessage }: Props) {
  return (
    <View>
      <Label size="compact">{label}</Label>
      <View style={styles.labelGap} />
      <InfoCard padding={CARD_PADDING}>
        <BodyText align="center">{emptyMessage}</BodyText>
      </InfoCard>
    </View>
  );
}

const styles = StyleSheet.create({
  // Mesmo espaço entre rótulo e campo do FormField 'outlined'
  labelGap: {
    height: 6,
  },
});
