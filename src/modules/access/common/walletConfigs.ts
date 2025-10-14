import EnkryptLogo from '@/assets/images/access/enkrypt.webp'
import MewLogo from '@/assets/images/access/mew-app.webp'
import LedgerLogo from '@/assets/images/access/ledger.webp'
import TrezorLogo from '@/assets/images/access/trezor.webp'
import PrivateKeyLogo from '@/assets/images/access/private-key.webp'
import KeystoreLogo from '@/assets/images/access/keystore.webp'
import MnemonicLogo from '@/assets/images/access/phrase.webp'
import HWWallet from '@enkryptcom/hw-wallets'
import { NetworkNames } from '@enkryptcom/types'

export const WALLET_VIEWS = [
  'default',
  'ledger',
  'trezor',
  'keystore',
  'mnemonic',
  'private_key',
  'wallet_connect',
] as const

export type WalletView = (typeof WALLET_VIEWS)[number]

export enum WalletConfigType {
  MOBILE = 'mobile',
  HARDWARE = 'hardware',
  SOFTWARE = 'software',
  DESKTOP = 'desktop',
  EXTENSION = 'extension',
}

export const WALLET_TYPES = {
  LEDGER: 'ledger',
  TREZOR: 'trezor',
  WALLET_CONNECT: 'walletConnect',
  KEYSTORE: 'keystore',
  MNEMONIC: 'mnemonic',
  WEB3_WALLET: 'web3Wallet',
  PRIV_KEY: 'privKey',
  WALLET_LINK: 'walletLink',
  MEW_WALLET: 'mewWallet',
}

export type defaultWalletId =
  | 'enkrypt'
  | 'mew' // 'mew mobile app it is matched to rainbow wallet id
  | 'ledger'
  | 'trezor'
  | 'privateKey'
  | 'keystore'
  | 'mnemonic'

type downloadUrls = {
  android?: string
  ios?: string
  mobile?: string
  qrCode?: string
  chrome?: string
  edge?: string
  firefox?: string
  opera?: string
  browserExtension?: string
}

export type WalletConfig = {
  id: string
  name: string
  icon: string | (() => Promise<string>)
  type: WalletConfigType[]
  isDefault?: boolean
  isWC?: boolean
  isOfficial?: boolean
  walletViewType?: WalletView
  downloadUrls?: downloadUrls
  canSupport?: (networkName?: string) => boolean
}

const canSupport = (networkName?: string): boolean => {
  if (!networkName) return false
  const hwWallet = new HWWallet()
  return hwWallet.isNetworkSupported(networkName as NetworkNames)
}

export const walletConfigs: Record<defaultWalletId, WalletConfig> = {
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    icon: LedgerLogo,
    type: [WalletConfigType.HARDWARE],
    canSupport: canSupport,
    walletViewType: 'ledger',
  },
  trezor: {
    id: 'trezor',
    name: 'Trezor',
    icon: TrezorLogo,
    type: [WalletConfigType.HARDWARE],
    canSupport: canSupport,
    walletViewType: 'trezor',
  },
  keystore: {
    id: 'keystore',
    name: 'Keystore',
    icon: KeystoreLogo,
    type: [WalletConfigType.SOFTWARE],
    walletViewType: 'keystore',
    canSupport: () => true,
  },
  mnemonic: {
    id: 'mnemonic',
    name: 'Recovery (mnemonic) Phrase',
    icon: MnemonicLogo,
    type: [WalletConfigType.SOFTWARE],
    walletViewType: 'mnemonic',
    canSupport: () => true,
  },
  privateKey: {
    id: 'privateKey',
    name: 'Private Key',
    icon: PrivateKeyLogo,
    type: [WalletConfigType.SOFTWARE],
    walletViewType: 'private_key',
    canSupport: () => true,
  },
  mew: {
    id: 'mew',
    name: 'MEW Mobile',
    icon: MewLogo,
    type: [WalletConfigType.MOBILE],
    canSupport: () => true,
    isDefault: true,
    isOfficial: true,
    isWC: true,
    walletViewType: 'wallet_connect',
  },
  enkrypt: {
    id: 'enkrypt',
    name: 'Enkrypt',
    icon: EnkryptLogo,
    type: [WalletConfigType.EXTENSION],
    canSupport: () => true,
    isDefault: true,
    isOfficial: true,
    isWC: true,
    downloadUrls: {
      browserExtension: 'https://enkrypt.com',
    },
  },
}

export enum SortBy {
  POPULAR = 'popular',
  A_Z = 'a-z',
  Z_A = 'z-a',
}

export interface Filter {
  name: string
  value: WalletConfigType | 'all'
}
