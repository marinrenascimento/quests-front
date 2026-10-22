import { useWindowDimensions } from 'react-native';

/** Largura da tela no mockup da Home, em px: referência para as medidas tiradas dele. */
const MOCKUP_SCREEN_WIDTH = 306;
/**
 * Largura da tela no mockup da Help, em px. O mockup da Estudos (266px) foi convertido
 * para esta mesma escala, então as duas telas usam as mesmas medidas.
 */
export const HELP_MOCKUP_WIDTH = 310;
/** Largura da tela no mockup da realização de prova, em px (as medidas da tela saem dele) */
export const EXAM_MOCKUP_WIDTH = 349;
/** Em tablets o layout para de crescer nesta largura (dp) e fica centralizado. */
const MAX_LAYOUT_WIDTH = 480;

/**
 * Converte medidas do mockup (px) para dp, proporcionalmente à largura da tela.
 * Ex.: scale(34) vira 40dp numa tela de 360dp e 45.8dp numa de 412dp.
 * `mockupWidth` é a largura da tela no mockup de referência (padrão: o da Home).
 */
export function useMockupScale(mockupWidth: number = MOCKUP_SCREEN_WIDTH) {
  const { width } = useWindowDimensions();
  const layoutWidth = Math.min(width, MAX_LAYOUT_WIDTH);
  const factor = layoutWidth / mockupWidth;

  return {
    /** Largura útil do layout (a tela, limitada em tablets) */
    layoutWidth,
    /** dp equivalentes a 1px do mockup */
    factor,
    scale: (mockupPx: number) => mockupPx * factor,
  };
}
