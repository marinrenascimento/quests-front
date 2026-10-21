import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { ComponentProps } from 'react';

/** Nome de um ícone do MaterialCommunityIcons (@expo/vector-icons) */
export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type HelpMenuKey = 'estudos' | 'conta' | 'privacidade' | 'feedback';

export type HelpMenuItem = {
  key: HelpMenuKey;
  label: string;
  icon: IconName;
};

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export type HelpSection = {
  id: string;
  title: string;
  text: string;
};

/** Um tópico de ajuda (Estudos, Conta, Privacidade, Feedback): cabeçalho e cartões */
export type HelpTopic = {
  title: string;
  subtitle: string;
  icon: IconName;
  sections: HelpSection[];
};

export type SupportContent = {
  prompt: string;
  buttonLabel: string;
  buttonIcon: IconName;
};

// Conteúdo estático das telas de ajuda. Os títulos ficam em texto normal:
// a caixa alta é aplicada pelo componente (PixelText).

// TODO: confirmar o e-mail oficial do suporte (texto provisório do mockup).
export const SUPPORT_EMAIL = 'suporte@questforgold.com';

/** Grade de botões da Help, na ordem do mockup (as ações ficam na tela) */
export const HELP_MENU: HelpMenuItem[] = [
  { key: 'estudos', label: 'Estudos', icon: 'book-open-blank-variant' },
  { key: 'conta', label: 'Conta', icon: 'account' },
  { key: 'privacidade', label: 'Privacidade', icon: 'shield-check-outline' },
  { key: 'feedback', label: 'Feedback', icon: 'chat-outline' },
];

export const HELP_FAQ_TITLE = 'Perguntas frequentes';

export const HELP_FAQ: FaqEntry[] = [
  {
    id: 'novo-deck',
    question: 'Como criar um novo deck de flashcards?',
    answer:
      'Acesse a seção "Cards" no menu principal e clique no botão "+ Novo Deck". Dê um nome ao deck, escolha a matéria e comece a adicionar seus cards com frente e verso.',
  },
  {
    id: 'filtrar-questoes',
    question: 'Posso filtrar questões por vestibular ou matéria?',
    answer:
      'Sim! Na seção "Questões", use os filtros de prova (ENEM, ITA, FUVEST, etc.), matéria e nível de dificuldade para encontrar exatamente o que precisa.',
  },
  {
    id: 'ranking',
    question: 'Como funciona o ranking?',
    answer:
      'O ranking é atualizado com base na quantidade de moedas acumuladas por todos os jogadores. Mantenha uma rotina de estudos para subir de posição.',
  },
  {
    id: 'relatorios',
    question: 'Os relatórios mostram quais informações?',
    answer:
      'Os relatórios exibem horas de estudo por dia, taxa de acerto por matéria, sequência de dias estudados e evolução semanal/mensal do seu desempenho.',
  },
];

/** Tela Estudos (aberta pelo botão "Estudos" da Help) */
export const STUDY_TOPIC: HelpTopic = {
  title: 'Estudos',
  subtitle: 'Tudo sobre flashcards, questões e suas ferramentas de revisão.',
  icon: 'book-open-blank-variant',
  sections: [
    {
      id: 'decks',
      title: 'Criando e gerenciando decks',
      text: 'Para criar um deck, vá em Cards > + Novo Deck. Nomeie seu deck, selecione a matéria e adicione cards com frente (pergunta) e verso (resposta). Você pode editar, reorganizar ou excluir cards a qualquer momento.',
    },
    {
      id: 'questoes',
      title: 'Banco de questões e filtros',
      text: 'Na seção Questões, filtre por vestibular (ENEM, ITA, FUVEST), matéria (Matemática, Física, etc.) e dificuldade (Fácil, Médio, Difícil). Ao responder, você recebe a correção imediata com explicação detalhada.',
    },
    {
      id: 'jogos',
      title: 'Jogos educativos',
      text: 'Os jogos como Caça-Palavras e Quiz Relâmpago reforçam o aprendizado de forma divertida. Cada jogo concede XP e conta para o ranking. Novos jogos são adicionados regularmente!',
    },
  ],
};

