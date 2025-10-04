export const PRICE_PER_DAY = {
  L: 0.5,   // Large: 0.5 WLD/day
  M: 0.1,   // Medium: 0.1 WLD/day
  S: 0.05,  // Small: 0.05 WLD/day
} as const;

export function calcPrice(size: 'L' | 'M' | 'S', days: number): number {
  return +(PRICE_PER_DAY[size] * days).toFixed(2);
}

export const TEXT_LIMITS = {
  S: 8,
  M: 14,
  L: 20,
} as const;
