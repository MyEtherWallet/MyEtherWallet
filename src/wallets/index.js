import {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  SecalotWallet
} from './hardware';
import { BasicWallet, MnemonicWallet } from './software';
import { MewConnectWallet } from './hybrid';
import { override, WalletWrapper } from './web3-override';

export {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  SecalotWallet,
  MewConnectWallet,
  BasicWallet,
  MnemonicWallet,
  override,
  WalletWrapper
};
