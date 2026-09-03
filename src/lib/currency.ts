import type { Currency } from '../types'

/**
 * Presentation metadata for each compensation currency.
 *
 * The `symbol` is a deliberately non-ASCII glyph drawn from currency-adjacent
 * Unicode (–₤, ⱽ, ₥, §, ◈, ⦻) to give the "Compensation Portfolio" in the
 * header the look of a real, sealed financial instrument. The colors are the
 * six recurring state hues used across the interface.
 */
export const CURRENCIES: Record<Currency, { symbol: string; color: string }> = {
  LUNR: { symbol: '₤', color: '#a78bfa' },
  VANT: { symbol: 'ⱽ', color: '#f59e0b' },
  MIRE: { symbol: '₥', color: '#10b981' },
  SCRIP: { symbol: '§', color: '#ec4899' },
  WITNESS: { symbol: '◈', color: '#ef4444' },
  ECHO: { symbol: '⦻', color: '#00ff88' },
}

/**
 * Conversion rates into "standard units" — the single valuation axis used to
 * report the worker's total compensation portfolio. These are authored values
 * (part of the fiction), not market data.
 */
export const EXCHANGE_RATES: Record<Currency, number> = {
  LUNR: 1,
  VANT: 1.3,
  MIRE: 0.8,
  SCRIP: 0.3,
  WITNESS: 5,
  ECHO: 0.01,
}

/**
 * Sum a `{ [currency]: amount }` balance into a single "standard unit" figure.
 * Kept pure (no React) so it can be unit-tested.
 */
export function computeTotalValuation(
  balances: Record<Currency, number>,
): number {
  return Object.entries(balances).reduce((sum, [curr, amount]) => {
    return sum + amount * EXCHANGE_RATES[curr as Currency]
  }, 0)
}

/**
 * Format a single currency balance for the header. WITNESS is shown as a whole
 * number; every other currency keeps two decimals, which is how the interface
 * originally presented them.
 */
export function formatBalance(amount: number, currency: Currency): string {
  const decimals = currency === 'WITNESS' ? 0 : 2
  return amount.toFixed(decimals)
}
