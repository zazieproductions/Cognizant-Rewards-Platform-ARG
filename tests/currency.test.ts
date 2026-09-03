import { describe, it, expect } from 'vitest'
import { computeTotalValuation, formatBalance, CURRENCIES, EXCHANGE_RATES } from '../src/lib/currency'
import type { Currency } from '../src/types'

describe('currency', () => {
  it('defines a symbol and color for every currency', () => {
    const currencies: Currency[] = ['LUNR', 'VANT', 'MIRE', 'SCRIP', 'WITNESS', 'ECHO']
    for (const c of currencies) {
      expect(CURRENCIES[c].symbol).toBeTruthy()
      expect(CURRENCIES[c].color).toMatch(/^#/)
    }
  })

  it('computes the starting portfolio to 551.66 standard units', () => {
    const start = { LUNR: 144.7, VANT: 23.0, MIRE: 0, SCRIP: 892.11, WITNESS: 7, ECHO: 7443.19 }
    expect(computeTotalValuation(start)).toBeCloseTo(551.6649, 4)
    expect(computeTotalValuation(start).toFixed(2)).toBe('551.66')
  })

  it('formats WITNESS as a whole number and other currencies with two decimals', () => {
    expect(formatBalance(7, 'WITNESS')).toBe('7')
    expect(formatBalance(1234.5, 'LUNR')).toBe('1234.50')
    expect(formatBalance(0, 'SCRIP')).toBe('0.00')
  })

  it('keeps exchange rates for the fictional commodities', () => {
    expect(EXCHANGE_RATES).toMatchObject({ WITNESS: 5, ECHO: 0.01, LUNR: 1 })
  })
})
