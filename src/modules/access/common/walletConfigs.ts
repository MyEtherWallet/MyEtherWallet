import EnkryptLogo from '@/assets/images/access/enkrypt.webp'
import MewLogo from '@/assets/images/access/mew-app.webp'
import LedgerLogo from '@/assets/images/access/ledger.webp'
import TrezorLogo from '@/assets/images/access/trezor.webp'
import PrivateKeyLogo from '@/assets/images/access/private-key.webp'
import KeystoreLogo from '@/assets/images/access/keystore.webp'
import MnemonicLogo from '@/assets/images/access/phrase.webp'
import { ROUTES_HOME } from '@/router/routeNames'

export type WalletConfigType =
  | 'web3'
  | 'mobile'
  | 'hardware'
  | 'software'
  | 'desktop'

export type defaultWalletId =
  | 'enkrypt'
  | 'mew' // 'mew mobile app it is matched to rainbow wallet id
  | 'ledger'
  | 'trezor'
  | 'privateKey'
  | 'keystore'
  | 'mnemonic'

export type WalletConfig = {
  id: string
  name: string
  icon: string | (() => Promise<string>)
  type: WalletConfigType | undefined
  isDefault?: boolean
  isWC?: boolean
  isOfficial?: boolean
  routeName?: string
}
export const walletConfigs: Record<defaultWalletId, WalletConfig> = {
  ledger: {
    id: 'ledger',
    name: 'Ledger',
    icon: LedgerLogo,
    type: 'hardware',
  },
  trezor: {
    id: 'trezor',
    name: 'Trezor',
    icon: TrezorLogo,
    type: 'hardware',
  },
  keystore: {
    id: 'keystore',
    name: 'Keystore',
    icon: KeystoreLogo,
    type: 'software',
    routeName: ROUTES_HOME.ACCESS_KEYSTORE.NAME,
  },
  mnemonic: {
    id: 'mnemonic',
    name: 'Recovery (mnemonic) Phrase',
    icon: MnemonicLogo,
    type: 'software',
    routeName: ROUTES_HOME.ACCESS_MNEMONIC.NAME,
  },
  privateKey: {
    id: 'privateKey',
    name: 'Private Key',
    icon: PrivateKeyLogo,
    type: 'software',
    routeName: ROUTES_HOME.ACCESS_PRIVATE_KEY.NAME,
  },
  mew: {
    id: 'mew',
    name: 'MEW Mobile',
    icon: MewLogo,
    type: 'mobile',
    isDefault: true,
    isOfficial: true,
    isWC: true,
  },
  enkrypt: {
    id: 'enkrypt',
    name: 'Enkrypt',
    icon: EnkryptLogo,
    type: 'web3',
    isDefault: true,
    isOfficial: true,
    isWC: true,
  },
}
