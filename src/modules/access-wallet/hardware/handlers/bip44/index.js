import { WALLET_TYPES } from '../configs/configWalletTypes';
import ledgerPaths from './ledgerPaths';
import trezorPaths from './trezorPaths';
import bitboxPaths from './bitboxPaths';
import bitbox02Paths from './bitbox02Paths';
import secalotPaths from '../hardwares/secalot/secalotPaths';
import keepkeyPaths from './keepkeyPaths';
import mnemonicPaths from './mnemonicPaths';
import coolWalletPaths from './coolWalletPaths';

export default {
  [WALLET_TYPES.ledgerType]: ledgerPaths,
  [WALLET_TYPES.trezorType]: trezorPaths,
  [WALLET_TYPES.bitboxType]: bitboxPaths,
  [WALLET_TYPES.bitbox02Type]: bitbox02Paths,
  [WALLET_TYPES.secalotType]: secalotPaths,
  [WALLET_TYPES.keepkeyType]: keepkeyPaths,
  [WALLET_TYPES.mnemonicType]: mnemonicPaths,
  [WALLET_TYPES.coolWalletType]: coolWalletPaths
};
