import { BodyText } from '@/components/atoms/BodyText';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { QuestionForm } from '@/components/organisms/QuestionForm';
import { TopBar } from '@/components/organisms/TopBar';
import { alternativeLetter, QuestionDifficulty, QuestionFormContent } from '@/constants/exams';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import type { QuestionFormState } from '@/hooks/useQuestionForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Textos da tela (o título diferencia Adicionar e Editar Questão) */
  content: QuestionFormContent;
  /** Valores, opções, erros, visibilidade dos botões e ações dos campos (useQuestionForm) */
  form: QuestionFormState;
  onSave: () => void;
  /** "Cancelar": quem usa decide se pergunta antes de sair */
  onCancel: () => void;
  /** Seta de voltar: pergunta só se algo seria perdido (form.hasChanges); senão, sai direto */
  onBack: () => void;
  /**
   * Questão inexistente ou prova que não pode ser alterada: no lugar do formulário, só esta
   * mensagem; a saída é a seta de voltar. Opcional.
   */
  notFoundMessage?: string;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/** Espaço acima da mensagem de questão inexistente: o mesmo do Editar Flashcard, em px do mockup */
const NOT_FOUND_TOP = 24;

/**
 * Template do Adicionar Questão e do Editar Questão, no esqueleto do Novo Flashcard: TopBar sem
 * aba em destaque, cabeçalho (voltar + título) e o formulário com os botões. O conteúdo rola e
 * encolhe acima do teclado, para o campo em foco e a lista de opções aberta não ficarem cobertos.
 */
export function QuestionFormTemplate({
  content,
  form,
  onSave,
  onCancel,
  onBack,
  notFoundMessage,
  backLabel,
  coins,
  userName,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const handleTabPress = useTopBarNavigation();
  const hasDiscipline = form.disciplineId !== undefined;

  return (
    <HelpLayout
      keyboardAware
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <ReportHeader title={content.title} onBack={onBack} backLabel={backLabel} />
      {notFoundMessage ? (
        <BodyText align="center" style={{ marginTop: scale(NOT_FOUND_TOP) }}>
          {notFoundMessage}
        </BodyText>
      ) : (
        <QuestionForm
          discipline={{
            label: content.disciplineLabel,
            placeholder: content.disciplinePlaceholder,
            options: form.disciplineOptions,
            selectedId: form.disciplineId,
            onSelect: form.selectDiscipline,
            onCreate: form.createDiscipline,
            createLabel: content.createDiscipline,
            emptyMessage: content.noOptions,
            error: form.errors.discipline,
          }}
          content={{
            label: content.contentLabel,
            placeholder: hasDiscipline
              ? content.contentPlaceholder
              : content.contentDisabledPlaceholder,
            options: form.contentOptions,
            selectedId: form.contentId,
            onSelect: form.selectContent,
            onCreate: form.createContent,
            createLabel: content.createContent,
            emptyMessage: content.noOptions,
            disabled: !hasDiscipline,
            error: form.errors.content,
          }}
          title={{
            label: content.titleLabel,
            placeholder: content.titlePlaceholder,
            value: form.title,
            onChangeText: form.setTitle,
            error: form.errors.title,
          }}
          statement={{
            label: content.statementLabel,
            placeholder: content.statementPlaceholder,
            value: form.statement,
            onChangeText: form.setStatement,
            error: form.errors.statement,
          }}
          difficulty={{
            label: content.difficultyLabel,
            options: content.difficultyOptions,
            selected: form.difficulty,
            onSelect: (value) => form.selectDifficulty(value as QuestionDifficulty),
            maxStars: content.maxStars,
            starIcon: content.starIcon,
            starOutlineIcon: content.starOutlineIcon,
            error: form.errors.difficulty,
          }}
          alternatives={{
            label: content.alternativesLabel,
            emptyMessage: content.alternativesEmpty,
            addLabel: content.addAlternativeLabel,
            onAdd: form.addAlternative,
            items: form.alternatives.map((alternative, index) => {
              const letter = alternativeLetter(index);
              return {
                id: alternative.id,
                letter,
                text: alternative.text,
                onChangeText: (text: string) => form.setAlternativeText(alternative.id, text),
                placeholder: content.alternativePlaceholder,
                accessibilityLabel: content.alternativeLabel(letter),
                correct: alternative.correct,
                onToggleCorrect: () => form.toggleCorrect(alternative.id),
                correctLabel: content.correctLabel,
                onRemove: () => form.removeAlternative(alternative.id),
                removeIcon: content.removeAlternativeIcon,
                removeLabel: content.removeAlternativeLabel(letter),
                error: form.alternativeErrors[alternative.id],
              };
            }),
          }}
          saveLabel={content.saveLabel}
          cancelLabel={content.cancelLabel}
          onSave={onSave}
          onCancel={onCancel}
          showCancel={form.showCancel}
          showSave={form.showSave}
        />
      )}
    </HelpLayout>
  );
}
