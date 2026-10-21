import { useRouter } from 'expo-router';

import { SupportBlock } from '@/components/molecules/SupportBlock';
import { HelpLayout } from '@/components/organisms/HelpLayout';
import { HelpSectionList } from '@/components/organisms/HelpSectionList';
import { HelpTopicHeader } from '@/components/organisms/HelpTopicHeader';
import { TopBar } from '@/components/organisms/TopBar';
import { HelpTopic, SupportContent } from '@/constants/helpContent';
import { useTopBarNavigation } from '@/hooks/useTopBarNavigation';

type Props = {
  /** Ícone, título, subtítulo e cartões do tópico */
  topic: HelpTopic;
  /** Moedas e nome do usuário mostrados no TopBar */
  coins: number;
  userName: string;
  /** Texto e botão do bloco de suporte no fim da tela */
  support: SupportContent;
  /** Rótulo de acessibilidade do botão voltar */
  backLabel: string;
};

/**
 * Template das telas de tópico da ajuda (Estudos, Conta, Privacidade, Feedback), empilhadas
 * sobre a Help: TopBar com a aba Help ativa, botão voltar, cabeçalho, cartões e bloco de
 * suporte. Nível "templates" do Atomic Design: monta organisms, e cada rota só passa os dados.
 */
export function HelpTopicTemplate({ topic, coins, userName, support, backLabel }: Props) {
  const router = useRouter();
  const handleTabPress = useTopBarNavigation();

  const handleBack = () => {
    // Volta na pilha da Help; aberta sem histórico (ex.: link direto), vai para a Help
    if (router.canDismiss()) {
      router.back();
    } else {
      router.replace('/(tabs)/help');
    }
  };

  return (
    <HelpLayout
      topBar={
        <TopBar activeTab="help" onTabPress={handleTabPress} coins={coins} userName={userName} />
      }
      footer={
        <SupportBlock
          prompt={support.prompt}
          buttonLabel={support.buttonLabel}
          buttonIcon={support.buttonIcon}
          onPress={() => {
            // TODO: definir canal de suporte.
          }}
        />
      }>
      <HelpTopicHeader
        icon={topic.icon}
        title={topic.title}
        subtitle={topic.subtitle}
        onBack={handleBack}
        backLabel={backLabel}
      />
      <HelpSectionList sections={topic.sections} />
    </HelpLayout>
  );
}
