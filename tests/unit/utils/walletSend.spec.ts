import { describe, it, expect, vi } from 'vitest'

// `walletUtils` reaches i18n and the wallet configs, which load Ledger.
vi.mock('@/modules/access/common/walletConfigs', () => ({
  WalletConfigType: {},
}))

import {
  sendFromWallet,
  signForSend,
  signsWithoutSending,
} from '@/utils/walletSend'
import { AbandonedSignError } from '@/utils/signSession'
import { WalletType } from '@/providers/types'
import type { WalletInterface } from '@/providers/common/walletInterface'

const TX = '0x02f0' as const

// The wallet (a device, a phone) holds the request until the user acts on it.
const deferred = <T>() => {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

const makeWallet = (
  type: WalletType,
  over: Record<string, unknown> = {},
): WalletInterface & Record<string, ReturnType<typeof vi.fn>> =>
  ({
    getWalletType: () => type,
    SignTransaction: vi.fn(async () => ({ signed: '0xsigned' })),
    SendTransaction: vi.fn(async () => '0xsent-by-wallet'),
    broadcastTransaction: vi.fn(async () => '0xsent-by-mew'),
    ...over,
  }) as never

// A WalletConnect wallet whose session offers the sign-only call.
const walletConnect = (over: Record<string, unknown> = {}) =>
  makeWallet(WalletType.WAGMI, {
    canSignWithoutSending: vi.fn(async () => true),
    ...over,
  })

describe('sendFromWallet — who broadcasts', () => {
  it('broadcasts a hardware wallet signature from MEW', async () => {
    const wallet = makeWallet(WalletType.LEDGER)

    await expect(sendFromWallet(wallet, TX)).resolves.toBe('0xsent-by-mew')
    expect(wallet.broadcastTransaction).toHaveBeenCalledWith('0xsigned')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })

  it('broadcasts from MEW when a WalletConnect wallet can sign without sending', async () => {
    const wallet = walletConnect()

    await expect(sendFromWallet(wallet, TX)).resolves.toBe('0xsent-by-mew')
    expect(wallet.SignTransaction).toHaveBeenCalledWith(TX)
    expect(wallet.broadcastTransaction).toHaveBeenCalledWith('0xsigned')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })

  it('lets the wallet sign and broadcast when it cannot sign alone', async () => {
    const wallet = makeWallet(WalletType.WAGMI)

    await expect(sendFromWallet(wallet, TX)).resolves.toBe('0xsent-by-wallet')
    expect(wallet.SignTransaction).not.toHaveBeenCalled()
    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()
  })

  it('hands the signature to a custom broadcast', async () => {
    const wallet = walletConnect()
    const broadcast = vi.fn(async () => '0xsent-by-node')

    await expect(sendFromWallet(wallet, TX, { broadcast })).resolves.toBe(
      '0xsent-by-node',
    )
    expect(broadcast).toHaveBeenCalledWith('0xsigned')
    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()
  })

  it('reports which wallets hand the signature back', async () => {
    expect(await signsWithoutSending(makeWallet(WalletType.TREZOR))).toBe(true)
    expect(await signsWithoutSending(walletConnect())).toBe(true)
    expect(await signsWithoutSending(makeWallet(WalletType.WAGMI))).toBe(false)
    expect(await signsWithoutSending(makeWallet(WalletType.INJECTED))).toBe(
      false,
    )
  })
})

describe('sendFromWallet — a request abandoned while the wallet held it (MEW-2694)', () => {
  it('never broadcasts a signature a WalletConnect wallet gives after the close', async () => {
    const phone = deferred<{ signed: string }>()
    const wallet = walletConnect({
      SignTransaction: vi.fn(() => phone.promise),
    })
    let abandoned = false

    const sending = sendFromWallet(wallet, TX, { isAbandoned: () => abandoned })
    await vi.waitFor(() => expect(wallet.SignTransaction).toHaveBeenCalled())
    abandoned = true // the modal was closed
    phone.resolve({ signed: '0xsigned' }) // then the user signed on the phone

    await expect(sending).rejects.toBeInstanceOf(AbandonedSignError)
    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })

  it('never broadcasts a signature a hardware wallet gives after the close', async () => {
    const device = deferred<{ signed: string }>()
    const wallet = makeWallet(WalletType.LEDGER, {
      SignTransaction: vi.fn(() => device.promise),
    })
    let abandoned = false

    const sending = sendFromWallet(wallet, TX, { isAbandoned: () => abandoned })
    await vi.waitFor(() => expect(wallet.SignTransaction).toHaveBeenCalled())
    abandoned = true
    device.resolve({ signed: '0xsigned' })

    await expect(sending).rejects.toBeInstanceOf(AbandonedSignError)
    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()
  })

  it('does not ask the wallet another way once the request is closed', async () => {
    const phone = deferred<{ signed: string }>()
    const wallet = walletConnect({
      SignTransaction: vi.fn(() => phone.promise),
    })
    let abandoned = false

    const sending = sendFromWallet(wallet, TX, { isAbandoned: () => abandoned })
    await vi.waitFor(() => expect(wallet.SignTransaction).toHaveBeenCalled())
    abandoned = true
    phone.reject(new Error('Method not found'))

    await expect(sending).rejects.toThrow('Method not found')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })
})

describe('sendFromWallet — a wallet that lists the sign-only call but will not do it', () => {
  const refusing = (error: unknown) =>
    walletConnect({ SignTransaction: vi.fn(async () => Promise.reject(error)) })

  it.each([
    ['EIP-1193 unsupported method', { code: 4200, message: 'Unsupported' }],
    ['JSON-RPC method not found', { code: -32601, message: 'Not found' }],
    [
      'WalletConnect "User rejected methods"',
      { code: 5002, message: 'User rejected methods.' },
    ],
    [
      'a refusal nested under a viem error',
      { message: 'Request failed', cause: { code: -32004 } },
    ],
    ['an error it cannot place', new Error('Internal error')],
  ])('sends the usual way after %s', async (_name, error) => {
    const wallet = refusing(error)

    await expect(sendFromWallet(wallet, TX)).resolves.toBe('0xsent-by-wallet')
    expect(wallet.SendTransaction).toHaveBeenCalledWith(TX)
    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()
  })

  it('takes a real rejection as the answer and does not prompt again', async () => {
    const wallet = refusing(
      Object.assign(new Error('User rejected the request.'), { code: 4001 }),
    )

    await expect(sendFromWallet(wallet, TX)).rejects.toMatchObject({
      code: 4001,
    })
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })

  it('does not prompt again after the request timed out in the wallet', async () => {
    const wallet = refusing(new Error('Request expired. Please try again.'))

    await expect(sendFromWallet(wallet, TX)).rejects.toThrow('Request expired')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })
})

describe('signForSend — the two halves', () => {
  it('asks a signing wallet in the first half and only broadcasts in the second', async () => {
    const wallet = walletConnect()

    const send = await signForSend(wallet, TX)
    expect(wallet.SignTransaction).toHaveBeenCalledOnce()
    expect(wallet.broadcastTransaction).not.toHaveBeenCalled()

    await expect(send()).resolves.toBe('0xsent-by-mew')
  })

  it('leaves the prompt of a self-broadcasting wallet to the second half', async () => {
    const wallet = makeWallet(WalletType.INJECTED)

    const send = await signForSend(wallet, TX)
    expect(wallet.SendTransaction).not.toHaveBeenCalled()

    await expect(send()).resolves.toBe('0xsent-by-wallet')
  })

  it('does not fall back to the wallet when MEW fails to broadcast', async () => {
    // Already signed: asking again could send it twice.
    const wallet = walletConnect({
      broadcastTransaction: vi.fn(async () =>
        Promise.reject(new Error('nonce too low')),
      ),
    })

    await expect(sendFromWallet(wallet, TX)).rejects.toThrow('nonce too low')
    expect(wallet.SendTransaction).not.toHaveBeenCalled()
  })
})
