export function formatCurrency(amount: number): string {
  if (amount < 10000) {
    return `$${amount.toLocaleString()}`;
  } else if (amount < 1000000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  } else if (amount < 1000000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  }
}
