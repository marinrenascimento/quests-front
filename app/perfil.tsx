import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';

import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { ProfileTemplate } from '@/components/templates/ProfileTemplate';
import { BACK_LABEL } from '@/constants/helpContent';
import {
  DELETE_ACCOUNT_CONFIRM_CONTENT,
  DISCARD_PROFILE_CONFIRM_CONTENT,
  EXPORT_DATA_CONFIRM_CONTENT,
  LOGOUT_CONFIRM_CONTENT,
  PROFILE_CONTENT,
} from '@/constants/profile';
import { useLeaveConfirm } from '@/hooks/useLeaveConfirm';
import { useProfileForm } from '@/hooks/useProfileForm';
import { useUser } from '@/hooks/useUser';

/** Modal aberto na tela */
type ConfirmKind = 'leave' | 'export' | 'delete' | 'logout';

/**
 * Perfil, aberto pela pílula do TopBar (regras: RN-330 a RN-342). Fica por cima das abas, na pilha
 * raiz: a tela de origem continua como estava, e o voltar retorna para ela.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const user = useUser();
  const form = useProfileForm();
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const hideToast = useCallback(() => setToastMessage(null), []);
  const openLeaveConfirm = useCallback(() => setConfirm('leave'), []);
  // Voltar do Android e gesto: perguntam só com alteração não salva
  useLeaveConfirm({ enabled: form.hasChanges, onRequestLeave: openLeaveConfirm });

  const leave = () => {
    // Volta para a tela de baixo; aberta sem histórico (ex.: link direto), vai para a Home
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const closeConfirm = () => setConfirm(null);

  // Sem deixar o app na pilha: depois do login, não dá para "voltar" para a conta anterior
  const goToLogin = () => {
    router.dismissAll();
    router.replace('/login');
  };

  return (
    <>
      <ProfileTemplate
        content={PROFILE_CONTENT}
        form={form}
        onSaveAccount={() => {
          if (form.saveAccount()) {
            setToastMessage(PROFILE_CONTENT.accountSavedToast);
          }
        }}
        onSavePassword={() => {
          if (form.savePassword()) {
            setToastMessage(PROFILE_CONTENT.passwordSavedToast);
          }
        }}
        onExportData={() => setConfirm('export')}
        onDeleteAccount={() => setConfirm('delete')}
        onLogout={() => setConfirm('logout')}
        toastMessage={toastMessage}
        onToastHide={hideToast}
        // Sem alteração, não há nada a perder: sai direto
        onBack={form.hasChanges ? openLeaveConfirm : leave}
        backLabel={BACK_LABEL}
      />
      <ConfirmModal
        visible={confirm === 'leave'}
        title={DISCARD_PROFILE_CONFIRM_CONTENT.title}
        confirmLabel={DISCARD_PROFILE_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DISCARD_PROFILE_CONFIRM_CONTENT.cancelLabel}
        // Fecha antes de navegar, para o modal não aparecer durante a troca de tela
        onConfirm={() => {
          closeConfirm();
          leave();
        }}
        onCancel={closeConfirm}
      />
      <ConfirmModal
        visible={confirm === 'export'}
        title={EXPORT_DATA_CONFIRM_CONTENT.title}
        highlight={user.email}
        highlightLines={1}
        confirmLabel={EXPORT_DATA_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={EXPORT_DATA_CONFIRM_CONTENT.cancelLabel}
        onConfirm={() => {
          closeConfirm();
          // TODO: pedir a exportação ao back, que envia o arquivo por e-mail.
          setToastMessage(PROFILE_CONTENT.exportToast);
        }}
        onCancel={closeConfirm}
      />
      <ConfirmModal
        visible={confirm === 'delete'}
        title={DELETE_ACCOUNT_CONFIRM_CONTENT.title}
        description={DELETE_ACCOUNT_CONFIRM_CONTENT.description}
        passwordField={{
          label: DELETE_ACCOUNT_CONFIRM_CONTENT.passwordLabel,
          placeholder: DELETE_ACCOUNT_CONFIRM_CONTENT.passwordPlaceholder,
          value: form.deletePassword,
          onChangeText: form.setDeletePassword,
          error: form.deletePasswordError,
        }}
        confirmLabel={DELETE_ACCOUNT_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={DELETE_ACCOUNT_CONFIRM_CONTENT.cancelLabel}
        onConfirm={() => {
          if (!form.checkDeletePassword()) {
            return;
          }
          closeConfirm();
          // TODO: excluir a conta no back. Por enquanto, só volta para o login.
          user.reset();
          goToLogin();
        }}
        onCancel={() => {
          closeConfirm();
          form.clearDeletePassword();
        }}
      />
      <ConfirmModal
        visible={confirm === 'logout'}
        title={LOGOUT_CONFIRM_CONTENT.title}
        confirmLabel={LOGOUT_CONFIRM_CONTENT.confirmLabel}
        cancelLabel={LOGOUT_CONFIRM_CONTENT.cancelLabel}
        onConfirm={() => {
          closeConfirm();
          // TODO: apagar o token salvo no aparelho (RN-002).
          goToLogin();
        }}
        onCancel={closeConfirm}
      />
    </>
  );
}
