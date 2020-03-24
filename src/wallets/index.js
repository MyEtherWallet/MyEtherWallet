import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  BitBox02Wallet,
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
  BitBox02Wallet,
  SecalotWallet,
  KeepkeyWallet,
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet,
  WalletInterface,
  MnemonicWallet
};
