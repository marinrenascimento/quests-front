import { StyleSheet, View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { IconTextButton } from '@/components/atoms/IconTextButton';
import { InfoCard } from '@/components/molecules/InfoCard';
import { QuestionDifficultyPicker } from '@/components/molecules/QuestionDifficultyPicker';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import {
  MATH_DIFFICULTY_MAX_STARS,
  MATH_DIFFICULTY_OPTIONS,
  MathDifficulty,
  MathGameContent,
} from '@/constants/games';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  content: MathGameContent;
  difficulty: MathDifficulty;
  onSelectDifficulty: (value: MathDifficulty) => void;
  onPlay: () => void;
  onBack: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

// Medidas em px do mockup da Help
const PARAGRAPH_GAP = 7;
const HINT_TOP = 7;

/**
 * Template da preparação do Elfo Matemático: TopBar, cabeçalho (voltar + nome do jogo), como jogar,
 * a escolha do nível (com o que cai nele) e o botão de começar. O seletor é o mesmo das questões:
 * mesmas estrelas e mesmo visual.
 */
export function MathGameSetupTemplate({
  content,
  difficulty,
  onSelectDifficulty,
  onPlay,
  onBack,
  backLabel,
  coins,
  userName,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const handleTabPress = useTopBarNavigation();
  const hint = MATH_DIFFICULTY_OPTIONS.find((option) => option.value === difficulty)?.hint ?? '';

  return (
    <HelpLayout topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <ReportHeader title={content.title} onBack={onBack} backLabel={backLabel} fitTitle />
      <InfoCard title={content.howToTitle}>
        <View style={[styles.paragraphs, { gap: scale(PARAGRAPH_GAP) }]}>
          {/* Poucos parágrafos fixos: um .map simples basta */}
          {content.howTo.map((paragraph) => (
            <BodyText key={paragraph}>{paragraph}</BodyText>
          ))}
        </View>
      </InfoCard>
      <View>
        <QuestionDifficultyPicker
          label={content.difficultyLabel}
          options={MATH_DIFFICULTY_OPTIONS}
          selected={difficulty}
          onSelect={(value) => onSelectDifficulty(value as MathDifficulty)}
          maxStars={MATH_DIFFICULTY_MAX_STARS}
          starIcon={content.starIcon}
          starOutlineIcon={content.starOutlineIcon}
        />
        <BodyText align="center" style={{ marginTop: scale(HINT_TOP) }}>
          {hint}
        </BodyText>
      </View>
      <IconTextButton label={content.playLabel} onPress={onPlay} />
    </HelpLayout>
  );
}

const styles = StyleSheet.create({
  paragraphs: {
    alignSelf: 'stretch',
  },
});
