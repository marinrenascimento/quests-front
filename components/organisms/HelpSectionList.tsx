import { View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { InfoCard } from '@/components/molecules/InfoCard';
import { HelpSection } from '@/constants/helpContent';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  sections: HelpSection[];
};

/** Vão entre os cartões, em px do mockup (Estudos convertido para a escala da Help) */
const CARD_GAP = 12;

/** Cartões de um tópico de ajuda, empilhados: cada um com título e texto. */
export function HelpSectionList({ sections }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    // Poucos cartões fixos dentro do ScrollView da tela: um .map simples basta
    <View style={{ gap: scale(CARD_GAP) }}>
      {sections.map((section) => (
        <InfoCard key={section.id} title={section.title}>
          <BodyText>{section.text}</BodyText>
        </InfoCard>
      ))}
    </View>
  );
}
