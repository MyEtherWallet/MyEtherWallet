import { LedgerWallet, TrezorWallet, DigitalBitboxWallet } from './hardware'
import { BasicWallet, MnemonicWallet } from './software'
import { MewConnectWallet } from './hybrid'
import { overide, WalletWrapper } from './web3-overide'

export {
  LedgerWallet,
  TrezorWallet,
  DigitalBitboxWallet,
  MewConnectWallet,
  BasicWallet,
  MnemonicWallet,
  overide,
  WalletWrapper
}
