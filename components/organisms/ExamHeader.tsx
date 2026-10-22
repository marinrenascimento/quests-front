import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ExamProgressHeader } from '@/components/molecules/ExamProgressHeader';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { IconName } from '@/constants/helpContent';
import { Palette } from '@/constants/theme';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { EXAM_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';

type Props = {
  exitLabel: string;
  exitIcon: IconName;
  onExit: () => void;
  /** Contagem de respondidas: o número (em negrito), o resto do texto e o texto lido */
  answered: string;
  progressSuffix: string;
  progressLabel: string;
  /** Nome da prova (uma linha; a fonte diminui se não couber) */
  title: string;
  /**
   * Navegador de questões, na largura toda (ele aplica as margens). Opcional: sem questões, não
   * aparece. Recebido por prop para não acoplar organisms.
   */
  navigator?: ReactNode;
};

// Medidas do mockup da realização de prova, em px
const PADDING_TOP = 11;
const TITLE_TOP = 14;
const PADDING_BOTTOM = 11;
/** Espaço que o navegador já tem em volta dos botões (o do anel amarelo) */
const NAVIGATOR_INSET = 3.5;
/** Do título aos botões do navegador: 13px, descontado o espaço do anel */
const NAVIGATOR_TOP = 13 - NAVIGATOR_INSET;
const SHADOW_OFFSET = 2;
const SHADOW_BLUR = 6;

/**
 * Cabeçalho fixo da realização da prova (não rola), logo abaixo do TopBar: "Sair da prova" e a
 * contagem, o nome da prova e o navegador de questões, num verde-menta claro com sombra leve na
 * base, por cima da lista.
 */
export function ExamHeader({
  exitLabel,
  exitIcon,
  onExit,
  answered,
  progressSuffix,
  progressLabel,
  title,
  navigator,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal } = useLayoutPadding();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: scale(PADDING_TOP),
          paddingBottom: scale(navigator ? PADDING_BOTTOM - NAVIGATOR_INSET : PADDING_BOTTOM),
          boxShadow: [
            {
              offsetX: 0,
              offsetY: scale(SHADOW_OFFSET),
              blurRadius: scale(SHADOW_BLUR),
              color: Palette.cardShadow,
            },
          ],
        },
      ]}>
      <View style={[styles.centered, { width: layoutWidth, paddingHorizontal }]}>
        <ExamProgressHeader
          exitLabel={exitLabel}
          exitIcon={exitIcon}
          onExit={onExit}
          answered={answered}
          progressSuffix={progressSuffix}
          progressLabel={progressLabel}
        />
        <View style={{ marginTop: scale(TITLE_TOP) }}>
          <ReportHeader title={title} fitTitle />
        </View>
      </View>
      {navigator ? (
        <View style={[styles.centered, { width: layoutWidth, marginTop: scale(NAVIGATOR_TOP) }]}>
          {navigator}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  // Por cima da lista, para a sombra aparecer sobre ela
  header: {
    zIndex: 1,
    backgroundColor: Palette.examHeader,
  },
  centered: {
    alignSelf: 'center',
  },
});
