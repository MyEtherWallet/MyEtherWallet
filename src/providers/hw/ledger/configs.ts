import { NetworkNames } from '@enkryptcom/types'

export interface PathType {
  path: string
  basePath: string
  label?: string
}

export const bip44Paths = {
  ethereumLedger: {
    path: "m/44'/60'/0'/{index}",
    basePath: "m/44'/60'/0'",
    label: 'Ethereum',
  },
  ethereumLedgerLive: {
    path: "m/44'/60'/{index}'/0/0",
    basePath: "m/44'/60'",
    label: 'Ethereum - Ledger Live',
  },
  ethereumTestnetLedger: {
    path: "m/44'/1'/0'/{index}",
    basePath: "m/44'/1'/0'",
    label: 'Testnet',
  },
  ethereumClassicLedger: {
    path: "m/44'/61'/0'/{index}",
    basePath: "m/44'/61'/0'",
    label: 'Ethereum Classic',
  },
  ethereumClassicLedgerLive: {
    path: "m/44'/61'/{index}'/0/0",
    basePath: "m/44'/61'",
    label: 'Ethereum Classic -  Ledger Live',
  },
  rootstock: {
    path: "m/44'/137'/0'/0/{index}",
    basePath: "m/44'/137'/0'/0",
    label: 'Rootstock',
  },
  bitcoinSegwitLedger: {
    path: "m/84'/0'/{index}'/0/0",
    basePath: "m/84'/0'",
    label: 'Bitcoin',
  },
  litecoinSegwitLedger: {
    path: "m/84'/2'/{index}'/0/0",
    basePath: "m/84'/2'",
    label: 'Litecoin',
  },
  dogecoinLedger: {
    path: "m/44'/3'/{index}'/0/0",
    basePath: "m/44'/3'",
    label: 'Dogecoin',
  },
} as const

const ETH_DEFAULT = [bip44Paths.ethereumLedger, bip44Paths.ethereumLedgerLive]

export const evmSupportedPaths: Partial<Record<NetworkNames, PathType[]>> = {
  [NetworkNames.Ethereum]: ETH_DEFAULT,
  [NetworkNames.Matic]: ETH_DEFAULT,
  [NetworkNames.MaticZK]: ETH_DEFAULT,
  [NetworkNames.Binance]: ETH_DEFAULT,
  [NetworkNames.Rootstock]: [bip44Paths.rootstock],
  [NetworkNames.EthereumClassic]: [
    bip44Paths.ethereumClassicLedger,
    bip44Paths.ethereumClassicLedgerLive,
  ],
  [NetworkNames.Moonbeam]: ETH_DEFAULT,
  [NetworkNames.Moonriver]: ETH_DEFAULT,
  [NetworkNames.Avalanche]: ETH_DEFAULT,
  [NetworkNames.Optimism]: ETH_DEFAULT,
  [NetworkNames.Sepolia]: [bip44Paths.ethereumTestnetLedger, ...ETH_DEFAULT],
  [NetworkNames.Okc]: ETH_DEFAULT,
  [NetworkNames.AstarEVM]: ETH_DEFAULT,
  [NetworkNames.ZkSync]: ETH_DEFAULT,
  [NetworkNames.Arbitrum]: ETH_DEFAULT,
  [NetworkNames.Gnosis]: ETH_DEFAULT,
  [NetworkNames.Fantom]: ETH_DEFAULT,
  [NetworkNames.Base]: ETH_DEFAULT,
  [NetworkNames.Celo]: ETH_DEFAULT,
  [NetworkNames.Telos]: ETH_DEFAULT,
  [NetworkNames.Blast]: ETH_DEFAULT,
}

export const btcSupportedPaths: Partial<Record<NetworkNames, PathType[]>> = {
  [NetworkNames.Bitcoin]: [bip44Paths.bitcoinSegwitLedger],
  [NetworkNames.Litecoin]: [bip44Paths.litecoinSegwitLedger],
  [NetworkNames.Dogecoin]: [bip44Paths.dogecoinLedger],
}

export const ledgerAppNames: Partial<Record<NetworkNames, string>> = {
  [NetworkNames.Ethereum]: 'Ethereum',
  [NetworkNames.Rootstock]: 'RSK',
  [NetworkNames.EthereumClassic]: 'Ethereum Classic',
  [NetworkNames.Bitcoin]: 'Bitcoin',
  [NetworkNames.Litecoin]: 'Litecoin',
  [NetworkNames.Dogecoin]: 'Dogecoin',
  [NetworkNames.Matic]: 'Ethereum',
  [NetworkNames.MaticZK]: 'Ethereum',
  [NetworkNames.Binance]: 'Ethereum',
  [NetworkNames.Moonbeam]: 'Ethereum',
  [NetworkNames.Moonriver]: 'Ethereum',
  [NetworkNames.Avalanche]: 'Ethereum',
  [NetworkNames.Optimism]: 'Ethereum',
  [NetworkNames.Sepolia]: 'Ethereum',
  [NetworkNames.Okc]: 'Ethereum',
  [NetworkNames.AstarEVM]: 'Ethereum',
  [NetworkNames.ZkSync]: 'Ethereum',
  [NetworkNames.Arbitrum]: 'Ethereum',
  [NetworkNames.Gnosis]: 'Ethereum',
  [NetworkNames.Fantom]: 'Ethereum',
  [NetworkNames.Base]: 'Ethereum',
  [NetworkNames.Celo]: 'Ethereum',
  [NetworkNames.Telos]: 'Ethereum',
  [NetworkNames.Blast]: 'Ethereum',
}

export function getLedgerAppName(network: NetworkNames): string {
  return ledgerAppNames[network] ?? 'Ethereum'
}

export function isEvmNetwork(network: NetworkNames): boolean {
  return network in evmSupportedPaths
}

export function isBtcNetwork(network: NetworkNames): boolean {
  return network in btcSupportedPaths
}

export function isLedgerNetworkSupported(network: NetworkNames): boolean {
  return isEvmNetwork(network) || isBtcNetwork(network)
}
