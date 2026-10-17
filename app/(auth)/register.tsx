import { router } from 'expo-router';

import { AuthHeader } from '@/components/organisms/AuthHeader';
import { AuthLayout } from '@/components/organisms/AuthLayout';
import { RegisterForm } from '@/components/organisms/RegisterForm';

export default function RegisterScreen() {
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
      />
    </AuthLayout>
  );
}
