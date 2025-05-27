import EnkryptLogo from '@/assets/images/access/enkrypt.webp'
import MewLogo from '@/assets/images/access/mew-app.webp'
import LedgerLogo from '@/assets/images/access/ledger.webp'
import TrezorLogo from '@/assets/images/access/trezor.webp'
import PrivateKeyLogo from '@/assets/images/access/private-key.webp'
import KeystoreLogo from '@/assets/images/access/keystore.webp'
import MnemonicLogo from '@/assets/images/access/phrase.webp'
import { ROUTES_HOME } from '@/router/routeNames'

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
  routeName?: string
  downloadUrls?: downloadUrls
}
export const walletConfigs: Record<defaultWalletId, WalletConfig> = {
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    icon: LedgerLogo,
    type: [WalletConfigType.HARDWARE],
  },
  trezor: {
    id: 'trezor',
    name: 'Trezor',
    icon: TrezorLogo,
    type: [WalletConfigType.HARDWARE],
    routeName: ROUTES_HOME.ACCESS_TREZOR.NAME,
  },
  keystore: {
    id: 'keystore',
    name: 'Keystore',
    icon: KeystoreLogo,
    type: [WalletConfigType.SOFTWARE],
    routeName: ROUTES_HOME.ACCESS_KEYSTORE.NAME,
  },
  mnemonic: {
    id: 'mnemonic',
    name: 'Recovery (mnemonic) Phrase',
    icon: MnemonicLogo,
    type: [WalletConfigType.SOFTWARE],
    routeName: ROUTES_HOME.ACCESS_MNEMONIC.NAME,
  },
  privateKey: {
    id: 'privateKey',
    name: 'Private Key',
    icon: PrivateKeyLogo,
    type: [WalletConfigType.SOFTWARE],
    routeName: ROUTES_HOME.ACCESS_PRIVATE_KEY.NAME,
  },
  mew: {
    id: 'mew',
    name: 'MEW Mobile',
    icon: MewLogo,
    type: [WalletConfigType.MOBILE],
    isDefault: true,
    isOfficial: true,
    isWC: true,
  },
  enkrypt: {
    id: 'enkrypt',
    name: 'Enkrypt',
    icon: EnkryptLogo,
    type: [WalletConfigType.EXTENSION],
    isDefault: true,
    isOfficial: true,
    isWC: true,
    downloadUrls: {
      browserExtension: 'https://enkrypt.com',
    }
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
