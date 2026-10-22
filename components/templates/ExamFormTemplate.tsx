import { IconTextButton } from '@/components/atoms/IconTextButton';
import { FormActions } from '@/components/molecules/FormActions';
import { FormField } from '@/components/molecules/FormField';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { Toast } from '@/components/molecules/Toast';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { LinkedCardsSection, LinkedItem } from '@/components/organisms/LinkedCardsSection';
import { TopBar } from '@/components/organisms/TopBar';
import type { ExamFormContent } from '@/constants/exams';
import type { ExamFormState } from '@/hooks/useExamForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Textos da tela */
  content: ExamFormContent;
  /** Valor, erro e visibilidade dos botões (useExamForm) */
  form: ExamFormState;
  /** "Adicionar Questão +" */
  onAddQuestionPress: () => void;
  /** Questões do rascunho, com "Disciplina - Conteúdo" e o título */
  questions: LinkedItem[];
  /** Toast no topo do conteúdo (ex.: "Questão Adicionada com Sucesso!") */
  toast: { message: string; visible: boolean; onHide: () => void };
  /** Seta de voltar: pergunta só com questão adicionada; senão, sai direto */
  onBack: () => void;
  /** Botões que aparecem com form.showActions (Cancelar abre o modal de confirmação) */
  onSave: () => void;
  onCancel: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/**
 * Template de Criar Nova Prova, no esqueleto do cadastro de deck: TopBar sem aba em destaque,
 * cabeçalho (voltar + título), o nome da prova, o botão "Adicionar Questão +", a seção das
 * questões adicionadas e, depois da primeira questão, os botões Cancelar e Salvar. O conteúdo
 * rola e encolhe acima do teclado. O toast aparece por cima do conteúdo, sem empurrar o layout.
 */
export function ExamFormTemplate({
  content,
  form,
  onAddQuestionPress,
  questions,
  toast,
  onBack,
  onSave,
  onCancel,
  backLabel,
  coins,
  userName,
}: Props) {
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      keyboardAware
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}
      overlay={<Toast message={toast.message} visible={toast.visible} onHide={toast.onHide} />}>
      <ReportHeader title={content.title} onBack={onBack} backLabel={backLabel} />
      <FormField
        variant="outlined"
        label={content.nameLabel}
        placeholder={content.namePlaceholder}
        value={form.name}
        onChangeText={form.setName}
        error={form.nameError}
        autoCapitalize="sentences"
        returnKeyType="done"
      />
      <IconTextButton
        label={content.addQuestionLabel}
        onPress={onAddQuestionPress}
        variant="compact"
      />
      <LinkedCardsSection
        label={content.questionsLabel}
        emptyMessage={content.questionsEmpty}
        cards={questions}
      />
      {/* Sem espaço reservado, como no cadastro de deck */}
      <FormActions
        saveLabel={content.saveLabel}
        cancelLabel={content.cancelLabel}
        onSave={onSave}
        onCancel={onCancel}
        visible={form.showActions}
        reserveSpace={false}
      />
    </HelpLayout>
  );
}
