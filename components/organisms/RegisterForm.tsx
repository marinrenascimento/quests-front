import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Checkbox } from '@/components/atoms/Checkbox';
import { LinkText } from '@/components/atoms/LinkText';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { Title } from '@/components/atoms/Title';
import { FormField } from '@/components/molecules/FormField';

export type RegisterValues = {
  name: string;
  username: string;
  email: string;
  password: string;
  remember: boolean;
};

type Field = 'name' | 'username' | 'email' | 'password' | 'confirmPassword';
type Errors = Partial<Record<Field, string>>;

type Props = {
  /** Chamado só quando a validação local passa */
  onSubmit: (values: RegisterValues) => void;
  onLoginPress: () => void;
  /** "Esqueceu Sua Senha?": abre o modal de suporte (não há recuperação de senha no app) */
  onForgotPasswordPress: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({ onSubmit, onLoginPress, onForgotPasswordPress }: Props) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});

  function clearError(field: Field) {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit() {
    const nextErrors: Errors = {};
    if (!name.trim()) nextErrors.name = 'Informe o Seu Nome.';
    if (!username.trim()) nextErrors.username = 'Informe o Seu Usuário.';
    if (!email.trim()) nextErrors.email = 'Informe o Seu E-mail.';
    else if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = 'Digite um E-mail Válido.';
    if (!password) nextErrors.password = 'Informe a Sua Senha.';
    if (!confirmPassword) nextErrors.confirmPassword = 'Repita a Sua Senha.';
    else if (password !== confirmPassword) nextErrors.confirmPassword = 'As Senhas Não Coincidem.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password,
        remember,
      });
    }
  }

  return (
    <View>
      <Title size="compact">Crie uma Nova Conta!</Title>

      <View style={styles.firstField}>
        <FormField
          variant="outlined"
          label="Nome"
          placeholder="Digite o Seu Nome"
          value={name}
          onChangeText={(text) => {
            setName(text);
            clearError('name');
          }}
          error={errors.name}
          autoCapitalize="words"
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <FormField
          variant="outlined"
          label="Usuário"
          placeholder="Digite o Seu Usuário"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            clearError('username');
          }}
          error={errors.username}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <FormField
          variant="outlined"
          label="E-mail"
          placeholder="Digite o Seu E-mail"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            clearError('email');
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <FormField
          variant="outlined"
          label="Senha"
          placeholder="Digite a Sua Senha"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            clearError('password');
          }}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <FormField
          variant="outlined"
          label="Repita a Senha"
          placeholder="Repita a Sua Senha"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            clearError('confirmPassword');
          }}
          error={errors.confirmPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>

      <View style={styles.checkbox}>
        <Checkbox label="Lembrar de Mim" checked={remember} onChange={setRemember} size="compact" />
      </View>

      <View style={styles.primary}>
        <PrimaryButton title="Criar Conta" onPress={handleSubmit} size="compact" />
      </View>

      <View style={styles.secondary}>
        <SecondaryButton title="Já Tem Conta? Entrar" onPress={onLoginPress} size="compact" />
      </View>

      <View style={styles.link}>
        <LinkText title="Esqueceu Sua Senha?" size="compact" onPress={onForgotPasswordPress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  firstField: {
    marginTop: 6,
  },
  field: {
    marginTop: 5,
  },
  checkbox: {
    marginTop: 6,
  },
  primary: {
    marginTop: 7,
  },
  secondary: {
    marginTop: 6,
  },
  link: {
    marginTop: 6,
  },
});
