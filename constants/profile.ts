import type { IconName } from '@/constants/helpContent';
import type { TrimmedImageSpec } from '@/utils/trimmedImage';

/** Um avatar ou um fundo que pode ser escolhido no Perfil */
export type ProfileImageOption = {
  id: string;
  /** Lido pelo leitor de tela (a grade mostra só a imagem) */
  name: string;
  /** Imagem sem a margem transparente do arquivo */
  image: TrimmedImageSpec;
};

/** Medidas dos arquivos dos avatares, em pixels */
const TALL_IMAGE = { width: 1086, height: 1448 };
const KNIGHT_IMAGE = { width: 1024, height: 1536 };
const ELF_IMAGE = { width: 1364, height: 1153 };

/** Avatares sem upgrade, na ordem dos níveis 0 a 6 (RN-094) */
export const BASIC_AVATARS: ProfileImageOption[] = [
  {
    id: 'cavaleiro',
    name: 'Cavaleiro',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/cavaleiro.png'),
      imageSize: KNIGHT_IMAGE,
      content: { x: 78, y: 228, width: 696, height: 949 },
    },
  },
  {
    id: 'goblin',
    name: 'Goblin',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/goblin.png'),
      imageSize: TALL_IMAGE,
      content: { x: 33, y: 56, width: 1015, height: 1372 },
    },
  },
  {
    id: 'rei',
    name: 'Rei',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/rei.png'),
      imageSize: TALL_IMAGE,
      content: { x: 92, y: 11, width: 852, height: 1419 },
    },
  },
  {
    id: 'mago',
    name: 'Mago',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/mago.png'),
      imageSize: TALL_IMAGE,
      content: { x: 102, y: 99, width: 955, height: 1319 },
    },
  },
  {
    id: 'fada',
    name: 'Fada',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/fada.png'),
      imageSize: TALL_IMAGE,
      content: { x: 23, y: 133, width: 1049, height: 1263 },
    },
  },
  {
    id: 'esqueleto',
    name: 'Esqueleto de Manto Negro',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/esqueloMantoNegro.png'),
      imageSize: TALL_IMAGE,
      content: { x: 100, y: 182, width: 920, height: 1190 },
    },
  },
  {
    id: 'elfo',
    name: 'Elfo',
    image: {
      source: require('@/assets/images/avatares/sem-upgrade/elfo.png'),
      imageSize: ELF_IMAGE,
      content: { x: 350, y: 158, width: 654, height: 978 },
    },
  },
];

/** Avatares com upgrade, na ordem dos níveis 7 a 13 (RN-094 e RN-095) */
export const UPGRADED_AVATARS: ProfileImageOption[] = [
  {
    id: 'cavaleiro-dourado',
    name: 'Cavaleiro Dourado',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/cavaleiroDourado.png'),
      imageSize: KNIGHT_IMAGE,
      content: { x: 72, y: 116, width: 791, height: 1233 },
    },
  },
  {
    id: 'goblin-terno',
    name: 'Goblin de Terno',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/goblinTerno.png'),
      imageSize: TALL_IMAGE,
      content: { x: 33, y: 56, width: 1015, height: 1372 },
    },
  },
  {
    id: 'rei-roupa-nova',
    name: 'Rei de Roupa Nova',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/reiRoupaNova.png'),
      imageSize: TALL_IMAGE,
      content: { x: 93, y: 11, width: 850, height: 1419 },
    },
  },
  {
    id: 'mago-estrelas',
    name: 'Mago de Estrelas',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/magoEstrelas.png'),
      imageSize: TALL_IMAGE,
      content: { x: 103, y: 100, width: 954, height: 1317 },
    },
  },
  {
    id: 'fada-flores',
    name: 'Fada das Flores',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/fadaFlores.png'),
      imageSize: TALL_IMAGE,
      content: { x: 24, y: 134, width: 1048, height: 1261 },
    },
  },
  {
    id: 'esqueleto-upgrade',
    name: 'Esqueleto',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/esqueleto.png'),
      imageSize: TALL_IMAGE,
      content: { x: 99, y: 181, width: 922, height: 1191 },
    },
  },
  {
    id: 'elfo-manto-branco',
    name: 'Elfo de Manto Branco',
    image: {
      source: require('@/assets/images/avatares/com-upgrade/elfoMantoBranco.png'),
      imageSize: ELF_IMAGE,
      content: { x: 350, y: 158, width: 653, height: 977 },
    },
  },
];

/** Avatar de quem ainda não escolheu nenhum: o do nível 0 */
export const DEFAULT_AVATAR_ID = BASIC_AVATARS[0].id;

/** Fundo que ocupa o arquivo inteiro (os cenários são quadrados, sem margem transparente) */
function fullImage(source: TrimmedImageSpec['source'], side: number): TrimmedImageSpec {
  return {
    source,
    imageSize: { width: side, height: side },
    content: { x: 0, y: 0, width: side, height: side },
  };
}

const BACKGROUND_SIDE = 1254;

