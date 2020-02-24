import {
  LEDGER,
  TREZOR,
  BITBOX,
  BITBOX02,
  SECALOT,
  KEEPKEY,
  MNEMONIC
} from './walletTypes';
import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';
import bitboxPaths from './bitboxPaths';
import bitbox02Paths from './bitbox02Paths';
import secalotPaths from './secalotPaths';
import keepkeyPaths from './keepkeyPaths';
import mnemonicPaths from './mnemonicPaths';

export default {
  [LEDGER]: ledgerPaths,
  [TREZOR]: trezorPaths,
  [BITBOX]: bitboxPaths,
  [BITBOX02]: bitbox02Paths,
  [SECALOT]: secalotPaths,
  [KEEPKEY]: keepkeyPaths,
  [MNEMONIC]: mnemonicPaths
};
