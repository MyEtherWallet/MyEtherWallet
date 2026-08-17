import { describe, it, expect, vi } from 'vitest'

// The provider import graph pulls in @enkryptcom/hw-wallets, whose compiled code
// imports a @ledgerhq/hw-app-eth path Vitest's resolver can't find in the local
// pnpm store (Vite/dev resolves it fine). Stub it so the wallet classes load.
vi.mock('@enkryptcom/hw-wallets', () => ({ default: class {} }))

import Web3InjectedWallet from '@/providers/ethereum/web3InjectedWallet'
import UnisatInjectWallet from '@/providers/bitcoin/unisatInjectedWallet'

describe('getLiveAddress — injected wallets', () => {
  it('EVM returns the first eth_accounts entry', async () => {
    const request = vi.fn().mockResolvedValue(['0xAbC', '0xDeF'])
    const w = new Web3InjectedWallet({ provider: { request } } as never, '1')
    expect(await w.getLiveAddress()).toBe('0xAbC')
    expect(request).toHaveBeenCalledWith({ method: 'eth_accounts' })
  })

  it('EVM returns null when no accounts / on error', async () => {
    const empty = new Web3InjectedWallet(
      { provider: { request: vi.fn().mockResolvedValue([]) } } as never,
      '1',
    )
    expect(await empty.getLiveAddress()).toBeNull()
    const throwing = new Web3InjectedWallet(
      {
        provider: { request: vi.fn().mockRejectedValue(new Error('locked')) },
      } as never,
      '1',
    )
    expect(await throwing.getLiveAddress()).toBeNull()
  })

  it('BTC returns the first getAccounts entry (Unisat/Enkrypt)', async () => {
    const getAccounts = vi.fn().mockResolvedValue(['bc1qaaa', 'bc1qbbb'])
    const w = new UnisatInjectWallet({ getAccounts } as never, 'BITCOIN')
    expect(await w.getLiveAddress()).toBe('bc1qaaa')
  })

  it('BTC returns null when empty / on error', async () => {
    const empty = new UnisatInjectWallet(
      { getAccounts: vi.fn().mockResolvedValue([]) } as never,
      'BITCOIN',
    )
    expect(await empty.getLiveAddress()).toBeNull()
    const throwing = new UnisatInjectWallet(
      { getAccounts: vi.fn().mockRejectedValue(new Error('x')) } as never,
      'BITCOIN',
    )
    expect(await throwing.getLiveAddress()).toBeNull()
  })
})
