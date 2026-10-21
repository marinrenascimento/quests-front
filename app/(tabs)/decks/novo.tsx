import { DeckFormTemplate } from '@/components/templates/DeckFormTemplate';
import { DECK_FORM_CONTENT } from '@/constants/decks';
import { BACK_LABEL } from '@/constants/helpContent';
import { TEMP_COINS, TEMP_USER_NAME } from '@/constants/mockUser';
import { useDeckForm } from '@/hooks/useDeckForm';

export default function NewDeckScreen() {
  const form = useDeckForm({ nameRequiredMessage: DECK_FORM_CONTENT.nameRequired });

  return (
    <DeckFormTemplate
      content={DECK_FORM_CONTENT}
      form={form}
      onAddCardPress={() => {
        // TODO: criar a tela de Adicionar Card e navegar.
      }}
      backLabel={BACK_LABEL}
      coins={TEMP_COINS}
      userName={TEMP_USER_NAME}
    />
  );
}
