import { View } from 'react-native';

import { FaqItem } from '@/components/molecules/FaqItem';
import { InfoCard } from '@/components/molecules/InfoCard';
import { FaqEntry } from '@/constants/helpContent';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  title: string;
  items: FaqEntry[];
};

/** Vão entre as perguntas, em px do mockup da Help */
const ITEM_GAP = 16;

/** Cartão "Perguntas frequentes": título e as perguntas com resposta, com o mesmo espaçamento. */
export function FaqCard({ title, items }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <InfoCard title={title}>
      {/* Poucas perguntas fixas dentro do ScrollView da tela: um .map simples basta */}
      <View style={{ gap: scale(ITEM_GAP) }}>
        {items.map((item) => (
          <FaqItem key={item.id} question={item.question} answer={item.answer} />
        ))}
      </View>
    </InfoCard>
  );
}
