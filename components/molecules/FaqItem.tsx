import { View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { PixelText } from '@/components/atoms/PixelText';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  question: string;
  answer: string;
};

// Medidas do mockup da Help, em px
const QUESTION_SIZE = 7;
const QUESTION_LETTER_SPACING = 0.75;
const QUESTION_LINE_HEIGHT = 13.3;
const ANSWER_GAP = 7;

/** Pergunta em fonte pixel (quebra em várias linhas) e a resposta em texto corrido embaixo. */
export function FaqItem({ question, answer }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View>
      <PixelText
        size={scale(QUESTION_SIZE)}
        letterSpacing={scale(QUESTION_LETTER_SPACING)}
        lineHeight={scale(QUESTION_LINE_HEIGHT)}
        numberOfLines={0}
        color={Palette.forest}
        style={{ marginBottom: scale(ANSWER_GAP) }}>
        {question}
      </PixelText>
      <BodyText>{answer}</BodyText>
    </View>
  );
}
