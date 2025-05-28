import { NetworkNames } from '@enkryptcom/types'

const chainToEnum: Record<string, NetworkNames> = {
  '1': NetworkNames.Ethereum,
  '137': NetworkNames.Matic,
  '43114': NetworkNames.Avalanche,
  '56': NetworkNames.Binance,
  '61': NetworkNames.EthereumClassic,
  '30': NetworkNames.Rootstock,
  '1101': NetworkNames.MaticZK,
  '1284': NetworkNames.Moonbeam,
  '1285': NetworkNames.Moonriver,
  '10': NetworkNames.Optimism,
  '11155111': NetworkNames.Sepolia,
  '66': NetworkNames.Okc,
  '336': NetworkNames.ShidenEVM,
  '592': NetworkNames.AstarEVM,
  '324': NetworkNames.ZkSync,
  '42161': NetworkNames.Arbitrum,
  '100': NetworkNames.Gnosis,
  '250': NetworkNames.Fantom,
  '8217': NetworkNames.Klaytn,
  '8453': NetworkNames.Base,
  '42220': NetworkNames.Celo,
  '570': NetworkNames.Syscoin,
  '40': NetworkNames.Telos,
  '81457': NetworkNames.Blast,
}

export { chainToEnum }