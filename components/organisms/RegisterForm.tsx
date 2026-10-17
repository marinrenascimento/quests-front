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
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm({ onSubmit, onLoginPress }: Props) {
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
    if (!name.trim()) nextErrors.name = 'Informe o seu nome.';
    if (!username.trim()) nextErrors.username = 'Informe o seu usuário.';
    if (!email.trim()) nextErrors.email = 'Informe o seu e-mail.';
    else if (!EMAIL_REGEX.test(email.trim())) nextErrors.email = 'Digite um e-mail válido.';
    if (!password) nextErrors.password = 'Informe a sua senha.';
    if (!confirmPassword) nextErrors.confirmPassword = 'Repita a sua senha.';
    else if (password !== confirmPassword) nextErrors.confirmPassword = 'As senhas não coincidem.';

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
      <Title size="compact">Crie uma nova conta!</Title>

      <View style={styles.firstField}>
        <FormField
          variant="outlined"
          label="Nome"
          placeholder="Digite o seu nome"
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
          placeholder="Digite o seu usuário"
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
          placeholder="Digite o seu e-mail"
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
          placeholder="Digite a sua senha"
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
          label="Repita a senha"
          placeholder="Repita a sua senha"
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
        <Checkbox label="Lembrar de mim" checked={remember} onChange={setRemember} size="compact" />
      </View>

      <View style={styles.primary}>
        <PrimaryButton title="Criar conta" onPress={handleSubmit} size="compact" />
      </View>

      <View style={styles.secondary}>
        <SecondaryButton title="Já tem conta? Entrar" onPress={onLoginPress} size="compact" />
      </View>

      <View style={styles.link}>
        {/* TODO: criar a tela de recuperação de senha e integrar com o back */}
        <LinkText title="Esqueceu sua senha?" size="compact" />
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
