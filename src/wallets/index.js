import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet
} from './hardware';
import WalletInterface from './WalletInterface';
import { MnemonicWallet } from './software';
import { MewConnectWallet } from './hybrid';
import override from './web3-override';

export {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet,
  MewConnectWallet,
  WalletInterface,
  MnemonicWallet,
  override
};
