import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  BCVaultWallet,
  CoolWallet
} from '@/modules/access-wallet/common';

/**
 * different types of available hardware wallets
 */
const LAYOUT_STEPS = {
  ENTER_PASSWORD: 'enter_password',
  PATH_SELECT: 'path_select',
  NETWORK_ACCOUNT_SELECT: 'network_account_select',
  BITBOX_SELECT: 'bitbox_select',
  BITBOX_POPUP: 'bitbox_popup',
  KEEPKEY_POPUP: 'keepkey_popup'
};
export { LAYOUT_STEPS };
export default {
  [WALLET_TYPES.LEDGER]: {
    create: LedgerWallet,
    when: 2,
    steps: [LAYOUT_STEPS.PATH_SELECT, LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT],
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    titles: {
      1: 'Connect with Ledger',
      2: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.TREZOR]: {
    create: TrezorWallet,
    when: 2,
    steps: [LAYOUT_STEPS.PATH_SELECT, LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT],
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    titles: {
      1: 'Connect with Trezor',
      2: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.BITBOX]: {
    create: BitBoxWallet,
    when: 4,
    steps: [
      LAYOUT_STEPS.BITBOX_SELECT,
      LAYOUT_STEPS.ENTER_PASSWORD,
      LAYOUT_STEPS.PATH_SELECT,
      LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT
    ],
    hasPaths: true,
    requiresPassword: true,
    accountOnly: false,
    titles: {
      1: 'Select BitBox Wallet',
      2: 'Connect with BitBox',
      3: 'Enter your password',
      4: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.BITBOX2]: {
    create: BitBox02Wallet,
    when: 2,
    steps: [LAYOUT_STEPS.PATH_SELECT, LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT],
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    titles: {
      1: 'Connect with BitBox',
      2: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.KEEPKEY]: {
    create: KeepkeyWallet,
    when: 2,
    steps: [
      LAYOUT_STEPS.PATH_SELECT,
      LAYOUT_STEPS.KEEPKEY_POPUP,
      LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT
    ],
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    titles: {
      1: 'Connect with KeepKey',
      2: 'Enter your password',
      3: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.BCVAULT]: {
    create: BCVaultWallet,
    when: 2,
    steps: [LAYOUT_STEPS.PATH_SELECT, LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT],
    hasPaths: false,
    requiresPassword: false,
    accountOnly: true,
    titles: {
      1: 'Connect with BC Vault'
    }
  },
  [WALLET_TYPES.COOL_WALLET]: {
    create: CoolWallet,
    when: 2,
    steps: [LAYOUT_STEPS.ENTER_PASSWORD, LAYOUT_STEPS.NETWORK_ACCOUNT_SELECT],
    hasPaths: false,
    requiresPassword: true,
    accountOnly: false,
    titles: {
      1: 'Connect with CoolWallet',
      2: 'Confirm Network & Address'
    }
  }
};
