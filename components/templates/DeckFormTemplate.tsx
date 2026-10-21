import { useRouter } from 'expo-router';

import { IconTextButton } from '@/components/atoms/IconTextButton';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { DeckForm } from '@/components/organisms/DeckForm';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { LinkedCardsSection } from '@/components/organisms/LinkedCardsSection';
import { TopBar } from '@/components/organisms/TopBar';
import type { DeckFormContent } from '@/constants/decks';
import type { DeckFormState } from '@/hooks/useDeckForm';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Textos da tela */
  content: DeckFormContent;
  /** Valores, erros e ações dos campos (useDeckForm) */
  form: DeckFormState;
  /** "Cadastrar Novo Card +" */
  onAddCardPress: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/**
 * Template do cadastro de deck, aberto por cima de Meus Decks: TopBar sem aba em destaque,
 * cabeçalho (voltar + título), campos de nome e descrição, o botão "Cadastrar Novo Card +" e a
 * seção de cards vinculados. O conteúdo rola e encolhe acima do teclado, para o campo em foco
 * não ficar coberto. O voltar retorna a Meus Decks.
 */
export function DeckFormTemplate({
  content,
  form,
  onAddCardPress,
  backLabel,
  coins,
  userName,
}: Props) {
  const router = useRouter();
  const handleTabPress = useTopBarNavigation();

  const handleBack = () => {
    // Volta para Meus Decks; aberta sem histórico na pilha (ex.: link direto), vai para a lista
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/decks');
    }
  };

  return (
    <HelpLayout
      keyboardAware
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}>
      <ReportHeader title={content.title} onBack={handleBack} backLabel={backLabel} />
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
      />
    </HelpLayout>
  );
}
