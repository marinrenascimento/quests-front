import { Redirect } from 'expo-router';

// Primeira tela do app: login.
// TODO: integrar com o back (se já houver sessão salva, ir direto para /(tabs)).
export default function Index() {
  return <Redirect href="/login" />;
}
