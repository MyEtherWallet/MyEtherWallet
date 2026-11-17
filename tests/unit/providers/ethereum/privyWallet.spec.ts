import { describe, expect, it, vi } from 'vitest'

// Importing a wallet transitively pulls in the store layer, which reaches the
// analytics module and its hardware-wallet SDK — unavailable under jsdom.
vi.mock('@/analytics', () => ({ analytics: {} }))

import PrivyWallet from '@/providers/ethereum/privyWallet'
import { WalletType } from '@/providers/types'

const ADDRESS = '0x1111111111111111111111111111111111111111'

const build = (
  overrides: {
    request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>
    logout?: () => Promise<void>
  } = {},
) => {
  const request = vi.fn(overrides.request ?? (async () => null))
  const logout = vi.fn(overrides.logout ?? (async () => undefined))
  const wallet = new PrivyWallet({
    provider: { request },
    address: ADDRESS,
    chainId: '1',
    logout,
  })
  return { wallet, request, logout }
}

describe('PrivyWallet', () => {
  it('reports the embedded wallet address and the Privy wallet type', async () => {
    const { wallet } = build()

    expect(await wallet.getAddress()).toBe(ADDRESS)
    expect(wallet.getWalletType()).toBe(WalletType.PRIVY)
  })

  it('logs out of Privy when disconnected', async () => {
    const { wallet, logout } = build()

    expect(await wallet.disconnect()).toBe(true)
    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('resolves false instead of rejecting when the logout fails', async () => {
    const { wallet } = build({
      logout: async () => {
        throw new Error('offline')
      },
    })

    await expect(wallet.disconnect()).resolves.toBe(false)
  })

  it('signs a message through the embedded wallet provider', async () => {
    const { wallet, request } = build({ request: async () => '0xsigned' })

    expect(await wallet.SignMessage({ message: 'hello' })).toBe('0xsigned')
    expect(request).toHaveBeenCalledWith({
      method: 'personal_sign',
      params: ['hello', ADDRESS],
    })
  })

  it('signs typed data through the embedded wallet provider', async () => {
    const { wallet, request } = build({ request: async () => '0xtyped' })
    const typedData = {
      primaryType: 'Order',
      domain: {},
      types: {},
      message: {},
    }

    expect(await wallet.SignTypedMessage(typedData as never)).toBe('0xtyped')
    expect(request).toHaveBeenCalledWith({
      method: 'eth_signTypedData_v4',
      params: [ADDRESS, JSON.stringify(typedData)],
    })
  })

  it('switches the embedded wallet to a new chain', async () => {
    const { wallet, request } = build()

    expect(await wallet.changeNetwork(137)).toBe(true)
    expect(request).toHaveBeenCalledWith({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x89' }],
    })
    expect(wallet.chainId).toBe('137')
  })

  it('does not ask the provider to switch to the chain it is already on', async () => {
    const { wallet, request } = build()

    expect(await wallet.changeNetwork(1)).toBe(true)
    expect(request).not.toHaveBeenCalled()
  })

  it('reports a failed chain switch and keeps its chain', async () => {
    const { wallet } = build({
      request: async () => {
        throw new Error('chain_not_supported')
      },
    })

    expect(await wallet.changeNetwork(137)).toBe(false)
    expect(wallet.chainId).toBe('1')
  })
})
