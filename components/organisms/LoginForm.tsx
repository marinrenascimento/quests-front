import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Checkbox } from '@/components/atoms/Checkbox';
import { LinkText } from '@/components/atoms/LinkText';
import { PrimaryButton } from '@/components/atoms/PrimaryButton';
import { SecondaryButton } from '@/components/atoms/SecondaryButton';
import { Title } from '@/components/atoms/Title';
import { FormField } from '@/components/molecules/FormField';

export type LoginValues = {
  username: string;
  password: string;
  remember: boolean;
};

type Errors = Partial<Record<'username' | 'password', string>>;

type Props = {
  /** Chamado só quando a validação local passa */
  onSubmit: (values: LoginValues) => void;
  onRegisterPress: () => void;
};

export function LoginForm({ onSubmit, onRegisterPress }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit() {
    const nextErrors: Errors = {};
    if (!username.trim()) nextErrors.username = 'Informe o seu usuário.';
    if (!password) nextErrors.password = 'Informe a sua senha.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ username: username.trim(), password, remember });
    }
  }

  return (
    <View>
      <Title>{'Inicie sua sessão\nde estudos!'}</Title>

      <View style={styles.firstField}>
        <FormField
          label="Usuário"
          placeholder="Digite o seu usuário"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setErrors((prev) => ({ ...prev, username: undefined }));
          }}
          error={errors.username}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      <View style={styles.field}>
        <FormField
          label="Senha"
          placeholder="Digite a sua senha"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>

      <View style={styles.checkbox}>
        <Checkbox label="Lembrar de mim" checked={remember} onChange={setRemember} />
      </View>

      <View style={styles.primary}>
        <PrimaryButton title="Login" onPress={handleSubmit} />
      </View>

      <View style={styles.secondary}>
        <SecondaryButton title="Não tem conta? Cadastre-se" onPress={onRegisterPress} />
      </View>

      <View style={styles.link}>
        {/* TODO: criar a tela de recuperação de senha e integrar com o back */}
        <LinkText title="Esqueceu sua senha?" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  firstField: {
    marginTop: 17,
  },
  field: {
    marginTop: 14,
  },
  checkbox: {
    marginTop: 16,
  },
  primary: {
    marginTop: 15,
  },
  secondary: {
    marginTop: 11,
  },
  link: {
    marginTop: 12,
  },
});
