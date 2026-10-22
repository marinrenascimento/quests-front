import { ReportHeader } from '@/components/molecules/ReportHeader';
import { DisciplineStudyForm } from '@/components/organisms/DisciplineStudyForm';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import type { DisciplineStudyContent } from '@/constants/study';
import type { DisciplineStudyFormState } from '@/hooks/useDisciplineStudyForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Textos da tela */
  content: DisciplineStudyContent;
  /** Opções, valores, erros e ações dos campos (useDisciplineStudyForm) */
  form: DisciplineStudyFormState;
  onStudy: () => void;
  /** Voltar e "Cancelar": quem usa abre o modal de confirmação antes de sair */
  onCancel: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/** O título é longo: quebra em até 2 linhas e, se ainda não couber, a fonte diminui */
const TITLE_LINES = 2;

/**
 * Template de Configurar Deck por Disciplina, aberto por cima de Meus Decks: TopBar sem aba em
 * destaque, cabeçalho (voltar + título) e o formulário com os botões. O conteúdo rola e encolhe
 * acima do teclado, para o campo em foco e a lista de opções aberta não ficarem cobertos.
 */
export function DisciplineStudyTemplate({
  content,
  form,
  onStudy,
  onCancel,
  backLabel,
  coins,
  userName,
}: Props) {
  const handleTabPress = useTopBarNavigation();
  const hasDiscipline = form.disciplineId !== undefined;

  return (
    <HelpLayout
      keyboardAware
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <ReportHeader
        title={content.title}
        titleLines={TITLE_LINES}
        fitTitle
        onBack={onCancel}
        backLabel={backLabel}
      />
      <DisciplineStudyForm
        discipline={{
          label: content.disciplineLabel,
          placeholder: content.disciplinePlaceholder,
          options: form.disciplineOptions,
          selectedId: form.disciplineId,
          onSelect: form.selectDiscipline,
          emptyMessage: content.disciplineEmpty,
          noResultsMessage: content.disciplineNoResults,
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
          emptyMessage: content.contentEmpty,
          noResultsMessage: content.contentNoResults,
          disabled: !hasDiscipline,
          error: form.errors.content,
        }}
        quantity={{
          label: content.quantityLabel,
          placeholder: content.quantityPlaceholder,
          options: form.quantityOptions,
          selectedId: form.quantityId,
          onSelect: form.selectQuantity,
          emptyMessage: content.quantityEmpty,
          error: form.errors.quantity,
        }}
        cancelLabel={content.cancelLabel}
        studyLabel={content.studyLabel}
        onCancel={onCancel}
        onStudy={onStudy}
      />
    </HelpLayout>
  );
}