/** Fundos, na ordem dos níveis 14 a 20 (RN-100) */
export const BACKGROUNDS: ProfileImageOption[] = [
  {
    id: 'fundo-cavaleiro',
    name: 'Fundo do Cavaleiro',
    image: fullImage(require('@/assets/images/cenarios/cenarioCavaleiro.png'), 1080),
  },
  {
    id: 'fundo-goblin',
    name: 'Fundo do Goblin',
    image: fullImage(require('@/assets/images/cenarios/cenarioGoblin.png'), BACKGROUND_SIDE),
  },
  {
    id: 'fundo-mago',
    name: 'Fundo do Mago',
    image: fullImage(require('@/assets/images/cenarios/cenarioMago.png'), BACKGROUND_SIDE),
  },
  {
    id: 'fundo-fada',
    name: 'Fundo da Fada',
    image: fullImage(require('@/assets/images/cenarios/cenarioFada.png'), BACKGROUND_SIDE),
  },
  {
    id: 'fundo-esqueleto',
    name: 'Fundo do Esqueleto',
    image: fullImage(require('@/assets/images/cenarios/cenarioEsqueleto.png'), BACKGROUND_SIDE),
  },
  {
    id: 'fundo-elfo',
    name: 'Fundo do Elfo',
    image: fullImage(require('@/assets/images/cenarios/cenarioElfo.png'), BACKGROUND_SIDE),
  },
  {
    id: 'fundo-rei',
    name: 'Fundo do Rei',
    image: fullImage(require('@/assets/images/cenarios/cenarioRei.png'), BACKGROUND_SIDE),
  },
];

/** Textos da tela Perfil (os títulos são exibidos em caixa alta pelos componentes) */
export const PROFILE_CONTENT = {
  title: 'Meu Perfil',
  avatarLabel: (name: string) => `Avatar de ${name}`,
  /** A faixa vem em caixa alta (RANK_LEVEL_LABELS): aqui fica como o resto da frase */
  levelLabel: (level: number, tier: string) =>
    `Nível ${level} · ${tier.charAt(0)}${tier.slice(1).toLowerCase()}`,
  pointsLabel: 'Pontos',
  pointsValue: (points: string) => `${points} Moedas`,
  usernameLabel: 'Usuário',
  emailLabel: 'E-mail',

  accountTitle: 'Editar Dados',
  nameLabel: 'Nome de Exibição',
  namePlaceholder: 'Digite o Seu Nome',
  nameRequired: 'Informe o Seu Nome.',
  newEmailLabel: 'E-mail',
  emailPlaceholder: 'Digite o Seu E-mail',
  emailRequired: 'Informe o Seu E-mail.',
  emailInvalid: 'Digite um E-mail Válido.',
  /** Só aparece com o e-mail alterado: trocar o e-mail pede a senha (RN-332) */
  emailPasswordLabel: 'Sua Senha',
  emailPasswordPlaceholder: 'Digite a Sua Senha para Confirmar',
  emailPasswordRequired: 'Informe a Sua Senha para Trocar o E-mail.',

  passwordTitle: 'Alterar Senha',
  currentPasswordLabel: 'Senha Atual',
  currentPasswordPlaceholder: 'Digite a Senha Atual',
  currentPasswordRequired: 'Informe a Senha Atual.',
  newPasswordLabel: 'Nova Senha',
  newPasswordPlaceholder: 'Digite a Nova Senha',
  newPasswordRequired: 'Informe a Nova Senha.',
  /** A mesma regra da ajuda (Help > Conta) e do cadastro (RN-009) */
  newPasswordRule: 'Use Pelo Menos 8 Caracteres, com Letras e Números.',
  newPasswordSameAsCurrent: 'A Nova Senha Precisa Ser Diferente da Atual.',
  confirmPasswordLabel: 'Repita a Nova Senha',
  confirmPasswordPlaceholder: 'Repita a Nova Senha',
  confirmPasswordRequired: 'Repita a Nova Senha.',
  confirmPasswordMismatch: 'As Senhas Não Coincidem.',

  avatarTitle: 'Escolher Avatar',
  basicAvatarsTitle: 'Sem Upgrade',
  upgradedAvatarsTitle: 'Com Upgrade',
  backgroundTitle: 'Escolher Fundo',
  noBackgroundLabel: 'Sem Fundo',
  noBackgroundIcon: 'image-off-outline' as IconName,
  selectedIcon: 'check-circle' as IconName,

  securityTitle: 'Privacidade e Segurança',
  twoFactorLabel: 'Autenticação em Duas Etapas',
  twoFactorText: 'Recomendamos ativar para aumentar a segurança da sua conta.',
  dataText: 'Você pode pedir uma cópia de todos os seus dados ou excluir a sua conta.',
  exportLabel: 'Exportar Dados',
  deleteLabel: 'Excluir Conta',
  logoutLabel: 'Sair da Conta',
  logoutIcon: 'logout' as IconName,

  saveLabel: 'Salvar',
  cancelLabel: 'Cancelar',
  accountSavedToast: 'Dados Salvos com Sucesso!',
  passwordSavedToast: 'Senha Alterada com Sucesso!',
  exportToast: 'Pedido de Exportação Registrado!',
};

export type ProfileContent = typeof PROFILE_CONTENT;

/** Modal ao sair do Perfil com alteração não salva */
export const DISCARD_PROFILE_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Sair sem Salvar as Alterações?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal de "Exportar Dados" (o destaque é o e-mail que recebe o arquivo) */
export const EXPORT_DATA_CONFIRM_CONTENT = {
  title: 'Deseja Receber os Seus Dados Neste E-mail?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal de "Excluir Conta": pede a senha para confirmar */
export const DELETE_ACCOUNT_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Excluir a Sua Conta?',
  description: 'Todos os seus decks, provas e moedas serão apagados, sem possibilidade de volta.',
  passwordLabel: 'Sua Senha',
  passwordPlaceholder: 'Digite a Sua Senha para Confirmar',
  passwordRequired: 'Informe a Sua Senha para Excluir a Conta.',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};

/** Modal de "Sair da Conta" */
export const LOGOUT_CONFIRM_CONTENT = {
  title: 'Tem Certeza que Deseja Sair da Sua Conta?',
  confirmLabel: 'Sim',
  cancelLabel: 'Não',
};
