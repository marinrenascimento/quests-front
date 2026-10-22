import { useFocusEffect, useNavigation } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

type Options = {
  /** Algo seria perdido ao sair: o voltar pede confirmação em vez de sair direto */
  enabled: boolean;
  /** Abre o modal de confirmação (o mesmo da seta de voltar) */
  onRequestLeave: () => void;
};

/**
 * Padrão do app para sair de uma tela (RN-115) no voltar do sistema: com `enabled`, o voltar do
 * Android (botão ou gesto) chama onRequestLeave em vez de sair, e o gesto de voltar por deslize
 * do iOS fica desligado (a saída passa pela seta, que pergunta). Sem `enabled`, os dois saem
 * direto, como sempre. A seta de voltar da tela continua a cargo de quem usa.
 */
export function useLeaveConfirm({ enabled, onRequestLeave }: Options) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ gestureEnabled: !enabled });
  }, [navigation, enabled]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (!enabled) {
          return false;
        }
        onRequestLeave();
        return true;
      });
      return () => subscription.remove();
    }, [enabled, onRequestLeave]),
  );
}
