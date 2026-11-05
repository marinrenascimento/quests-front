import { useState } from 'react';

import { DELETE_ACCOUNT_CONFIRM_CONTENT, PROFILE_CONTENT } from '@/constants/profile';
import { useUser } from '@/hooks/useUser';
import { isValidEmail, isValidPassword } from '@/utils/validation';

type AccountField = 'name' | 'email' | 'emailPassword';
type PasswordField = 'currentPassword' | 'newPassword' | 'confirmPassword';
type Errors<Field extends string> = Partial<Record<Field, string>>;

const EMPTY_PASSWORDS: Record<PasswordField, string> = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

/**
 * Formulários do Perfil em estado local, no padrão do cadastro: os erros só aparecem ao salvar e
 * somem quando o campo volta a ser preenchido. Os botões de cada formulário só aparecem com algo
 * a salvar. Sair da tela descarta o que não foi salvo.
 */
export function useProfileForm() {
  const user = useUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [emailPassword, setEmailPassword] = useState('');
  const [accountErrors, setAccountErrors] = useState<Errors<AccountField>>({});
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [passwordErrors, setPasswordErrors] = useState<Errors<PasswordField>>({});
  const [deletePassword, setDeletePasswordValue] = useState('');
  const [deletePasswordError, setDeletePasswordError] = useState<string | undefined>(undefined);

  const emailChanged = email.trim() !== user.email;
  const accountChanged = name.trim() !== user.name || emailChanged;
  const passwordChanged = Object.values(passwords).some((value) => value !== '');

  return {
    name,
    email,
    emailPassword,
    /** Trocar o e-mail pede a senha: o campo só aparece com o e-mail alterado */
    emailChanged,
    accountErrors,
    accountChanged,
    deletePassword,
    deletePasswordError,
    passwords,
    passwordErrors,
    passwordChanged,
    /** Algo seria perdido ao sair (a seta e o voltar do Android pedem confirmação) */
    hasChanges: accountChanged || passwordChanged,
    setName: (text: string) => {
      setName(text);
      setAccountErrors((prev) => ({ ...prev, name: undefined }));
    },
    setEmail: (text: string) => {
      setEmail(text);
      setAccountErrors((prev) => ({ ...prev, email: undefined }));
      // Voltou ao e-mail salvo: o campo some, e a senha digitada não fica guardada
      if (text.trim() === user.email) {
        setEmailPassword('');
        setAccountErrors((prev) => ({ ...prev, emailPassword: undefined }));
      }
    },
    setEmailPassword: (text: string) => {
      setEmailPassword(text);
      setAccountErrors((prev) => ({ ...prev, emailPassword: undefined }));
    },
    setDeletePassword: (text: string) => {
      setDeletePasswordValue(text);
      setDeletePasswordError(undefined);
    },
    /** Limpa a senha ao fechar o modal de excluir a conta */
    clearDeletePassword: () => {
      setDeletePasswordValue('');
      setDeletePasswordError(undefined);
    },
    /** Confere se a senha foi digitada e mostra o erro. Devolve se pode excluir a conta. */
    checkDeletePassword: (): boolean => {
      if (!deletePassword) {
        setDeletePasswordError(DELETE_ACCOUNT_CONFIRM_CONTENT.passwordRequired);
        return false;
      }
      // TODO: enviar a senha ao back, que confere antes de excluir a conta.
      return true;
    },
    setPassword: (field: PasswordField, text: string) => {
      setPasswords((prev) => ({ ...prev, [field]: text }));
      setPasswordErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    /** Volta o nome e o e-mail para os valores salvos */
    cancelAccount: () => {
      setName(user.name);
      setEmail(user.email);
      setEmailPassword('');
      setAccountErrors({});
    },
    cancelPassword: () => {
      setPasswords(EMPTY_PASSWORDS);
      setPasswordErrors({});
    },
    /** Confere o nome e o e-mail e, com tudo certo, salva. Devolve se salvou. */
    saveAccount: (): boolean => {
      const nextName = name.trim();
      const nextEmail = email.trim();
      const nextErrors: Errors<AccountField> = {};
      if (!nextName) nextErrors.name = PROFILE_CONTENT.nameRequired;
      if (!nextEmail) nextErrors.email = PROFILE_CONTENT.emailRequired;
      else if (!isValidEmail(nextEmail)) nextErrors.email = PROFILE_CONTENT.emailInvalid;
      if (emailChanged && !emailPassword) {
        nextErrors.emailPassword = PROFILE_CONTENT.emailPasswordRequired;
      }

      setAccountErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        return false;
      }
      // TODO: salvar no back, que confere a senha e se o e-mail já está em uso (409).
      user.updateAccount({ name: nextName, email: nextEmail });
      setName(nextName);
      setEmail(nextEmail);
      setEmailPassword('');
      return true;
    },
    /** Confere as senhas e, com tudo certo, limpa os campos. Devolve se alterou. */
    savePassword: (): boolean => {
      const { currentPassword, newPassword, confirmPassword } = passwords;
      const nextErrors: Errors<PasswordField> = {};
      if (!currentPassword) nextErrors.currentPassword = PROFILE_CONTENT.currentPasswordRequired;
      if (!newPassword) nextErrors.newPassword = PROFILE_CONTENT.newPasswordRequired;
      else if (!isValidPassword(newPassword)) nextErrors.newPassword = PROFILE_CONTENT.newPasswordRule;
      else if (newPassword === currentPassword) {
        nextErrors.newPassword = PROFILE_CONTENT.newPasswordSameAsCurrent;
      }
      if (!confirmPassword) nextErrors.confirmPassword = PROFILE_CONTENT.confirmPasswordRequired;
      else if (confirmPassword !== newPassword) {
        nextErrors.confirmPassword = PROFILE_CONTENT.confirmPasswordMismatch;
      }

      setPasswordErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        return false;
      }
      // TODO: enviar ao back, que confere a senha atual (o app não conhece a senha).
      setPasswords(EMPTY_PASSWORDS);
      return true;
    },
  };
}

export type ProfileFormState = ReturnType<typeof useProfileForm>;