/** Tela Conta (botão "Conta" da Help). Mesmo ícone do botão. */
export const ACCOUNT_TOPIC: HelpTopic = {
  title: 'Conta',
  subtitle: 'Gerencie seu perfil, avatar e configurações pessoais.',
  icon: 'account',
  sections: [
    {
      id: 'perfil',
      title: 'Editando seu perfil',
      text: 'Acesse seu perfil clicando no ícone do avatar no canto superior direito. Lá você pode alterar seu nome de exibição, e-mail e informações pessoais.',
    },
    {
      id: 'avatar',
      title: 'Escolhendo seu avatar',
      text: 'Escolha entre os avatares disponíveis. Cada um possui visual único e novos avatares são desbloqueados conforme você sobe de nível!',
    },
    {
      id: 'senha',
      title: 'Alterando senha',
      text: 'Para alterar sua senha, vá em Configurações > Segurança > Alterar Senha. Digite a senha atual e a nova senha duas vezes para confirmar. Use pelo menos 8 caracteres com letras e números.',
    },
  ],
};

/**
 * Tela Privacidade & Segurança (botão "Privacidade" da Help). O escudo do mockup tem um
 * símbolo no centro ("!"), diferente do escudo com check do botão.
 * O subtítulo do mockup repetia o da Conta (erro do mockup): este foi definido à parte.
 */
export const PRIVACY_TOPIC: HelpTopic = {
  title: 'Privacidade & Segurança',
  subtitle: 'Entenda como protegemos seus dados e sua conta.',
  icon: 'shield-alert-outline',
  sections: [
    {
      id: 'protecao',
      title: 'Como protegemos seus dados',
      text: 'Todos os dados são criptografados em trânsito (TLS) e em repouso. Seus dados de estudo ficam armazenados de forma segura e nunca são compartilhados com terceiros sem seu consentimento.',
    },
    {
      id: 'exportar-excluir',
      title: 'Exportar ou excluir seus dados',
      text: 'Você tem direito a solicitar a exportação de todos os seus dados em formato legível ou a exclusão completa da sua conta. Acesse Configurações > Privacidade > Gerenciar Dados.',
    },
    {
      id: '2fa',
      title: 'Autenticação em duas etapas',
      text: 'Recomendamos ativar a autenticação em duas etapas (2FA) para aumentar a segurança da sua conta. Vá em Configurações > Segurança > Ativar 2FA e siga as instruções.',
    },
  ],
};

/** Tela Feedback (botão "Feedback" da Help). Mesmo ícone do botão. */
export const FEEDBACK_TOPIC: HelpTopic = {
  title: 'Feedback',
  subtitle: 'Envie sugestões, reporte bugs ou compartilhe ideias para melhorar o app.',
  icon: 'chat-outline',
  sections: [
    {
      id: 'bug',
      title: 'Reportar um bug',
      text: `Encontrou um problema? Descreva o que aconteceu, em qual página e qual dispositivo estava usando. Envie para ${SUPPORT_EMAIL} com o assunto "Bug Report".`,
    },
    {
      id: 'sugestao',
      title: 'Enviar sugestão de funcionalidade',
      text: `Tem uma ideia para melhorar o app? Adoraríamos ouvir nossos usuários! Envie sua sugestão para ${SUPPORT_EMAIL} com o assunto "Sugestão".`,
    },
    {
      id: 'geral',
      title: 'Feedback geral',
      text: 'Quer elogiar, criticar ou comentar sobre sua experiência? Toda opinião é valiosa para nós. Envie uma mensagem descrevendo sua experiência e responderemos em até 48 horas.',
    },
  ],
};

/** Bloco de suporte no fim de todas as telas de ajuda */
export const SUPPORT_CONTENT: SupportContent = {
  prompt: 'Não encontrou o que procurava?',
  buttonLabel: 'Falar com o suporte',
  buttonIcon: 'message-text-outline',
};

/** Rótulo de acessibilidade do botão voltar */
export const BACK_LABEL = 'Voltar';
