import { ReportHeader } from '@/components/molecules/ReportHeader';
import { DisciplineStudyForm } from '@/components/organisms/DisciplineStudyForm';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import type { SearchSelectFieldProps } from '@/components/molecules/SearchSelectField';
import type { DisciplineStudyContent } from '@/constants/study';
import type { DisciplineStudyFormState } from '@/hooks/useDisciplineStudyForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

/** O que o template usa do formulário (o dos decks ou o das provas) */
type StudyFormFields = Pick<
  DisciplineStudyFormState,
  | 'disciplineOptions'
  | 'contentOptions'
  | 'quantityOptions'
  | 'disciplineId'
  | 'contentId'
  | 'quantityId'
  | 'selectDiscipline'
  | 'selectContent'
  | 'selectQuantity'
> & { errors: { discipline?: string; quantity?: string } };

type Props = {
  /** Textos da tela (os do estudo de decks ou os do estudo de provas) */
  content: Omit<DisciplineStudyContent, 'quantityRequired' | 'disciplineRequired'>;
  /** Opções, valores, erros e ações dos campos (useDisciplineStudyForm ou o das provas) */
  form: StudyFormFields;
  /** Campo de dificuldade, só no estudo por disciplina das provas. Opcional. */
  difficulty?: SearchSelectFieldProps;
  onStudy: () => void;
  /** "Cancelar": quem usa abre o modal de confirmação antes de sair */
  onCancel: () => void;
  /** Seta de voltar: pergunta só se alguma escolha foi feita; senão, sai direto */
  onBack: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/** O título é longo: quebra em até 2 linhas e, se ainda não couber, a fonte diminui */
const TITLE_LINES = 2;

/**
 * Template de Configurar Deck por Disciplina (aberto por cima de Meus Decks) e de Configurar
 * Prova por Disciplina (por cima de Minhas Provas, com o campo de dificuldade): TopBar sem aba em
 * destaque, cabeçalho (voltar + título) e o formulário com os botões. O conteúdo rola e encolhe
 * acima do teclado, para o campo em foco e a lista de opções aberta não ficarem cobertos.
 */
// TODO (dívida): o nome fala em deck/card, mas também é a tela do estudo por disciplina das provas;
// renomear para um nome neutro num ajuste à parte, sem mudar o comportamento.
export function DisciplineStudyTemplate({
  content,
  form,
  difficulty,
  onStudy,
  onCancel,
  onBack,
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
        onBack={onBack}
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
        }}
        difficulty={difficulty}
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
