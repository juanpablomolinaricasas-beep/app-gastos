/** Formats amounts like the design: "." as thousands separator, "," as decimals (e.g. "1.300" or "18,50"). */
export function formatMoney(amount: number, decimals?: number): string {
  const d = decimals ?? (Number.isInteger(amount) ? 0 : 2);
  const [intPart, decPart] = Math.abs(amount).toFixed(d).split('.');
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = amount < 0 ? '-' : '';
  return decPart ? `${sign}${withThousands},${decPart}` : `${sign}${withThousands}`;
}
