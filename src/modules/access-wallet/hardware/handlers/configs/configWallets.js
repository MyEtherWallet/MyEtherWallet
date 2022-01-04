import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import {
  LedgerWallet,
  TrezorWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  CoolWallet
} from '@/modules/access-wallet/common';

/**
 * different types of available hardware wallets
 */
/**
 *  create: @Object imported wallet handler,
 *  when: @Integer which step your wallet should attempt to unlock,
 *  hasPaths: @Boolean whether your hardware wallet has supported paths,
 *  requiresPassword: @Boolean whether your hardware wallet requires password,
 *  title: @String Header title for your wallet
 */
export default {
  [WALLET_TYPES.LEDGER]: {
    create: LedgerWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false,
    title: 'Connect your Ledger'
  },
  [WALLET_TYPES.TREZOR]: {
    create: TrezorWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    title: 'Connect your Trezor'
  },
  [WALLET_TYPES.BITBOX2]: {
    create: BitBox02Wallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false,
    title: 'Connect your BitBox02'
  },
  [WALLET_TYPES.KEEPKEY]: {
    create: KeepkeyWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    title: 'Connect your KeepKey'
  },
  [WALLET_TYPES.COOL_WALLET]: {
    create: CoolWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true,
    title: 'Enter pairing password'
  }
};
