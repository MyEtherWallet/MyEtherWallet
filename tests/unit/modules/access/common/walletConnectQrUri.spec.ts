import { describe, it, expect } from 'vitest'
import { buildWalletConnectQrData } from '@/modules/access/common/walletConnectQrUri'
import type { Wallet } from '@rainbow-me/rainbowkit'

const RAW = 'wc:abc123@2?relay-protocol=irn&symKey=deadbeef'
const trustLink = (uri: string) =>
  `https://link.trustwallet.com/wc?uri=${encodeURIComponent(uri)}`

describe('buildWalletConnectQrData (MEW-2288)', () => {
  it('encodes the wallet universal link when the connector exposes one', () => {
    const rkDetails = {
      mobile: { getUri: trustLink },
    } as unknown as Wallet
    expect(buildWalletConnectQrData(rkDetails, RAW)).toBe(trustLink(RAW))
  })

  it('returns the raw wc uri when there is no mobile deep link', () => {
    expect(buildWalletConnectQrData(undefined, RAW)).toBe(RAW)
    expect(buildWalletConnectQrData({} as unknown as Wallet, RAW)).toBe(RAW)
    expect(
      buildWalletConnectQrData({ mobile: {} } as unknown as Wallet, RAW),
    ).toBe(RAW)
  })

  it('falls back to the raw uri when the builder throws or returns empty', () => {
    const throwing = {
      mobile: {
        getUri: () => {
          throw new Error('boom')
        },
      },
    } as unknown as Wallet
    expect(buildWalletConnectQrData(throwing, RAW)).toBe(RAW)

    const empty = { mobile: { getUri: () => '' } } as unknown as Wallet
    expect(buildWalletConnectQrData(empty, RAW)).toBe(RAW)
  })
})
