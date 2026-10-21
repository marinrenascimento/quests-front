import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { IconName } from '@/constants/helpContent';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Texto acima do botão (ex.: "Não encontrou o que procurava?") */
  prompt: string;
  buttonLabel: string;
  buttonIcon: IconName;
  onPress: () => void;
};

// Medidas do mockup da Help, em px
const PROMPT_SIZE = 9.5;
const PROMPT_LINE_HEIGHT = 12;
const BUTTON_GAP = 7;

/** Bloco de suporte do fim das telas de ajuda: pergunta centralizada e botão embaixo. */
export function SupportBlock({ prompt, buttonLabel, buttonIcon, onPress }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={styles.container}>
      <BodyText
        size={scale(PROMPT_SIZE)}
        lineHeight={scale(PROMPT_LINE_HEIGHT)}
        align="center"
        style={{ marginBottom: scale(BUTTON_GAP) }}>
        {prompt}
      </BodyText>
      <IconTextButton label={buttonLabel} icon={buttonIcon} onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
