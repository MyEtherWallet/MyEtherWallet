/** The RainbowKit wallet details a connector, or a wallet config spread from one, carries. */
const rainbowKitDetails = (source: object): object | undefined => {
  if (!('rkDetails' in source)) return undefined
  const { rkDetails } = source
  return typeof rkDetails === 'object' && rkDetails !== null
    ? rkDetails
    : undefined
}

const rainbowKitId = (source: object): string | undefined => {
  const details = rainbowKitDetails(source)
  return details && 'id' in details && typeof details.id === 'string'
    ? details.id
    : undefined
}

/**
 * RainbowKit registers the generic WalletConnect wallet twice, the first time
 * with a connector that opens WalletConnect's own modal on connect.
 */
const opensWalletConnectModal = (connector: object): boolean => {
  const details = rainbowKitDetails(connector)
  return (
    details !== undefined &&
    'isWalletConnectModalConnector' in details &&
    details.isWalletConnectModalConnector === true
  )
}

/**
 * The wagmi connector for a clicked wallet.
 *
 * A connector matches by its own id or by its RainbowKit id (static configs
 * such as MEW Mobile use the latter). Almost every RainbowKit mobile wallet
 * shares the connector id `walletConnect`, so when several match, the wallet's
 * own RainbowKit id picks its connector instead of whichever comes first.
 *
 * The access dialog draws its own QR code, so the connector that opens
 * WalletConnect's modal never matches.
 */
export const findWalletConnector = <C extends { id: string }>(
  connectors: readonly C[],
  wallet: { id: string },
): C | undefined => {
  const matches = connectors.filter(
    connector =>
      (connector.id === wallet.id || rainbowKitId(connector) === wallet.id) &&
      !opensWalletConnectModal(connector),
  )
  const ownId = rainbowKitId(wallet)
  const own =
    ownId === undefined
      ? undefined
      : matches.find(connector => rainbowKitId(connector) === ownId)
  return own ?? matches[0]
}
