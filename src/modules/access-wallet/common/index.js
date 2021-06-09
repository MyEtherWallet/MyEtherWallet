import {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  BCVaultWallet,
  CoolWallet
} from '@/modules/access-wallet/hardware/handlers';
import WalletInterface from './WalletInterface';
import { MnemonicWallet } from '../software/handlers';
import {
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet
} from '../hybrid/handlers';

export {
  LedgerWallet,
  TrezorWallet,
  BitBoxWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  CoolWallet,
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet,
  WalletInterface,
  MnemonicWallet,
  BCVaultWallet
};
