import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet,
  KeepkeyWallet
} from './hardware';
import WalletInterface from './WalletInterface';
import { MnemonicWallet } from './software';
import {
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet
} from './hybrid';

export {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet,
  KeepkeyWallet,
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet,
  WalletInterface,
  MnemonicWallet
};
