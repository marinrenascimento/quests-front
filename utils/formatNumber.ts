/**
 * Formata um número inteiro com ponto como separador de milhar (padrão pt-BR),
 * sem depender de Intl. Ex.: 10000 -> "10.000", -1234567 -> "-1.234.567".
 * Casas decimais são descartadas.
 */
export function formatThousands(value: number): string {
  if (!Number.isFinite(value)) {
    return '0';
  }

  const sign = value < 0 ? '-' : '';
  const digits = String(Math.trunc(Math.abs(value)));

  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
