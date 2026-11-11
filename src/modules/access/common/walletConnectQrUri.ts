import type { Wallet } from '@rainbow-me/rainbowkit'

/**
 * Resolve the string encoded into the WalletConnect QR code.
 *
 * The wagmi `display_uri` event yields a generic `wc:` URI. Scanned with a
 * phone's native camera it resolves to whichever wallet the OS registered as
 * the `wc:` handler (often the wrong one, e.g. Rainbow), not the wallet named
 * in the dialog. When the clicked RainbowKit wallet defines a link for its QR
 * code (`rkDetails.qrCode.getUri`, e.g. Rainbow → rnbwapp.com) we encode that
 * instead, so scanning opens the intended wallet.
 *
 * `rkDetails.mobile.getUri` is deliberately not used: it is the same-device
 * deep link, often a custom scheme (`trust://`, `argent://`) that a wallet's
 * own scanner does not read. Those wallets set `qrCode.getUri` to the raw URI.
 *
 * Falls back to the raw URI for wallets without a QR link and if the builder
 * throws or returns nothing. (MEW-2288)
 */
export const buildWalletConnectQrData = (
  rkDetails: Wallet | undefined,
  rawUri: string,
): string => {
  const getUri = rkDetails?.qrCode?.getUri
  if (typeof getUri !== 'function') return rawUri
  try {
    return getUri(rawUri) || rawUri
  } catch {
    return rawUri
  }
}
