import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { PixelText } from '@/components/atoms/PixelText';
import { AlternativeOption } from '@/components/molecules/AlternativeOption';
import { DifficultyStars } from '@/components/molecules/DifficultyStars';
import { HighlightableText } from '@/components/molecules/HighlightableText';
import { InfoCard } from '@/components/molecules/InfoCard';
import type {
  ExamQuestionCardContent,
  Question,
  QuestionHighlights,
} from '@/constants/exams';
import { Palette } from '@/constants/theme';
import {
  EXAM_MOCKUP_WIDTH,
  HELP_MOCKUP_WIDTH,
  useMockupScale,
} from '@/hooks/useMockupScale';

type Props = {
  question: Question;
  /** Posição da questão na prova, começando em 1 (título "QUESTÃO N") */
  position: number;
  /** Id da alternativa escolhida nesta questão (sem resposta: undefined) */
  answer?: string;
  /** Marcações do enunciado desta questão */
  highlights?: QuestionHighlights;
  /** Palavra do primeiro toque do marcador nesta questão (null: nenhuma) */
  pendingWord: number | null;
  /** Modo marcador ligado */
  markerOn: boolean;
  /** Textos, ícones e cores do card */
  content: ExamQuestionCardContent;
  /** Recebem o id da questão: funções estáveis, as mesmas para todos os cards */
  onSelectAnswer: (questionId: string, alternativeId: string) => void;
  onWordPress: (questionId: string, wordIndex: number) => void;
};

// Medidas do mockup da realização de prova, em px
const TITLE_SIZE = 7.9;
const TITLE_LETTER_SPACING = 0.9;
const SUBJECT_TOP = 5;
const SUBJECT_SIZE = 10.5;
const SUBJECT_LINE_HEIGHT = 13;
const STATEMENT_TOP = 12;
const ALTERNATIVES_TOP = 16;
const ALTERNATIVES_GAP = 7;
/** O cartão (InfoCard) recebe as medidas na escala da Help: 13px de padding e 20px de raio */
const toHelpPx = (examPx: number) => (examPx * HELP_MOCKUP_WIDTH) / EXAM_MOCKUP_WIDTH;
const CARD_PADDING = toHelpPx(13);
const CARD_RADIUS = toHelpPx(20);

/**
 * Card de uma questão na realização da prova, no cartão verde sálvia: "QUESTÃO N" e a
 * dificuldade em estrelas no topo, "Disciplina · Conteúdo", o enunciado (com as marcações do
 * marcador de texto) e as alternativas (quantas a questão tiver, com as letras pela posição).
 * Memorizado: numa prova grande só re-renderiza quando a própria resposta, as próprias marcações
 * ou o modo do marcador mudam.
 */
export const ExamQuestionCard = memo(function ExamQuestionCard({
  question,
  position,
  answer,
  highlights,
  pendingWord,
  markerOn,
  content,
  onSelectAnswer,
  onWordPress,
}: Props) {
  const { scale } = useMockupScale(EXAM_MOCKUP_WIDTH);
  const stars = content.stars(question.difficulty);

  return (
    <InfoCard padding={CARD_PADDING} radius={CARD_RADIUS}>
      <View style={styles.titleRow}>
        <PixelText
          size={scale(TITLE_SIZE)}
          letterSpacing={scale(TITLE_LETTER_SPACING)}
          color={Palette.forest}
          accessibilityRole="header"
          style={styles.title}>
          {content.title(position)}
        </PixelText>
        <DifficultyStars
          filled={stars}
          total={content.maxStars}
          icon={content.starIcon}
          emptyIcon={content.starOutlineIcon}
          accessibilityLabel={content.starsLabel(stars, content.maxStars)}
        />
      </View>
      <BodyText
        size={scale(SUBJECT_SIZE)}
        lineHeight={scale(SUBJECT_LINE_HEIGHT)}
        style={[styles.subject, { marginTop: scale(SUBJECT_TOP) }]}>
        {content.subjectLabel(question)}
      </BodyText>
      <View style={{ marginTop: scale(STATEMENT_TOP) }}>
        <HighlightableText
          text={question.statement}
          highlights={highlights}
          highlightColors={content.highlightColors}
          interactive={markerOn}
          pendingWord={pendingWord}
          onWordPress={(wordIndex) => onWordPress(question.id, wordIndex)}
        />
      </View>
      <View style={{ marginTop: scale(ALTERNATIVES_TOP), gap: scale(ALTERNATIVES_GAP) }}>
        {question.alternatives.map((alternative, index) => (
          <AlternativeOption
            key={alternative.id}
            letter={content.letter(index)}
            text={alternative.text}
            selected={answer === alternative.id}
            onPress={() => onSelectAnswer(question.id, alternative.id)}
          />
        ))}
      </View>
    </InfoCard>
  );
});

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    flexShrink: 1,
  },
  subject: {
    color: Palette.examSubjectLabel,
  },
});
