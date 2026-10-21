import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View } from 'react-native';

import { BackButton } from '@/components/atoms/BackButton';
import { BodyText } from '@/components/atoms/BodyText';
import { PixelText } from '@/components/atoms/PixelText';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  icon: IconName;
  title: string;
  subtitle: string;
  onBack: () => void;
  backLabel: string;
};

// Medidas do mockup da Estudos convertidas para a escala da Help, em px
const ICON_SIZE = 52;
const ICON_TOP = 5;
const TITLE_SIZE = 13;
const TITLE_LETTER_SPACING = 1.5;
const TITLE_LINE_HEIGHT = 19;
const TITLE_GAP = 9;
const SUBTITLE_GAP = 12;
const SUBTITLE_MAX_WIDTH = 215;
/** Espaço lateral reservado ao botão voltar, para o título não passar por baixo dele */
const SIDE_INSET = 34;

/**
 * Cabeçalho de um tópico de ajuda: botão voltar no canto superior esquerdo e, centralizados,
 * ícone grande, título em fonte pixel e subtítulo.
 */
export function HelpTopicHeader({ icon, title, subtitle, onBack, backLabel }: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);

  return (
    <View style={[styles.container, { paddingHorizontal: scale(SIDE_INSET) }]}>
      <MaterialCommunityIcons
        name={icon}
        size={scale(ICON_SIZE)}
        color={Palette.forest}
        style={{ marginTop: scale(ICON_TOP) }}
      />
      <PixelText
        size={scale(TITLE_SIZE)}
        letterSpacing={scale(TITLE_LETTER_SPACING)}
        lineHeight={scale(TITLE_LINE_HEIGHT)}
        numberOfLines={0}
        color={Palette.forest}
        style={[styles.title, { marginTop: scale(TITLE_GAP) }]}>
        {title}
      </PixelText>
      <BodyText
        align="center"
        style={{ marginTop: scale(SUBTITLE_GAP), maxWidth: scale(SUBTITLE_MAX_WIDTH) }}>
        {subtitle}
      </BodyText>
      <View style={styles.back}>
        <BackButton onPress={onBack} accessibilityLabel={backLabel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  back: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
