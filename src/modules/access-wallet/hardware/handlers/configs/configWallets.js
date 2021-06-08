import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  BitBox02Wallet,
  SecalotWallet,
  KeepkeyWallet,
  BCVaultWallet,
  CoolWallet
} from '@/modules/access-wallet/common';

/**
 * different types of available hardware wallets
 */
export default {
  [WALLET_TYPES.LEDGER]: {
    create: LedgerWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: 'Connect with Ledger',
      2: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.TREZOR]: {
    create: TrezorWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: 'Connect with Trezor',
      2: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.BITBOX]: {
    create: BitBoxWallet,
    when: 4,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false,
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
    when: 3,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: 'Select BitBox Wallet',
      2: 'Connect with BitBox',
      3: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.SECALOT]: {
    create: SecalotWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: 'Enter your password',
      2: 'Connect with Secalot',
      3: 'Confirm Network & Address'
    }
  },
  [WALLET_TYPES.KEEPKEY]: {
    create: KeepkeyWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
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
    hasPaths: false,
    requiresPassword: false,
    needsQr: false,
    accountOnly: true,
    titles: {
      1: 'Connect with BC Vault'
    }
  },
  [WALLET_TYPES.COOL_WALLET]: {
    create: CoolWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: 'Connect with CoolWallet',
      2: 'Confirm Network & Address'
    }
  }
};
