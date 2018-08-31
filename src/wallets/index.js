import {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  SecalotWallet
} from './hardware';
import { BasicWallet, MnemonicWallet } from './software';
import { MewConnectWallet } from './hybrid';
import { overide, WalletWrapper } from './web3-overide';

export {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  SecalotWallet,
  MewConnectWallet,
  BasicWallet,
  MnemonicWallet,
  overide,
  WalletWrapper
};
