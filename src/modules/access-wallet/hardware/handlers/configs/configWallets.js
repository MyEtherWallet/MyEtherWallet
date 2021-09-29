import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import {
  LedgerWallet,
  TrezorWallet,
  BitBox02Wallet,
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
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    title: 'Connect your Ledger'
  },
  [WALLET_TYPES.TREZOR]: {
    create: TrezorWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    title: 'Connect your Trezor'
  },
  [WALLET_TYPES.BITBOX2]: {
    create: BitBox02Wallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false,
    accountOnly: false,
    title: 'Connect your BitBox 02'
  },
  [WALLET_TYPES.KEEPKEY]: {
    create: KeepkeyWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    accountOnly: false,
    title: 'Connect your KeepKey'
  },
  [WALLET_TYPES.BCVAULT]: {
    create: BCVaultWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false,
    accountOnly: true,
    title: 'Connect your BC Vault'
  },
  [WALLET_TYPES.COOL_WALLET]: {
    create: CoolWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true,
    accountOnly: false,
    title: 'Enter pairing password'
  }
};
