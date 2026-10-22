import { router } from 'expo-router';

import { AuthHeader } from '@/components/organisms/AuthHeader';
import { AuthLayout } from '@/components/organisms/AuthLayout';
import { ConfirmModal } from '@/components/organisms/ConfirmModal';
import { RegisterForm } from '@/components/organisms/RegisterForm';
import { SUPPORT_CONTENT } from '@/constants/helpContent';
import { useSupportModal } from '@/hooks/useSupportModal';

export default function RegisterScreen() {
  const support = useSupportModal(SUPPORT_CONTENT.modal);

  function goToLogin() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  }

  return (
    <AuthLayout header={<AuthHeader heightRatio={0.4} />}>
      <RegisterForm
        onSubmit={() => {
          // TODO: integrar com o back (criar a conta). Por enquanto, volta para o login.
          goToLogin();
        }}
        onLoginPress={goToLogin}
        onForgotPasswordPress={support.open}
      />
      <ConfirmModal {...support.modalProps} />
    </AuthLayout>
  );
}
