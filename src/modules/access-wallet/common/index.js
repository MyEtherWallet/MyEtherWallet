import {
  LedgerWallet,
  LedgerX,
  TrezorWallet,
  BitBox02Wallet,
  KeepkeyWallet,
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
  LedgerX,
  TrezorWallet,
  BitBox02Wallet,
  KeepkeyWallet,
  CoolWallet,
  MewConnectWallet,
  WalletConnectWallet,
  WalletLinkWallet,
  WalletInterface,
  Web3Wallet,
  MnemonicWallet
};
