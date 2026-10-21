/**
 * Formata horas com o número de casas decimais pedido e o sufixo "h", com ponto decimal como
 * nos mockups. Ex.: formatHours(2.5) -> "2.5h", formatHours(4) -> "4.0h", formatHours(80, 0) -> "80h".
 */
export function formatHours(value: number, decimals: number = 1): string {
  if (!Number.isFinite(value)) {
    return `${(0).toFixed(decimals)}h`;
  }

  return `${value.toFixed(decimals)}h`;
}
