import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

import { MOCK_USER } from '@/constants/mockUser';
import {
  BACKGROUNDS,
  BASIC_AVATARS,
  DEFAULT_AVATAR_ID,
  ProfileImageOption,
  UPGRADED_AVATARS,
} from '@/constants/profile';

type UserData = {
  name: string;
  username: string;
  email: string;
  /** Moedas: são os pontos do Rank (RN-092) */
  coins: number;
  /** Soma moedas ganhas (hoje, nas partidas dos jogos, RN-313) */
  addCoins: (amount: number) => void;
  avatarId: string;
  /** Sem valor: o avatar aparece sem fundo */
  backgroundId?: string;
  avatar: ProfileImageOption;
  background?: ProfileImageOption;
  twoFactorEnabled: boolean;
  /** Troca o nome de exibição e o e-mail (já conferidos pelo formulário) */
  updateAccount: (account: { name: string; email: string }) => void;
  selectAvatar: (id: string) => void;
  /** Sem id: tira o fundo */
  selectBackground: (id?: string) => void;
  setTwoFactorEnabled: (enabled: boolean) => void;
  /** Volta aos valores iniciais (ao excluir a conta) */
  reset: () => void;
};

const UserContext = createContext<UserData | null>(null);

const ALL_AVATARS = [...BASIC_AVATARS, ...UPGRADED_AVATARS];

type Props = {
  children: ReactNode;
};

/**
 * Fonte única do usuário logado: TopBar, Rank e Perfil leem daqui. Fica na raiz do app, porque o
 * Perfil abre por cima das abas. Tudo em memória: some ao fechar o app.
 */
// TODO: substituir pelos dados do back e salvar as alterações (GET e PATCH em /me).
export function UserProvider({ children }: Props) {
  const [name, setName] = useState(MOCK_USER.name);
  const [email, setEmail] = useState(MOCK_USER.email);
  const [coins, setCoins] = useState(MOCK_USER.coins);
  const [avatarId, setAvatarId] = useState(DEFAULT_AVATAR_ID);
  const [backgroundId, setBackgroundId] = useState<string | undefined>(undefined);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const updateAccount = useCallback((account: { name: string; email: string }) => {
    setName(account.name);
    setEmail(account.email);
  }, []);

  // TODO: as moedas passam a vir do back, que registra cada ganho (CoinTransaction).
  const addCoins = useCallback((amount: number) => setCoins((current) => current + amount), []);

  const reset = useCallback(() => {
    setName(MOCK_USER.name);
    setEmail(MOCK_USER.email);
    setCoins(MOCK_USER.coins);
    setAvatarId(DEFAULT_AVATAR_ID);
    setBackgroundId(undefined);
    setTwoFactorEnabled(false);
  }, []);

  const value = useMemo(
    () => ({
      name,
      username: MOCK_USER.username,
      email,
      coins,
      addCoins,
      avatarId,
      backgroundId,
      avatar: ALL_AVATARS.find((item) => item.id === avatarId) ?? BASIC_AVATARS[0],
      background: BACKGROUNDS.find((item) => item.id === backgroundId),
      twoFactorEnabled,
      updateAccount,
      selectAvatar: setAvatarId,
      selectBackground: setBackgroundId,
      setTwoFactorEnabled,
      reset,
    }),
    [name, email, coins, avatarId, backgroundId, twoFactorEnabled, updateAccount, addCoins, reset],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

/** Usuário logado. Só funciona dentro do UserProvider. */
export function useUser(): UserData {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser precisa estar dentro do UserProvider.');
  }
  return context;
}
