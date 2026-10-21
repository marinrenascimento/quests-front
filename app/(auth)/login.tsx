import { router } from 'expo-router';

import { AuthHeader } from '@/components/organisms/AuthHeader';
import { AuthLayout } from '@/components/organisms/AuthLayout';
import { LoginForm } from '@/components/organisms/LoginForm';

export default function LoginScreen() {
  return (
    <AuthLayout header={<AuthHeader heightRatio={0.42} />}>
      <LoginForm
        onSubmit={() => {
          // TODO: integrar com o back (autenticar usuário/senha e salvar "Lembrar de Mim")
          router.replace('/(tabs)');
        }}
        onRegisterPress={() => router.push('/register')}
      />
    </AuthLayout>
  );
}
