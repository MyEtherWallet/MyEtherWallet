import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'

// i18n -> identity so we can assert on the message key directly.
vi.mock('@/i18n', () => ({ default: { global: { t: (k: string) => k } } }))

// ENS resolver is the only network dependency — stub isValidName / resolveName.
const isValidName = vi.fn()
const resolveName = vi.fn()
vi.mock('@/providers/common/nameResolver', () => ({
  default: class {
    isValidName = isValidName
    resolveName = resolveName
  },
}))

// EVM chain, not Bitcoin.
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    isBitcoinChain: { value: false },
    isEvmChain: { value: true },
  }),
}))

// addressUtils reads selectedNetwork from the global store.
vi.mock('@/stores/globalStore', () => ({
  useGlobalStore: () => ({ selectedNetwork: { value: 'ETHEREUM' } }),
}))

// storeToRefs -> identity so the plain store mocks above pass through unchanged.
vi.mock('pinia', async () => {
  const actual = await vi.importActual<typeof import('pinia')>('pinia')
  return { ...actual, storeToRefs: (store: unknown) => store }
})

import { useAddressInput } from '@/composables/useAddressInput'

const ethNetwork = () => ref({ name: 'ETHEREUM', chainID: '1' })

describe('useAddressInput.onInput', () => {
  beforeEach(() => {
    isValidName.mockReset()
    resolveName.mockReset()
  })

  // Regression for APP-MEW-WEB-XW: a name-like but unresolvable input used to
  // hit toChecksumAddress on the raw string and throw an unhandled
  // InvalidAddressError. It must instead surface the "invalid address" message.
  it('does not throw on a name-like unresolvable input and sets the invalid-address error', async () => {
    isValidName.mockReturnValue(true) // looks like a name
    resolveName.mockResolvedValue('') // ...but does not resolve

    const { adrInput, adrError, resolvedAddress, onInput } =
      useAddressInput(ethNetwork())
    adrInput.value = 'siliken.pr'

    await expect(onInput()).resolves.not.toThrow()
    expect(adrError.value).toBe('common.error.invalid_address')
    expect(resolvedAddress.value).toBe('')
  })

  it('still checksums a valid raw address', async () => {
    isValidName.mockReturnValue(false)
    resolveName.mockResolvedValue('')

    const { adrInput, adrError, resolvedAddress, onInput } =
      useAddressInput(ethNetwork())
    adrInput.value = '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed'

    await onInput()
    expect(resolvedAddress.value).toBe(
      '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed',
    )
    expect(adrError.value).toBe('')
  })
})
