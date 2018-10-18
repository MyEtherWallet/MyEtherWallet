import { LEDGER, TREZOR, BITBOX, SECALOT } from './walletTypes';
import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';
import bitboxPaths from './bitboxPaths';
import secalotPaths from './secalotPaths';
export default {
  [LEDGER]: ledgerPaths,
  [TREZOR]: trezorPaths,
  [BITBOX]: bitboxPaths,
  [SECALOT]: secalotPaths
};
