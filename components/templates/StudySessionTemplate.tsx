import { StyleSheet, View } from 'react-native';

import { CompletionCardContent } from '@/components/molecules/CompletionCardContent';
import { InfoCard } from '@/components/molecules/InfoCard';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import {
  StudyCardContent,
  StudyCardContentProps,
} from '@/components/molecules/StudyCardContent';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { StudyControls } from '@/components/organisms/StudyControls';
import { TopBar } from '@/components/organisms/TopBar';
import { DifficultyConfig, SizedImage, StudyContent } from '@/constants/study';
import type { StudySession } from '@/hooks/useStudySession';
import { useLayoutPadding } from '@/hooks/useLayoutPadding';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Nome do deck no cabeçalho (vazio quando o deck não existe) */
  title: string;
  /** Textos e ícones da tela */
  content: StudyContent;
  difficultyOptions: DifficultyConfig[];
  /** O deck da rota não existe: só a mensagem e o botão de encerrar */
  notFound: boolean;
  /** Estado e ações da revisão (useStudySession) */
  session: StudySession;
  /** Imagem do card de fim da revisão */
  completedImage: SizedImage;
  /** Botão do cabeçalho ("Encerrar Revisão" ou, no fim, "Voltar para o Início") */
  onEnd: () => void;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

// Medidas do mockup da revisão de um deck convertidas para a escala da Help, em px
const CARD_TOP = 20;
const CARD_RADIUS = 19;
const CONTROLS_TOP = 21;
/** Fim da revisão: altura do card em relação à largura (quase quadrado, como no mockup) */
const COMPLETED_HEIGHT_RATIO = 0.98;
/** Fim da revisão: o nome do deck pode quebrar, porque o botão é mais largo */
const COMPLETED_TITLE_LINES = 2;

/**
 * Template da revisão de um deck, aberta por cima dos cards do deck: TopBar sem aba em
 * destaque, cabeçalho (nome do deck + Encerrar Revisão), o card grande e a linha de controles.
 * Sem rolagem: o card ocupa toda a altura que sobra (flex 1). Com o deck vazio ou inexistente,
 * o card mostra uma mensagem e os controles somem. No fim da revisão, o card de conclusão (baú
 * + texto) tem altura proporcional à largura, e o espaço abaixo dele fica vazio.
 */
export function StudySessionTemplate({
  title,
  content,
  difficultyOptions,
  notFound,
  session,
  completedImage,
  onEnd,
  coins,
  userName,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const { layoutWidth, paddingHorizontal, paddingTop, paddingBottom } = useLayoutPadding();
  const handleTabPress = useTopBarNavigation();
  // Largura útil entre as margens laterais (a dos cards da revisão)
  const cardWidth = layoutWidth - paddingHorizontal * 2;
  // Passou do último card de um deck existente com cards
  // TODO: salvar o resultado da revisão (back).
  const completed = !notFound && session.total > 0 && session.finished;

  let card: StudyCardContentProps | null = null;
  if (notFound) {
    card = { text: content.notFoundMessage, variant: 'front' };
  } else if (session.total === 0) {
    card = { label: content.endTag, text: content.emptyMessage, variant: 'front' };
  } else if (session.card) {
    card = {
      label: session.flipped ? content.backTag : content.frontTag,
      text: session.flipped ? session.card.back : session.card.front,
      variant: session.flipped ? 'back' : 'front',
      flip: { icon: content.flipIcon, label: content.flipLabel, onPress: session.flip },
    };
  }

  return (
    <HelpLayout
      scrollable={false}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <View
        style={[
          styles.content,
          { width: layoutWidth, paddingHorizontal, paddingTop, paddingBottom },
        ]}>
        <ReportHeader
          title={title}
          fitTitle
          titleLines={completed ? COMPLETED_TITLE_LINES : undefined}
          textAction={{
            label: completed ? content.completedEndLabel : content.endLabel,
            onPress: onEnd,
          }}
        />
        {card ? (
          <InfoCard radius={CARD_RADIUS} style={[styles.card, { marginTop: scale(CARD_TOP) }]}>
            <StudyCardContent {...card} />
          </InfoCard>
        ) : (
          <InfoCard
            radius={CARD_RADIUS}
            padding={0}
            // Medidas explícitas: com aspectRatio, o Android encolhia a largura e o card saía
            // estreito e encostado à esquerda
            style={{
              width: cardWidth,
              height: cardWidth * COMPLETED_HEIGHT_RATIO,
              marginTop: scale(CARD_TOP),
            }}>
            <CompletionCardContent
              imageSource={completedImage.source}
              imageAspectRatio={completedImage.aspectRatio}
              title={content.completedTitle}
            />
          </InfoCard>
        )}
        {session.card ? (
          <View style={{ marginTop: scale(CONTROLS_TOP) }}>
            <StudyControls
              options={difficultyOptions}
              selected={session.difficulty}
              onSelect={session.selectDifficulty}
              nextIcon={content.nextIcon}
              nextLabel={content.nextLabel}
              onNext={session.next}
            />
          </View>
        ) : null}
      </View>
    </HelpLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignSelf: 'center',
  },
  card: {
    flex: 1,
  },
});
