import { describe, it, expect, vi } from 'vitest'
import type { PublicClient } from 'viem'
import { Web3ProviderConnector } from '@/modules/trade/providers/oneinch_fusion/oneInchProvider'
import type { WalletInterface } from '@/providers/common/walletInterface'
import { AbandonedSignError } from '@/utils/signSession'

const TYPED_DATA = { primaryType: 'Order' } as never
const client = {} as PublicClient

const makeWallet = (SignTypedMessage: unknown) =>
  ({ SignTypedMessage }) as unknown as WalletInterface

describe('Web3ProviderConnector.signTypedData', () => {
  it('hands the wallet signature to the SDK', async () => {
    const connector = new Web3ProviderConnector(
      makeWallet(vi.fn(async () => '0xsig')),
      client,
    )

    await expect(connector.signTypedData('0xuser', TYPED_DATA)).resolves.toBe(
      '0xsig',
    )
  })

  // The SDK posts the order to the relayer as soon as the signature resolves,
  // so this is the only place a late one can be stopped.
  it('withholds a signature given after its modal was closed (MEW-2694)', async () => {
    let abandoned = false
    const connector = new Web3ProviderConnector(
      makeWallet(
        vi.fn(async () => {
          abandoned = true
          return '0xsig'
        }),
      ),
      client,
      () => abandoned,
    )

    await expect(
      connector.signTypedData('0xuser', TYPED_DATA),
    ).rejects.toBeInstanceOf(AbandonedSignError)
  })

  it('rejects when the wallet cannot sign typed messages', async () => {
    const connector = new Web3ProviderConnector(makeWallet(undefined), client)

    await expect(connector.signTypedData('0xuser', TYPED_DATA)).rejects.toThrow(
      'cannot sign typed messages',
    )
  })
})
