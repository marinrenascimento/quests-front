import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions } from 'react-native';

type Props = {
  /** Fração da altura da tela ocupada pela capa (login ~0.42, cadastro ~0.40) */
  heightRatio: number;
};

export function AuthHeader({ heightRatio }: Props) {
  const { height } = useWindowDimensions();

  return (
    <Image
      source={require('@/assets/images/cenarios/capa.png')}
      contentFit="cover"
      contentPosition="top"
      style={[styles.image, { height: Math.round(height * heightRatio) }]}
      accessibilityLabel="Capa do Knight of Questions"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
  },
});
