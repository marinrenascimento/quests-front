import { router } from 'expo-router';

import { AuthHeader } from '@/components/organisms/AuthHeader';
import { AuthLayout } from '@/components/organisms/AuthLayout';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { LoginForm } from '@/components/organisms/LoginForm';
import { SUPPORT_CONTENT } from '@/constants/helpContent';
import { useSupportModal } from '@/hooks/useSupportModal';

export default function LoginScreen() {
  const support = useSupportModal(SUPPORT_CONTENT.modal);

  return (
    <AuthLayout header={<AuthHeader heightRatio={0.42} />}>
      <LoginForm
        onSubmit={() => {
          // TODO: integrar com o back (autenticar usuário/senha e salvar "Lembrar de Mim")
          router.replace('/(tabs)');
        }}
        onRegisterPress={() => router.push('/register')}
        onForgotPasswordPress={support.open}
      />
      <ConfirmModal {...support.modalProps} />
    </AuthLayout>
  );
}
