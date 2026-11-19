import { describe, expect, it, vi } from 'vitest'

// The wallet configs reach the hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/modules/access/common/walletConfigs', () => ({}))

import { addressStepFor } from '@/modules/access/common/accessViews'
import { WalletType } from '@/providers/types'

describe('addressStepFor', () => {
  it('names the step where a hardware or phrase wallet picks another address', () => {
    expect(addressStepFor(WalletType.LEDGER)).toBe('ledger')
    expect(addressStepFor(WalletType.TREZOR)).toBe('trezor')
    expect(addressStepFor(WalletType.MNEMONIC)).toBe('mnemonic')
  })

  it('has none for a wallet with a single address, or for no wallet', () => {
    expect(addressStepFor(WalletType.PRIVATE_KEY)).toBeNull()
    expect(addressStepFor(WalletType.PRIVY)).toBeNull()
    expect(addressStepFor(undefined)).toBeNull()
  })
})
