import { useWindowDimensions } from 'react-native';

/** Largura da tela no mockup da Home, em px: referência para as medidas tiradas dele. */
const MOCKUP_SCREEN_WIDTH = 306;
/** Em tablets o layout para de crescer nesta largura (dp) e fica centralizado. */
const MAX_LAYOUT_WIDTH = 480;

/**
 * Converte medidas do mockup (px) para dp, proporcionalmente à largura da tela.
 * Ex.: scale(34) vira 40dp numa tela de 360dp e 45.8dp numa de 412dp.
 */
export function useMockupScale() {
  const { width } = useWindowDimensions();
  const layoutWidth = Math.min(width, MAX_LAYOUT_WIDTH);
  const factor = layoutWidth / MOCKUP_SCREEN_WIDTH;

  return {
    /** Largura útil do layout (a tela, limitada em tablets) */
    layoutWidth,
    scale: (mockupPx: number) => mockupPx * factor,
  };
}
