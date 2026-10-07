import { describe, it, expect } from 'vitest'
import { getTokenDisplayName } from '@/utils/tokenDisplayName'

describe('getTokenDisplayName', () => {
  it('prefers the stock alias for tokenized stocks', () => {
    expect(
      getTokenDisplayName({
        name: 'MercadoLibre (Ondo Tokenized Stock)',
        ondo: { stockAlias: 'MercadoLibre' },
      }),
    ).toBe('MercadoLibre')
  })

  it('falls back to the token name without an alias', () => {
    expect(getTokenDisplayName({ name: 'Chainlink' })).toBe('Chainlink')
    expect(getTokenDisplayName({ name: 'Chainlink', ondo: null })).toBe(
      'Chainlink',
    )
    expect(
      getTokenDisplayName({ name: 'Chainlink', ondo: { stockAlias: '' } }),
    ).toBe('Chainlink')
  })
})
