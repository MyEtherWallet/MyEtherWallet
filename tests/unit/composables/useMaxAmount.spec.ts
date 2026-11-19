import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia, defineStore } from 'pinia'
import { ref } from 'vue'
import { WalletType } from '@/providers/types'

// walletStore pulls in the Ledger SDK, which breaks test load under jsdom;
// useMaxAmount only reads the wallet's type.
const current = vi.hoisted(() => ({ type: '' }))
vi.mock('@/stores/walletStore', () => ({
  useWalletStore: defineStore('wallet', () => ({
    wallet: ref({ getWalletType: () => current.type }),
  })),
}))

const { useMaxAmount } = await import('@/composables/useMaxAmount')

const canUseMax = (walletType: WalletType, isNative: boolean) => {
  current.type = walletType
  return useMaxAmount({
    getBalance: () => 0n,
    getDecimals: () => 18,
    getEstimatedFee: () => 0n,
    isNativeToken: () => isNative,
    isTokenSelected: () => true,
    getAmount: () => '',
    onAmountChange: () => {},
    markFormDirty: () => {},
    resetFormPristine: () => {},
    getTokenIdentifier: () => undefined,
    getDependencies: () => [],
  }).canUseMax()
}

describe('useMaxAmount canUseMax (MEW-2612)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('allows MAX on a token with any wallet', () => {
    for (const type of Object.values(WalletType)) {
      expect(canUseMax(type, false)).toBe(true)
    }
  })

  it('allows MAX on the native token only for wallets that sign here', () => {
    // Keystore unlocks into a private key wallet.
    expect(canUseMax(WalletType.PRIVATE_KEY, true)).toBe(true)
    expect(canUseMax(WalletType.MNEMONIC, true)).toBe(true)
    // The rest can change the gas outside the app, so our fee estimate is off.
    for (const type of [
      WalletType.WAGMI,
      WalletType.INJECTED,
      WalletType.LEDGER,
      WalletType.TREZOR,
    ]) {
      expect(canUseMax(type, true)).toBe(false)
    }
  })
})
