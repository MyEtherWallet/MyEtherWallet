import { LEDGER, TREZOR, BITBOX, SECALOT, MNEMONIC } from './walletTypes';
import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';
import bitboxPaths from './bitboxPaths';
import secalotPaths from './secalotPaths';
import mnemonicPaths from './mnemonicPaths';

export default {
  [LEDGER]: ledgerPaths,
  [TREZOR]: trezorPaths,
  [BITBOX]: bitboxPaths,
  [SECALOT]: secalotPaths,
  [MNEMONIC]: mnemonicPaths
};
