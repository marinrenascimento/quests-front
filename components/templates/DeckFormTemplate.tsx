import { IconTextButton } from '@/components/atoms/IconTextButton';
import { FormActions } from '@/components/molecules/FormActions';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { Toast } from '@/components/molecules/Toast';
import { DeckForm } from '@/components/organisms/DeckForm';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { LinkedCardsSection } from '@/components/organisms/LinkedCardsSection';
import { TopBar } from '@/components/organisms/TopBar';
import { DeckFormContent, LinkedCard, linkedCardLabel } from '@/constants/decks';
import type { DeckFormState } from '@/hooks/useDeckForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Textos da tela */
  content: DeckFormContent;
  /** Valores, erros, visibilidade dos botões e ações dos campos (useDeckForm) */
  form: DeckFormState;
  /** "Cadastrar Novo Card +" */
  onAddCardPress: () => void;
  /** Cards salvos no Novo Flashcard, listados em "Cards Vinculados" */
  linkedCards: LinkedCard[];
  /** Toast no topo do conteúdo (ex.: "Card Vinculado com Sucesso!" depois de salvar um card) */
  toast: { message: string; visible: boolean; onHide: () => void };
  /** Seta de voltar: retorna a Meus Decks */
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
 * Template do cadastro de deck, aberto por cima de Meus Decks: TopBar sem aba em destaque,
 * cabeçalho (voltar + título), campos de nome e descrição, o botão "Cadastrar Novo Card +", a
 * seção de cards vinculados e, depois do primeiro card vinculado, os botões Cancelar e Salvar.
 * O conteúdo rola e encolhe acima do teclado, para o campo em foco não ficar coberto. O toast
 * aparece por cima do conteúdo, logo abaixo do TopBar, sem empurrar o layout.
 */
export function DeckFormTemplate({
  content,
  form,
  onAddCardPress,
  linkedCards,
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
      <DeckForm
        name={{
          label: content.nameLabel,
          placeholder: content.namePlaceholder,
          value: form.name,
          onChangeText: form.setName,
          error: form.nameError,
        }}
        description={{
          label: content.descriptionLabel,
          placeholder: content.descriptionPlaceholder,
          value: form.description,
          onChangeText: form.setDescription,
        }}
      />
      <IconTextButton label={content.addCardLabel} onPress={onAddCardPress} variant="compact" />
      <LinkedCardsSection
        label={content.linkedCardsLabel}
        emptyMessage={content.linkedCardsEmpty}
        cards={linkedCards.map((card) => ({
          id: card.id,
          label: linkedCardLabel(card),
          title: card.front,
        }))}
      />
      {/* Sem espaço reservado: antes do primeiro card não há nada abaixo da seção, e ao vincular
          o card a tela já muda (a grade substitui a mensagem) */}
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
