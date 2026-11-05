import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';

type Options = {
  /** Muda a cada monstro novo: a caminhada recomeça do início */
  monsterId: number;
  /** true: o monstro caminha. false: fica parado onde está (ex.: jogo pausado) */
  moving: boolean;
  /** true: o monstro está sumindo */
  leaving: boolean;
  /** Tempo da caminhada inteira, em ms */
  crossingMs: number;
  /** Tempo para aparecer e para sumir, em ms */
  fadeMs: number;
  /** A caminhada chegou ao fim: o monstro alcançou o elfo */
  onReached: () => void;
  /** O monstro terminou de sumir */
  onGone: () => void;
};

/**
 * Animação do monstro: `progress` vai de 0 (começo do caminho) a 1 (alcançou o elfo) e `opacity`
 * faz ele aparecer e sumir. Roda na thread nativa (useNativeDriver), então o caminho não trava
 * enquanto o JS trabalha, e o fim da animação é o que decide que o monstro chegou.
 *
 * Pausar para a animação e guarda o tempo que falta, e continuar retoma do mesmo ponto: pausar não
 * dá tempo a mais nem a menos para responder.
 */
export function useMonsterWalk({
  monsterId,
  moving,
  leaving,
  crossingMs,
  fadeMs,
  onReached,
  onGone,
}: Options) {
  const [progress] = useState(() => new Animated.Value(0));
  const [opacity] = useState(() => new Animated.Value(0));
  const remainingMs = useRef(crossingMs);

  // Monstro novo: volta ao começo do caminho e aparece. Precisa vir antes do efeito da caminhada,
  // que usa o tempo restante zerado aqui.
  useEffect(() => {
    remainingMs.current = crossingMs;
    progress.setValue(0);
    opacity.setValue(0);
    const animation = Animated.timing(opacity, {
      toValue: 1,
      duration: fadeMs,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [monsterId, crossingMs, fadeMs, progress, opacity]);

  useEffect(() => {
    if (!moving) {
      return;
    }
    const startedAt = Date.now();
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: remainingMs.current,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) {
        onReached();
      }
    });
    return () => {
      animation.stop();
      remainingMs.current = Math.max(0, remainingMs.current - (Date.now() - startedAt));
    };
  }, [moving, monsterId, progress, onReached]);

  useEffect(() => {
    if (!leaving) {
      return;
    }
    const animation = Animated.timing(opacity, {
      toValue: 0,
      duration: fadeMs,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) {
        onGone();
      }
    });
    return () => animation.stop();
  }, [leaving, fadeMs, opacity, onGone]);

  return { progress, opacity };
}
