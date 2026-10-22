import { useEffect, useRef } from 'react';
import { ScrollView } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { FlashcardForm } from '@/components/organisms/FlashcardForm';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import type { FlashcardFormContent } from '@/constants/decks';
import type { FlashcardFormState } from '@/hooks/useFlashcardForm';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Textos da tela (o título diferencia Novo e Editar Flashcard) */
  content: FlashcardFormContent;
  /** Valores, opções, erros, visibilidade dos botões e ações dos campos (useFlashcardForm) */
  form: FlashcardFormState;
  onSave: () => void;
  /**
   * "Cancelar": no Novo Flashcard, quem usa abre o modal de confirmação; no Editar Flashcard,
   * pergunta só se houver alteração não salva
   */
  onCancel: () => void;
  /** Seta de voltar: pergunta só se algo seria perdido (form.hasChanges); senão, sai direto */
  onBack: () => void;
  /**
   * Card inexistente (Editar Flashcard): no lugar do formulário, só esta mensagem; a saída é a
   * seta de voltar. Opcional.
   */
  notFoundMessage?: string;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/** Espaço acima da mensagem de card inexistente: o mesmo das grades vazias, em px do mockup */
const NOT_FOUND_TOP = 24;

/**
 * Template do Novo Flashcard e do Editar Flashcard: TopBar sem aba em destaque, cabeçalho
 * (voltar + título) e o formulário com os botões. O conteúdo rola e encolhe acima do teclado,
 * para o campo em foco e a lista de opções aberta não ficarem cobertos. Os botões aparecem
 * conforme form.showCancel e form.showSave; se o Salvar aparecer enquanto o usuário digita no
 * verso (o último campo), a tela rola até o fim para o teclado não escondê-lo.
 */
export function FlashcardFormTemplate({
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
  const scrollRef = useRef<ScrollView>(null);
  // Ref (e não estado): o foco só importa no momento em que o Salvar aparece
  const backFocused = useRef(false);

  useEffect(() => {
    // Com o verso em foco o teclado já está aberto e a área rolável já encolheu acima dele
    if (form.showSave && backFocused.current) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  }, [form.showSave]);

  return (
    <HelpLayout
      keyboardAware
      scrollRef={scrollRef}
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <ReportHeader title={content.title} onBack={onBack} backLabel={backLabel} />
      {notFoundMessage ? (
        <BodyText align="center" style={{ marginTop: scale(NOT_FOUND_TOP) }}>
          {notFoundMessage}
        </BodyText>
      ) : (
        <FlashcardForm
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
          front={{
            label: content.frontLabel,
            placeholder: content.frontPlaceholder,
            value: form.front,
            onChangeText: form.setFront,
            error: form.errors.front,
          }}
          back={{
            label: content.backSideLabel,
            placeholder: content.backSidePlaceholder,
            value: form.back,
            onChangeText: form.setBack,
            error: form.errors.back,
            onFocus: () => {
              backFocused.current = true;
            },
            onBlur: () => {
              backFocused.current = false;
            },
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
