import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';
import bitboxPaths from './bitboxPaths';
import bitbox02Paths from './bitbox02Paths';
import keepkeyPaths from './keepkeyPaths';
import mnemonicPaths from './mnemonicPaths';
import coolWalletPaths from './coolWalletPaths';
import satochipPaths from './satochipPaths';

export default {
  [WALLET_TYPES.LEDGER]: ledgerPaths,
  [WALLET_TYPES.TREZOR]: trezorPaths,
  [WALLET_TYPES.BITBOX]: bitboxPaths,
  [WALLET_TYPES.BITBOX2]: bitbox02Paths,
  [WALLET_TYPES.KEEPKEY]: keepkeyPaths,
  [WALLET_TYPES.MNEMONIC]: mnemonicPaths,
  [WALLET_TYPES.SATOCHIP]: satochipPaths,
  [WALLET_TYPES.COOL_WALLET]: coolWalletPaths
};
