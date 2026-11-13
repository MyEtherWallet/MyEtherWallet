import { describe, it, expect } from 'vitest'
import { buildWalletConnectQrData } from '@/modules/access/common/walletConnectQrUri'
import type { Wallet } from '@rainbow-me/rainbowkit'

const RAW = 'wc:abc123@2?relay-protocol=irn&symKey=deadbeef'
const ENCODED = 'wc%3Aabc123%402%3Frelay-protocol%3Dirn%26symKey%3Ddeadbeef'
const universalLink = (uri: string) =>
  `https://rnbwapp.com/wc?uri=${encodeURIComponent(uri)}`
const sameDeviceLink = (uri: string) =>
  `trust://wc?uri=${encodeURIComponent(uri)}`

describe('buildWalletConnectQrData (MEW-2288)', () => {
  it('encodes the link the wallet defines for its QR code', () => {
    const rkDetails = {
      qrCode: { getUri: universalLink },
    } as unknown as Wallet
    expect(buildWalletConnectQrData(rkDetails, RAW)).toBe(
      `https://rnbwapp.com/wc?uri=${ENCODED}`,
    )
  })

  it('never encodes the same-device deep link', () => {
    const rawQrCode = {
      mobile: { getUri: sameDeviceLink },
      qrCode: { getUri: (uri: string) => uri },
    } as unknown as Wallet
    expect(buildWalletConnectQrData(rawQrCode, RAW)).toBe(RAW)

    const noQrCode = { mobile: { getUri: sameDeviceLink } } as unknown as Wallet
    expect(buildWalletConnectQrData(noQrCode, RAW)).toBe(RAW)
  })

  it('returns the raw wc uri when the wallet defines no QR link', () => {
    expect(buildWalletConnectQrData(undefined, RAW)).toBe(RAW)
    expect(buildWalletConnectQrData({} as unknown as Wallet, RAW)).toBe(RAW)
    expect(
      buildWalletConnectQrData({ qrCode: {} } as unknown as Wallet, RAW),
    ).toBe(RAW)
  })

  it('falls back to the raw uri when the builder throws or returns empty', () => {
    const throwing = {
      qrCode: {
        getUri: () => {
          throw new Error('boom')
        },
      },
    } as unknown as Wallet
    expect(buildWalletConnectQrData(throwing, RAW)).toBe(RAW)

    const empty = { qrCode: { getUri: () => '' } } as unknown as Wallet
    expect(buildWalletConnectQrData(empty, RAW)).toBe(RAW)
  })
})
