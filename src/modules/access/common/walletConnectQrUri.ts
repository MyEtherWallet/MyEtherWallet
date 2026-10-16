import type { Wallet } from '@rainbow-me/rainbowkit'

/**
 * Resolve the string encoded into the WalletConnect QR code.
 *
 * The wagmi `display_uri` event yields a generic `wc:` URI. Scanned with a
 * phone's native camera it resolves to whichever wallet the OS registered as
 * the `wc:` handler (often the wrong one, e.g. Rainbow), not the wallet named
 * in the dialog. When the clicked RainbowKit wallet exposes a universal link
 * (`rkDetails.mobile.getUri`, e.g. Trust → link.trustwallet.com) we encode that
 * instead, so scanning opens the intended wallet. Falls back to the raw URI for
 * wallets without a deep link (MEW Mobile, generic WalletConnect) and if the
 * builder throws or returns nothing. (MEW-2288)
 */
export const buildWalletConnectQrData = (
  rkDetails: Wallet | undefined,
  rawUri: string,
): string => {
  const getUri = rkDetails?.mobile?.getUri
  if (typeof getUri !== 'function') return rawUri
  try {
    return getUri(rawUri) || rawUri
  } catch {
    return rawUri
  }
}
