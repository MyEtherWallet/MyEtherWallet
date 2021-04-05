import bcvaultWallet from '@/modules/access-wallet/hardware/handlers/hardwares/bcvault';
import bitboxWallet from '@/modules/access-wallet/hardware/handlers/hardwares/bitbox';
import bitbox02Wallet from '@/modules/access-wallet/hardware/handlers/hardwares/bitbox02';
import coolwalletWallet from '@/modules/access-wallet/hardware/handlers/hardwares/coolwallet';
import keepkeyWallet from '@/modules/access-wallet/hardware/handlers/hardwares/keepkey';
import ledgerWallet from '@/modules/access-wallet/hardware/handlers/hardwares/ledger';
import secalotWallet from '@/modules/access-wallet/hardware/handlers/hardwares/secalot';
import trezorWallet from '@/modules/access-wallet/hardware/handlers/hardwares/trezor';
import mewconnectWallet from '@/modules/wallets/utils/hybrid/MEWconnect';

import { WALLET_TYPES } from '@/modules/access-wallet/hardware/handlers/configs/configWalletTypes.js';

/**
 * different types of available hardware wallets
 */
export default {
  [WALLET_TYPES.LEDGER]: {
    create: ledgerWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with Ledger',
      2: '2. Confirm Network & Address'
    }
  },
  [WALLET_TYPES.TREZOR]: {
    create: trezorWallet,
    when: 1,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with Trezor',
      2: '2. Confirm Network & Address'
    }
  },
  [WALLET_TYPES.BITBOX]: {
    create: bitboxWallet,
    when: 4,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Select BitBox Wallet',
      2: '2. Connect with BitBox',
      3: '3. Enter your password',
      4: '4. Confirm Network & Address'
    }
  },
  [WALLET_TYPES.BITBOX2]: {
    create: bitbox02Wallet,
    when: 3,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Select BitBox Wallet',
      // 2: 'Match your encryption pairing code',
      2: '2. Connect with BitBox',
      3: '3. Confirm Network & Address'
    }
  },
  [WALLET_TYPES.SECALOT]: {
    create: secalotWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Enter your password',
      2: '2. Connect with Secalot',
      3: '3. Confirm Network & Address'
    }
  },
  [WALLET_TYPES.KEEPKEY]: {
    create: keepkeyWallet,
    when: 2,
    hasPaths: true,
    requiresPassword: false,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with KeepKey',
      2: '2. Enter your password',
      3: '3. Confirm Network & Address'
    }
  },
  [WALLET_TYPES.FINNEY]: {
    create: mewconnectWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: true,
    titles: {
      1: '1. Connect with Finney'
    }
  },
  [WALLET_TYPES.XWALLET]: {
    create: mewconnectWallet,
    when: 1,
    hasPaths: false,
    requiresPassword: false,
    needsQr: true,
    accountOnly: false,
    titles: {
      1: '1. Connect with XWallet'
    }
  },
  [WALLET_TYPES.BCVAULT]: {
    create: bcvaultWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: false,
    needsQr: false,
    accountOnly: true,
    titles: {
      1: '1. Connect with BC Vault'
    }
  },
  [WALLET_TYPES.COOL_WALLET]: {
    create: coolwalletWallet,
    when: 2,
    hasPaths: false,
    requiresPassword: true,
    needsQr: false,
    accountOnly: false,
    titles: {
      1: '1. Connect with CoolWallet',
      2: '2. Confirm Network & Address'
    }
  }
};
