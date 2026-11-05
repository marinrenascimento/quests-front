import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import type { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  /** Posição da pergunta, começando em 1 */
  position: number;
  question: string;
  /** A resposta, depois de achada na grade. Sem ela, a pergunta ainda está em aberto. */
  answer?: string;
  foundIcon: IconName;
  /** Lido pelo leitor de tela */
  accessibilityLabel: string;
};

// Medidas em px do mockup da Help (o jogo não tem mockup)
const TEXT_SIZE = 10;
const TEXT_LINE_HEIGHT = 13;
const SLOT_WIDTH = 16;
const ICON_SIZE = 14;
const GAP = 4;
/** Linhas de cada pergunta: a altura é sempre a mesma, para a grade não pular ao achar uma resposta */
const ROW_LINES = 2;
/** Mesmo limite de aumento pela fonte do sistema que o BodyText aplica */
const MAX_FONT_SCALE = 1.3;

/**
 * Uma pergunta do caça-palavras: o número e o texto, sempre com a altura de 2 linhas. Em aberto, o
 * texto ocupa as 2 (a fonte diminui se não couber). Depois de achada, o número vira um visto, a
 * pergunta fica na primeira linha e a resposta aparece na segunda, como ela é escrita, com os acentos.
 */
export function WordSearchQuestionRow({
  position,
  question,
  answer,
  foundIcon,
  accessibilityLabel,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { fontScale } = useWindowDimensions();
  const size = scale(TEXT_SIZE);
  const lineHeight = scale(TEXT_LINE_HEIGHT);
  const textScale = Math.min(Math.max(fontScale, 1), MAX_FONT_SCALE);

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, { minHeight: lineHeight * ROW_LINES * textScale }]}>
      <View style={{ width: scale(SLOT_WIDTH), marginRight: scale(GAP) }}>
        {answer ? (
          <MaterialCommunityIcons
            name={foundIcon}
            size={scale(ICON_SIZE)}
            color={Palette.examYellow}
          />
        ) : (
          <BodyText size={size} lineHeight={lineHeight} weight="bold" style={styles.text}>
            {`${position}.`}
          </BodyText>
        )}
      </View>
      <View style={styles.texts}>
        <BodyText
          size={size}
          lineHeight={lineHeight}
          numberOfLines={answer ? 1 : ROW_LINES}
          adjustsFontSizeToFit={!answer}
          style={styles.text}>
          {question}
        </BodyText>
        {answer ? (
          <BodyText
            size={size}
            lineHeight={lineHeight}
            numberOfLines={1}
            weight="bold"
            style={styles.answer}>
            {answer}
          </BodyText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  texts: {
    flex: 1,
  },
  text: {
    color: Palette.white,
  },
  answer: {
    color: Palette.examYellow,
  },
});
