import {
  LEDGER,
  TREZOR,
  BITBOX,
  SECALOT,
  KEEPKEY,
  MNEMONIC
} from './walletTypes';
import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';
import bitboxPaths from './bitboxPaths';
import secalotPaths from './secalotPaths';
import keepkeyPaths from './keepkeyPaths';
import mnemonicPaths from './mnemonicPaths';

export default {
  [LEDGER]: ledgerPaths,
  [TREZOR]: trezorPaths,
  [BITBOX]: bitboxPaths,
  [SECALOT]: secalotPaths,
  [KEEPKEY]: keepkeyPaths,
  [MNEMONIC]: mnemonicPaths
};
