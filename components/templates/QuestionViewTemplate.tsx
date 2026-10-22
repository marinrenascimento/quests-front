import { ComponentProps } from 'react';
import { View } from 'react-native';

import { BodyText } from '@/components/atoms/BodyText';
import { FormActions } from '@/components/molecules/FormActions';
import { ReportHeader } from '@/components/molecules/ReportHeader';
import { Toast } from '@/components/molecules/Toast';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { QuestionDetails } from '@/components/organisms/QuestionDetails';
import { TopBar } from '@/components/organisms/TopBar';
import type { IconName } from '@/constants/helpContent';
import { HELP_MOCKUP_WIDTH, useMockupScale } from '@/hooks/useMockupScale';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Título Questão "título"; sem questão, o cabeçalho fica só com o voltar e o ícone */
  title?: string;
  /** Rótulos e valores da questão; sem eles (questão inexistente), aparece notFoundMessage */
  details?: ComponentProps<typeof QuestionDetails>;
  notFoundMessage: string;
  /** Ícone decorativo do canto do cabeçalho, que indica a tela de visualização */
  viewIcon: IconName;
  /**
   * Botões Excluir (claro) e Editar (escuro) no fim da tela. Sem eles (prova de vestibular ou
   * questão inexistente), a tela é só leitura.
   */
  actions?: { editLabel: string; deleteLabel: string; onEdit: () => void; onDelete: () => void };
  /** Aviso no topo do conteúdo (ex.: a prova não pode ficar sem questões). Opcional. */
  toast?: { message: string; visible: boolean; onHide: () => void };
  /** Seta de voltar: sai direto, sem confirmação (nada é editado nesta tela) */
  onBack: () => void;
  backLabel: string;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
};

/** Máximo de linhas do título: com mais texto, a fonte diminui antes de cortar */
const TITLE_LINES = 2;
// Medidas em px do mockup da Help (as mesmas do Visualizar Card e do formulário)
const NOT_FOUND_TOP = 24;
const BUTTONS_TOP = 20;

/**
 * Template do Visualizar Questão, no esqueleto do Visualizar Card: TopBar sem aba em destaque,
 * cabeçalho (voltar, título em até 2 linhas e o olho decorativo), os dados da questão e, nas
 * provas do usuário, os botões Excluir e Editar. O conteúdo rola para mostrar enunciados longos.
 */
export function QuestionViewTemplate({
  title,
  details,
  notFoundMessage,
  viewIcon,
  actions,
  toast,
  onBack,
  backLabel,
  coins,
  userName,
}: Props) {
  const { scale } = useMockupScale(HELP_MOCKUP_WIDTH);
  const handleTabPress = useTopBarNavigation();

  return (
    <HelpLayout
      topBar={<TopBar onTabPress={handleTabPress} coins={coins} userName={userName} />}
      overlay={
        toast ? (
          <Toast message={toast.message} visible={toast.visible} onHide={toast.onHide} />
        ) : undefined
      }>
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
          <QuestionDetails {...details} />
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
