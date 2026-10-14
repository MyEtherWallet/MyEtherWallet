import { describe, it, expect, vi, beforeEach } from 'vitest'

const walletState = {
  wallet: null as { getLiveAddress?: () => Promise<string | null> } | null,
  walletAddress: '0xConnected' as string | null,
  setDetectedAddress: vi.fn(),
  clearDetectedAddress: vi.fn(),
}
const chainState = { selectedChain: { type: 'EVM' } as { type: string } | undefined }
const watchOnlyState = {
  watchOnlyAddresses: {} as Record<string, { address: string }[]>,
}

vi.mock('@/stores/walletStore', () => ({ useWalletStore: () => walletState }))
vi.mock('@/stores/chainsStore', () => ({
  useChainsStore: () => ({
    get selectedChain() {
      return chainState.selectedChain
    },
  }),
}))
vi.mock('@/stores/watchOnlyStore', () => ({
  useWatchOnlyStore: () => watchOnlyState,
}))

import {
  nextDetectedAddress,
  useDetectedAddress,
} from '@/composables/useDetectedAddress'

const isSavedFalse = () => false

describe('nextDetectedAddress', () => {
  it('returns the live address when it differs and is unsaved', () => {
    expect(
      nextDetectedAddress({
        live: '0xNew',
        connected: '0xConnected',
        isSaved: isSavedFalse,
      }),
    ).toBe('0xNew')
  })
  it('returns null when live equals connected (case-insensitive)', () => {
    expect(
      nextDetectedAddress({
        live: '0xabc',
        connected: '0xABC',
        isSaved: isSavedFalse,
      }),
    ).toBeNull()
  })
  it('returns null when live is null', () => {
    expect(
      nextDetectedAddress({
        live: null,
        connected: '0xABC',
        isSaved: isSavedFalse,
      }),
    ).toBeNull()
  })
  it('returns null when live is already saved', () => {
    expect(
      nextDetectedAddress({
        live: '0xNew',
        connected: '0xConnected',
        isSaved: () => true,
      }),
    ).toBeNull()
  })
})

describe('useDetectedAddress().refreshDetectedAddress', () => {
  beforeEach(() => {
    walletState.setDetectedAddress.mockClear()
    walletState.clearDetectedAddress.mockClear()
    walletState.walletAddress = '0xConnected'
    walletState.wallet = null
    chainState.selectedChain = { type: 'EVM' }
    watchOnlyState.watchOnlyAddresses = {}
  })

  it('sets the detected address for a different, unsaved live address', async () => {
    walletState.wallet = { getLiveAddress: vi.fn().mockResolvedValue('0xNew') }
    await useDetectedAddress().refreshDetectedAddress()
    expect(walletState.setDetectedAddress).toHaveBeenCalledWith('0xNew')
  })

  it('clears when the live address equals the connected one', async () => {
    walletState.wallet = {
      getLiveAddress: vi.fn().mockResolvedValue('0xConnected'),
    }
    await useDetectedAddress().refreshDetectedAddress()
    expect(walletState.clearDetectedAddress).toHaveBeenCalled()
    expect(walletState.setDetectedAddress).not.toHaveBeenCalled()
  })

  it('clears when the live address is already saved', async () => {
    walletState.wallet = { getLiveAddress: vi.fn().mockResolvedValue('0xSaved') }
    watchOnlyState.watchOnlyAddresses = { EVM: [{ address: '0xsaved' }] }
    await useDetectedAddress().refreshDetectedAddress()
    expect(walletState.clearDetectedAddress).toHaveBeenCalled()
    expect(walletState.setDetectedAddress).not.toHaveBeenCalled()
  })

  it('no-ops when the wallet has no getLiveAddress', async () => {
    walletState.wallet = {}
    await useDetectedAddress().refreshDetectedAddress()
    expect(walletState.setDetectedAddress).not.toHaveBeenCalled()
    expect(walletState.clearDetectedAddress).not.toHaveBeenCalled()
  })
})
