import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { HWwalletType, NetworkNames } from '@enkryptcom/types'

/**
 * Regression tests for MEW-2042.
 *
 * We mock the underlying `@enkryptcom/hw-wallets` manager so the wrapper's
 * init-once + uninitialized-getAddress guards can be exercised in isolation
 * (the real manager lazily imports `@trezor/connect-web` and talks to a device).
 * The fake base class exposes `isConnected` / `getAddress` on its prototype so
 * the wrapper's `super.*` calls resolve to them, and a public `providers` map
 * matching the real manager.
 */
const { fakeIsConnected, fakeGetAddress } = vi.hoisted(() => ({
  fakeIsConnected: vi.fn(),
  fakeGetAddress: vi.fn(),
}))

vi.mock('@enkryptcom/hw-wallets', () => {
  class FakeHWwalletManager {
    providers: Record<string, unknown> = {}
    isConnected(options: unknown): Promise<boolean> {
      return fakeIsConnected(options)
    }
    getAddress(options: unknown): Promise<unknown> {
      return fakeGetAddress(options)
    }
  }
  return { default: FakeHWwalletManager }
})

// Imported after the mock is registered (vi.mock is hoisted above imports).
import {
  TrezorManager,
  getTrezorManager,
  resetTrezorManager,
  isTrezorAlreadyInitializedError,
} from '@/providers/hw/trezorManager'

const TREZOR = 'trezor' as HWwalletType
const ETH = 'ETH' as NetworkNames
const MATIC = 'MATIC' as NetworkNames

const addressResponse = { address: '0xabc', publicKey: '0x01' }
const getAddressOptions = {
  confirmAddress: false,
  networkName: ETH,
  pathType: { path: "m/44'/60'/0'/0/{index}", basePath: "m/44'/60'/0'/0" },
  pathIndex: '0',
  wallet: TREZOR,
}

const ALREADY_INITIALIZED = 'TrezorConnect has been already initialized'

beforeEach(() => {
  fakeIsConnected.mockReset()
  fakeGetAddress.mockReset()
  resetTrezorManager()
})

describe('isTrezorAlreadyInitializedError', () => {
  it('matches the Trezor re-init error message (case-insensitive)', () => {
    expect(
      isTrezorAlreadyInitializedError(new Error(ALREADY_INITIALIZED)),
    ).toBe(true)
    expect(
      isTrezorAlreadyInitializedError(new Error('Already Initialized')),
    ).toBe(true)
  })

  it('does not match unrelated errors or non-error inputs', () => {
    expect(
      isTrezorAlreadyInitializedError(new Error('device disconnected')),
    ).toBe(false)
    expect(isTrezorAlreadyInitializedError(null)).toBe(false)
    expect(isTrezorAlreadyInitializedError(undefined)).toBe(false)
  })
})

describe('getTrezorManager', () => {
  it('returns the same instance across calls (init runs once)', () => {
    const a = getTrezorManager()
    const b = getTrezorManager()
    expect(a).toBe(b)
  })

  it('creates a fresh instance after reset', () => {
    const a = getTrezorManager()
    resetTrezorManager()
    const b = getTrezorManager()
    expect(a).not.toBe(b)
  })
})

describe('TrezorManager.init', () => {
  it('initializes only once when called twice (2nd is a no-op success)', async () => {
    fakeIsConnected.mockResolvedValue(true)
    const manager = new TrezorManager()

    await expect(manager.init(TREZOR, ETH)).resolves.toBe(true)
    await expect(manager.init(TREZOR, ETH)).resolves.toBe(true)

    expect(fakeIsConnected).toHaveBeenCalledTimes(1)
  })

  it('treats "already initialized" as a successful init instead of throwing', async () => {
    fakeIsConnected.mockRejectedValueOnce(new Error(ALREADY_INITIALIZED))
    const manager = new TrezorManager()

    await expect(manager.init(TREZOR, ETH)).resolves.toBe(true)
  })

  it('rethrows genuine (non re-init) failures and allows a retry', async () => {
    fakeIsConnected
      .mockRejectedValueOnce(new Error('device disconnected'))
      .mockResolvedValueOnce(true)
    const manager = new TrezorManager()

    await expect(manager.init(TREZOR, ETH)).rejects.toThrow(
      'device disconnected',
    )
    // The failed init must not be memoized — a retry should re-run isConnected.
    await expect(manager.init(TREZOR, ETH)).resolves.toBe(true)
    expect(fakeIsConnected).toHaveBeenCalledTimes(2)
  })
})

describe('TrezorManager.getAddress', () => {
  it('drives init before delegating when not initialized (guarded, no undefined deref)', async () => {
    fakeIsConnected.mockResolvedValue(true)
    fakeGetAddress.mockResolvedValue(addressResponse)
    const manager = new TrezorManager()

    const result = await manager.getAddress(getAddressOptions)

    expect(result).toEqual(addressResponse)
    expect(fakeIsConnected).toHaveBeenCalledTimes(1)
    expect(fakeGetAddress).toHaveBeenCalledTimes(1)
  })

  it('drops a poisoned provider (TrezorConnect unset) so it never derefs undefined', async () => {
    fakeIsConnected.mockResolvedValue(true)
    fakeGetAddress.mockResolvedValue(addressResponse)
    const manager = new TrezorManager()
    // Simulate the library caching a provider whose init failed.
    ;(manager.providers as Record<string, unknown>)[ETH] = {
      TrezorConnect: undefined,
    }

    const result = await manager.getAddress(getAddressOptions)

    expect(result).toEqual(addressResponse)
    // No healthy sibling to repair from -> the poisoned entry is dropped.
    expect((manager.providers as Record<string, unknown>)[ETH]).toBeUndefined()
  })

  it('repairs a poisoned provider by reusing a healthy sibling TrezorConnect', async () => {
    fakeIsConnected.mockResolvedValue(true)
    fakeGetAddress.mockResolvedValue(addressResponse)
    const manager = new TrezorManager()
    const healthyTrezorConnect = { ethereumGetPublicKey: vi.fn() }
    const providers = manager.providers as Record<string, unknown>
    providers[ETH] = { TrezorConnect: healthyTrezorConnect }
    providers[MATIC] = { TrezorConnect: undefined }

    await manager.getAddress({ ...getAddressOptions, networkName: MATIC })

    // The poisoned MATIC provider is repaired, not dropped.
    expect((providers[MATIC] as { TrezorConnect: unknown }).TrezorConnect).toBe(
      healthyTrezorConnect,
    )
  })

  it('recovers when getAddress itself throws "already initialized" and retries', async () => {
    fakeIsConnected.mockResolvedValue(true)
    const manager = new TrezorManager()
    const healthyTrezorConnect = { ethereumGetPublicKey: vi.fn() }
    const providers = manager.providers as Record<string, unknown>
    providers[ETH] = { TrezorConnect: healthyTrezorConnect }

    fakeGetAddress
      .mockRejectedValueOnce(new Error(ALREADY_INITIALIZED))
      .mockResolvedValueOnce(addressResponse)

    const result = await manager.getAddress(getAddressOptions)

    expect(result).toEqual(addressResponse)
    expect(fakeGetAddress).toHaveBeenCalledTimes(2)
  })
})
