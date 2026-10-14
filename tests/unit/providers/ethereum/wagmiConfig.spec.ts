import { describe, it, expect } from 'vitest'
import * as rainbowWallets from '@rainbow-me/rainbowkit/wallets'
import { generateConfig } from '@/providers/ethereum/wagmiConfig'
import type { Chain } from '@/mew_api/types'

// Regression for Sentry APP-MEW-WEB-1C0 (MEW-2303): the RainbowKit "Base Account"
// wallet crashes with a TDZ ReferenceError inside @base-org/account when its
// connector's getProvider() runs, so it must not be offered.
describe('wagmiConfig — Base Account wallet removed', () => {
  it('the removed-id string still matches the RainbowKit wallet function name', () => {
    // The filter in wagmiConfig matches on `wallet.name` (the factory fn name).
    // If RainbowKit renames this export the removal would silently no-op.
    expect(rainbowWallets.baseAccount.name).toBe('baseAccount')
  })

  it('does not register a baseAccount connector but keeps working wallets', () => {
    const config = generateConfig([{ chainID: '1' }] as unknown as Chain[])
    const ids = config.connectors.map(c => c.id)
    expect(ids).not.toContain('baseAccount')
    // Guard against a vacuous pass if the whole wallet list ever breaks.
    expect(ids).toContain('walletConnect')
  })
})
