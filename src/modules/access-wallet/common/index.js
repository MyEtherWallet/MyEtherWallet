import {
  LedgerWallet,
  TrezorWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  BCVaultWallet,
  SatochipWallet,
  CoolWallet
} from '@/modules/access-wallet/hardware/handlers';
import WalletInterface from './WalletInterface';
import { MnemonicWallet, Web3Wallet } from '../software/handlers';
import {
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet
} from '../hybrid/handlers';

export {
  LedgerWallet,
  TrezorWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  SatochipWallet,
  CoolWallet,
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet,
  WalletInterface,
  Web3Wallet,
  MnemonicWallet,
  BCVaultWallet
};
