import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/** false enquanto o app está em segundo plano (ex.: para pausar um jogo) */
export function useAppActive(): boolean {
  const [active, setActive] = useState(AppState.currentState !== 'background');

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => setActive(state === 'active'));
    return () => subscription.remove();
  }, []);

  return active;
}
