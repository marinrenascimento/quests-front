type FitFontSizeOptions = {
  text: string;
  /** Caixa disponível para o texto, em dp */
  width: number;
  height: number;
  /** Tamanho desejado e menor tamanho aceito, em dp */
  maxSize: number;
  minSize: number;
  /** Altura da linha em relação ao tamanho da fonte */
  lineHeightRatio: number;
  /** Largura média de um caractere em relação ao tamanho da fonte (estimativa com folga) */
  charWidthRatio: number;
};

/** Passo da redução da fonte, em dp */
const STEP = 0.5;

/** Linhas ocupadas por `words` quebrando por palavra, com `charsPerLine` caracteres por linha. */
function estimateLines(words: string[], charsPerLine: number): number {
  let lines = 1;
  let current = 0;

  for (const word of words) {
    if (current === 0) {
      current = word.length;
    } else if (current + 1 + word.length <= charsPerLine) {
      current += 1 + word.length;
    } else {
      lines += 1;
      current = word.length;
    }
    // Palavra maior que a linha: quebra no meio
    while (current > charsPerLine) {
      lines += 1;
      current -= charsPerLine;
    }
  }

  return lines;
}

/**
 * Maior tamanho de fonte (de `maxSize` até `minSize`) em que o texto cabe, estimado, numa caixa
 * de width x height, simulando a quebra por palavras. Textos curtos ficam no tamanho desejado;
 * os longos diminuem só o necessário. É uma estimativa: use junto com numberOfLines e
 * adjustsFontSizeToFit, que garantem o limite se a fonte real for mais larga que o previsto.
 */
export function fitFontSize({
  text,
  width,
  height,
  maxSize,
  minSize,
  lineHeightRatio,
  charWidthRatio,
}: FitFontSizeOptions): number {
  const words = text.split(/\s+/).filter(Boolean);

  for (let size = maxSize; size > minSize; size -= STEP) {
    const charsPerLine = Math.max(1, Math.floor(width / (size * charWidthRatio)));
    if (estimateLines(words, charsPerLine) * size * lineHeightRatio <= height) {
      return size;
    }
  }

  return minSize;
}
