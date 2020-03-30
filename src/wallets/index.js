import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  SecalotWallet,
  KeepkeyWallet,
  BCVaultWallet,
  CoolWallet
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
  CoolWallet,
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet,
  WalletInterface,
  MnemonicWallet,
  BCVaultWallet
};
