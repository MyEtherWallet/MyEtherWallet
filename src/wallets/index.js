import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet
} from './hardware';
import { BasicWallet, MnemonicWallet } from './software';
import { MewConnectWallet } from './hybrid';
import { override } from './web3-override';

export {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet,
  MewConnectWallet,
  BasicWallet,
  MnemonicWallet,
  override
};
