import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import {
  LedgerWallet,
  TrezorWallet,
  KeepkeyWallet,
  MnemonicWallet
} from '@/modules/access-wallet/common';

/**
 * list of wallets that can switch
 */
/**
 *  init: @Object imported wallet handler,
 */
export default {
  [WALLET_TYPES.LEDGER]: {
    init: LedgerWallet
  },
  [WALLET_TYPES.TREZOR]: {
    init: TrezorWallet
  },
  [WALLET_TYPES.KEEPKEY]: {
    init: KeepkeyWallet
  },
  [WALLET_TYPES.MNEMONIC]: {
    init: MnemonicWallet
  }
};
