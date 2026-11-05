import { ComponentProps } from 'react';
import { View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { FormActions } from '@/components/molecules/FormActions';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { FlashcardDetails } from '@/components/organisms/FlashcardDetails';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { TopBar } from '@/components/organisms/TopBar';
import type { IconName } from '@/constants/helpContent';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Título Card "nome do card"; sem card, o cabeçalho fica só com o voltar e o ícone */
  title?: string;
  /** Rótulos e valores do card; sem eles (card inexistente), aparece notFoundMessage */
  details?: ComponentProps<typeof FlashcardDetails>;
  notFoundMessage: string;
  /** Ícone decorativo do canto do cabeçalho, que indica a tela de visualização */
  viewIcon: IconName;
  /** Botões Excluir (claro) e Editar (escuro) no fim da tela. Sem eles (card inexistente), só lê. */
  actions?: { editLabel: string; deleteLabel: string; onEdit: () => void; onDelete: () => void };
  /** Seta de voltar: sai direto, sem confirmação (nada é editado nesta tela) */
  onBack: () => void;
  backLabel: string;
};

/** Máximo de linhas do título: com mais texto, a fonte diminui antes de cortar */
const TITLE_LINES = 2;
/** Espaço acima da mensagem de card inexistente: o mesmo do Editar Flashcard, em px do mockup */
const NOT_FOUND_TOP = 24;
/** Espaço acima dos botões: o mesmo do Visualizar Questão, em px do mockup */
const BUTTONS_TOP = 20;

/**
 * Template do Visualizar Card: TopBar sem aba em destaque, cabeçalho (voltar, título em até 2 linhas
 * e o olho decorativo), os dados do card, somente leitura, e os botões Excluir e Editar. O conteúdo
 * rola para mostrar frente e verso longos por inteiro.
 */
export function FlashcardViewTemplate({
  title,
  details,
  notFoundMessage,
  viewIcon,
  actions,
  onBack,
  backLabel,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout topBar={<TopBar onTabPress={handleTabPress} />}>
      <ReportHeader
        title={title}
        onBack={onBack}
        backLabel={backLabel}
        indicatorIcon={viewIcon}
        titleLines={TITLE_LINES}
        fitTitle
      />
      {details ? (
        <>
          <FlashcardDetails {...details} />
          {actions ? (
            <View style={{ marginTop: scale(BUTTONS_TOP) }}>
              <FormActions
                cancelLabel={actions.deleteLabel}
                saveLabel={actions.editLabel}
                onCancel={actions.onDelete}
                onSave={actions.onEdit}
                visible
              />
            </View>
          ) : null}
        </>
      ) : (
        <BodyText align="center" style={{ marginTop: scale(NOT_FOUND_TOP) }}>
          {notFoundMessage}
        </BodyText>
      )}
    </HelpLayout>
  );
}
