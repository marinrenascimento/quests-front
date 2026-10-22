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
  /** "Esqueceu Sua Senha?": abre o modal de suporte (não há recuperação de senha no app) */
  onForgotPasswordPress: () => void;
};

export function LoginForm({ onSubmit, onRegisterPress, onForgotPasswordPress }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit() {
    const nextErrors: Errors = {};
    if (!username.trim()) nextErrors.username = 'Informe o Seu Usuário.';
    if (!password) nextErrors.password = 'Informe a Sua Senha.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      onSubmit({ username: username.trim(), password, remember });
    }
  }

  return (
    <View>
      <Title>{'Inicie Sua Sessão\nde Estudos!'}</Title>

      <View style={styles.firstField}>
        <FormField
          label="Usuário"
          placeholder="Digite o Seu Usuário"
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
          placeholder="Digite a Sua Senha"
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
        <Checkbox label="Lembrar de Mim" checked={remember} onChange={setRemember} />
      </View>

      <View style={styles.primary}>
        <PrimaryButton title="Login" onPress={handleSubmit} />
      </View>

      <View style={styles.secondary}>
        <SecondaryButton title="Não Tem Conta? Cadastre-se" onPress={onRegisterPress} />
      </View>

      <View style={styles.link}>
        <LinkText title="Esqueceu Sua Senha?" onPress={onForgotPasswordPress} />
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
