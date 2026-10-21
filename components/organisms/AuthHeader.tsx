import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  /** Fração da altura da tela ocupada pela capa (login ~0.42, cadastro ~0.40) */
  heightRatio: number;
};

/**
 * Capa das telas de login e cadastro. Começa abaixo da barra de status: em alguns Android a
 * barra é pintada por cima do app e escondia o topo do título "Knight of Questions" (o título
 * fica no alto da imagem). A faixa da barra fica com o branco do formulário (AuthLayout).
 */
export function AuthHeader({ heightRatio }: Props) {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ paddingTop: insets.top }}>
      <Image
        source={require('@/assets/images/cenarios/capa.png')}
        contentFit="cover"
        contentPosition="top"
        style={[styles.image, { height: Math.round(height * heightRatio) }]}
        accessibilityLabel="Capa do Knight of Questions"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
});
