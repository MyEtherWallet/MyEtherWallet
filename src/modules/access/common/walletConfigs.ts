import EnkryptLogo from '@/assets/images/access/enkrypt.webp'
import MewLogo from '@/assets/images/access/mew-app.webp'
import LedgerLogo from '@/assets/images/access/ledger.webp'
import TrezorLogo from '@/assets/images/access/trezor.webp'
import PrivateKeyLogo from '@/assets/images/access/private-key.webp'
import KeystoreLogo from '@/assets/images/access/keystore.webp'
import MnemonicLogo from '@/assets/images/access/phrase.webp'
export type WalletType = 'web3' | 'mobile' | 'hardware' | 'software'
export type defaultWalletId =
  | 'enkrypt'
  | 'mewMobile'
  | 'ledger'
  | 'trezor'
  | 'privateKey'
  | 'keystore'
  | 'mnemonic'

export type WalletConfig = {
  id: string
  name: string
  icon: string
  type: WalletType
  isDefault?: boolean
  isOfficial?: boolean
}
export const walletConfigs: Record<defaultWalletId, WalletConfig> = {
  enkrypt: {
    id: 'enkrypt',
    name: 'Enkrypt',
    icon: EnkryptLogo,
    type: 'web3',
    isDefault: true,
    isOfficial: true,
  },
  mewMobile: {
    id: 'mewMobile',
    name: 'MEW Mobile',
    icon: MewLogo,
    type: 'mobile',
    isDefault: true,
    isOfficial: true,
  },
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
  privateKey: {
    id: 'privateKey',
    name: 'Private Key',
    icon: PrivateKeyLogo,
    type: 'software',
  },
  keystore: {
    id: 'keystore',
    name: 'Keystore',
    icon: KeystoreLogo,
    type: 'software',
  },
  mnemonic: {
    id: 'mnemonic',
    name: 'Mnemonic',
    icon: MnemonicLogo,
    type: 'software',
  },
}
