import _Access_Ledger from 'raw-loader!@/data/DecisionTree/md/_Access_Ledger.md';
import _Access_Trezor from 'raw-loader!@/data/DecisionTree/md/_Access_Trezor.md';
import _Access_other from 'raw-loader!@/data/DecisionTree/md/_Access_other.md';
import _Access_phrase from 'raw-loader!@/data/DecisionTree/md/_Access_phrase.md';
import _Access_file from 'raw-loader!@/data/DecisionTree/md/_Access_file.md';
import _Access_key from 'raw-loader!@/data/DecisionTree/md/_Access_key.md';
import _Cant_scan_access from 'raw-loader!@/data/DecisionTree/md/_Cant_scan_access.md';
import _Forgot_pass_access from 'raw-loader!@/data/DecisionTree/md/_Forgot_pass_access.md';
import _Using_CX_access from 'raw-loader!@/data/DecisionTree/md/_Using_CX_access.md';
import _Using_MM_access from 'raw-loader!@/data/DecisionTree/md/_Using_MM_access.md';
import _created_on_MEW from 'raw-loader!@/data/DecisionTree/md/_created_on_MEW.md';
import _created_other from 'raw-loader!@/data/DecisionTree/md/_created_other.md';
import _Find_CX from 'raw-loader!@/data/DecisionTree/md/_Find_CX.md';
import _Find_file from 'raw-loader!@/data/DecisionTree/md/_Find_file.md';
import _Find_key from 'raw-loader!@/data/DecisionTree/md/_Find_key.md';
import _Find_Ledger from 'raw-loader!@/data/DecisionTree/md/_Find_Ledger.md';
import _Find_Trezor from 'raw-loader!@/data/DecisionTree/md/_Find_Trezor.md';
import _Find_MEWconnect from 'raw-loader!@/data/DecisionTree/md/_Find_MEWconnect.md';
import _Find_other from 'raw-loader!@/data/DecisionTree/md/_Find_other.md';
import _Find_MM from 'raw-loader!@/data/DecisionTree/md/_Find_MM.md';
import _Different_address from 'raw-loader!@/data/DecisionTree/md/_Different_address.md';
import _Given_hash from 'raw-loader!@/data/DecisionTree/md/_Given_hash.md';
import _No_hash from 'raw-loader!@/data/DecisionTree/md/_No_hash.md';
import _Notgiven_hash from 'raw-loader!@/data/DecisionTree/md/_Notgiven_hash.md';
import _Recognize_address from 'raw-loader!@/data/DecisionTree/md/_Recognize_address.md';
import _Saved_hash from 'raw-loader!@/data/DecisionTree/md/_Saved_hash.md';
import _Tokens_custom from 'raw-loader!@/data/DecisionTree/md/_Tokens_custom.md';
import _tx_bug from 'raw-loader!@/data/DecisionTree/md/_tx_bug.md';
import _tx_error from 'raw-loader!@/data/DecisionTree/md/_tx_error.md';
import _tx_other from 'raw-loader!@/data/DecisionTree/md/_tx_other.md';
import _kyber from 'raw-loader!@/data/DecisionTree/md/_kyber.md';
import _bity from 'raw-loader!@/data/DecisionTree/md/_bity.md';
import _changelly from 'raw-loader!@/data/DecisionTree/md/_changelly.md';
import _simplex from 'raw-loader!@/data/DecisionTree/md/_simplex.md';
import _Funds_network from 'raw-loader!@/data/DecisionTree/md/_Funds_network.md';
import _swap_error from 'raw-loader!@/data/DecisionTree/md/_swap_error.md';
import _dapp_MakerDAO from 'raw-loader!@/data/DecisionTree/md/_dapp_MakerDAO.md';
import _dapp_other from 'raw-loader!@/data/DecisionTree/md/_dapp_other.md';
import _buy_bug from 'raw-loader!@/data/DecisionTree/md/_buy_bug.md';
import _suggestions from 'raw-loader!@/data/DecisionTree/md/_suggestions.md';
import _not_listed from 'raw-loader!@/data/DecisionTree/md/_not_listed.md';

export default {
  /*
  =====================================================================================
  ROOT
  =====================================================================================
  */

  ROOT: {
    title: 'What issue are you having?',
    subtitle: '',
    nosearch: true,
    sub: [
      'Cant_access_wallet',
      'Cant_find_address',
      'Funds_missing',
      'Cant_send_tx',
      'Making_swap',
      'Using_dapp',
      'Buying_ETH',
      'Other'
    ]
  },

  /*
  =====================================================================================
  I can't access my wallet
  =====================================================================================
  */

  Cant_access_wallet: {
    title: "I can't access my wallet",
    subtitle: '',
    sub: [
      'Access_hardware_wallet',
      'Access_software_wallet',
      'Using_MEWconnect_access',
      'Using_CX_access',
      'Using_MM_access'
    ]
  },

  /*
  Accessing via Hardware 
  */

  Access_hardware_wallet: {
    title: "I'm using a hardware wallet",
    subtitle: '(Ledger, Trezor, etc.)',
    sub: ['Access_Ledger', 'Access_Trezor', 'Access_other']
  },

  Access_Ledger: {
    title: "I'm using a Ledger",
    subtitle: '',
    md: _Access_Ledger
  },

  Access_Trezor: {
    title: "I'm using a Trezor",
    subtitle: '',
    md: _Access_Trezor
  },

  Access_other: {
    title: "I'm using something else",
    subtitle: '(Bitbox, Secalot, Keepkey, etc.)',
    md: _Access_other
  },

  /*
  Accessing via Software 
  */

  Access_software_wallet: {
    title: "I'm using a software wallet",
    subtitle: '(Mnemonic phrase, Keystore file, Private key..)',
    sub: ['Access_phrase', 'Access_file', 'Access_key']
  },

  Access_phrase: {
    title: "I'm using a Mnemonic Phrase",
    subtitle: '',
    md: _Access_phrase
  },

  Access_file: {
    title: "I'm using a Keystore File",
    subtitle: '',
    md: _Access_file
  },

  Access_key: {
    title: "I'm using a Private Key",
    subtitle: '',
    md: _Access_key
  },

  /*
  Accessing via MEWconnect
  */

  Using_MEWconnect_access: {
    title: "I'm using MEWconnect",
    subtitle: '',
    sub: ['Cant_scan_access', 'Forgot_pass_access']
  },

  Cant_scan_access: {
    title: "I can't scan the QR code with my phone camera",
    subtitle: '',
    md: _Cant_scan_access
  },

  Forgot_pass_access: {
    title: 'I forgot my password',
    subtitle: '',
    md: _Forgot_pass_access
  },

  /*
  Accessing via MEW CX 
  */

  Using_CX_access: {
    title: "I'm using MEW CX",
    subtitle: '',
    md: _Using_CX_access
  },

  /*
  Accessing via MetaMask
  */

  Using_MM_access: {
    title: "I'm using MetaMask",
    subtitle: '',
    md: _Using_MM_access
  },

  /*
  =====================================================================================
  I can't find my wallet address
  =====================================================================================
  */

  Cant_find_address: {
    title: "I can't find my wallet address",
    subtitle: '',
    sub: [
      'Find_hardware',
      'Find_software',
      'Find_MEWconnect',
      'Find_CX',
      'Find_MM'
    ]
  },

  /*
  Finding Hardware address
  */

  Find_hardware: {
    title: "I'm using a hardware wallet",
    subtitle: '(Ledger, Trezor, etc.)',
    sub: ['Find_Ledger', 'Find_Trezor', 'Find_other']
  },

  Find_Ledger: {
    title: "I'm using a Ledger",
    subtitle: '',
    md: _Find_Ledger
  },

  Find_Trezor: {
    title: "I'm using a Trezor",
    subtitle: '',
    md: _Find_Trezor
  },

  Find_other: {
    title: "I'm using something else",
    subtitle: '(Bitbox, Secalot, Keepkey, etc.)',
    md: _Find_other
  },

  /*
  Finding Software address
  */

  Find_software: {
    title: "I'm using a software wallet",
    subtitle: '(Mnemonic phrase, Keystore file, Private key..)',
    sub: ['Find_phrase', 'Find_file', 'Find_key']
  },

  Find_phrase: {
    title: "I'm accessing with my Mnemonic Phrase",
    subtitle: '',
    sub: ['created_on_MEW', 'created_other']
  },

  created_on_MEW: {
    title: 'I created the phrase on MEW',
    subtitle: '',
    md: _created_on_MEW
  },

  created_other: {
    title: 'I created the phrase somewhere else',
    subtitle: '(MEWconnect, Another wallet, etc.)',
    md: _created_other
  },

  Find_file: {
    title: "I'm accessing with my Keystore File",
    subtitle: '',
    md: _Find_file
  },

  Find_key: {
    title: "I'm accessing with my Private Key",
    subtitle: '',
    md: _Find_key
  },

  /*
  Finding MEWconnect address
  */

  Find_MEWconnect: {
    title: "I'm using MEWconnect",
    subtitle: '',
    md: _Find_MEWconnect
  },

  /*
  Finding MEW CX address
  */

  Find_CX: {
    title: "I'm using MEW CX",
    subtitle: '',
    md: _Find_CX
  },

  /*
  Finding MetaMask address
  */

  Find_MM: {
    title: "I'm using MetaMask",
    subtitle: '',
    md: _Find_MM
  },

  /*
  =====================================================================================
  My funds are missing
  =====================================================================================
  */

  Funds_missing: {
    title: 'My funds are missing',
    subtitle: '',
    sub: ['Funds_from_MEW', 'Funds_to_MEW', 'Funds_gone', 'Funds_other']
  },

  /*
  Sent funds from MEW -> wallet
  */

  Funds_from_MEW: {
    title: 'I sent funds from MEW to another wallet',
    subtitle: '',
    sub: ['Saved_hash', 'No_hash']
  },

  Saved_hash: {
    title: 'I saved my transaction hash',
    subtitle: '',
    md: _Saved_hash
  },

  No_hash: {
    title: 'I did not save my transaction hash',
    subtitle: '',
    md: _No_hash
  },

  /*
  Sent funds from wallet -> MEW
  */

  Funds_to_MEW: {
    title: "I'm expecting to receive funds from another wallet",
    subtitle: '',
    sub: ['Given_hash', 'Notgiven_hash', 'Tokens_custom']
  },

  Given_hash: {
    title: "I've been given a transaction hash",
    subtitle: '',
    md: _Given_hash
  },

  Notgiven_hash: {
    title: 'I have not been given a transaction hash',
    subtitle: '',
    md: _Notgiven_hash
  },

  Tokens_custom: {
    title: 'My tokens show in my wallet on EthVM, but I cannot see them on MEW',
    subtitle: '',
    md: _Tokens_custom
  },

  /*
  Funds gone, no tx
  */

  Funds_gone: {
    title: "I did not send funds from MEW, but they're gone",
    subtitle: '',
    sub: ['Recognize_address', 'Different_address']
  },

  Recognize_address: {
    title: 'When I unlock my wallet, I recognize the public address',
    subtitle: '(0x...)',
    md: _Recognize_address
  },

  Different_address: {
    title: 'When I unlock my wallet, I see an unfamiliar address',
    subtitle: '(0x...)',
    md: _Different_address
  },

  /*
  Funds non-Ethereum
  */

  Funds_other: {
    title: "I'm expecting non-Ethereum funds",
    subtitle: '(ETC, CLO, EXP, MIX, PIRL, TOMO, etc.)',
    md: _Funds_network
  },

  /*
  =====================================================================================
  Can't send transaction
  =====================================================================================
  */

  Cant_send_tx: {
    title: "I can't send a transaction",
    subtitle: '',
    sub: ['tx_bug', 'tx_error', 'tx_other']
  },

  tx_bug: {
    title: 'There is a bug with the interface preventing me',
    subtitle: '',
    md: _tx_bug
  },

  tx_error: {
    title: 'I see an error',
    subtitle: '',
    md: _tx_error
  },

  tx_other: {
    title: 'My reason is not listed',
    subtitle: '',
    md: _tx_other
  },

  /*
  =====================================================================================
  Trying to swap
  =====================================================================================
  */

  Making_swap: {
    title: "I'm trying to make a swap",
    subtitle: '',
    sub: ['fiat_to_crypto', 'crypto_to_fiat', 'swap_done', 'swap_fail']
  },

  fiat_to_crypto: {
    title: "I'm swapping fiat for crypto",
    subtitle: '(USD$ -> ETH/BTC, etc.)',
    sub: ['Buying_ETH']
  },

  crypto_to_fiat: {
    title: "I'm swapping crypto for fiat",
    subtitle: '(ETH/BTC -> USD$, etc.)',
    md: _bity
  },

  swap_done: {
    title: "The swap went through, but I don't see my funds",
    subtitle: '',
    sub: ['kyber', 'bity', 'changelly']
  },

  kyber: {
    title: "I'm using Kyber Network",
    subtitle: '',
    md: _kyber
  },

  bity: {
    title: "I'm using Bity",
    subtitle: '',
    md: _bity
  },

  changelly: {
    title: "I'm using Changelly",
    subtitle: '',
    md: _changelly
  },

  swap_fail: {
    title: 'I could not get the swap to go through',
    subtitle: '',
    sub: ['swap_bug', 'swap_error']
  },

  swap_bug: {
    title: 'There is a bug with the interface preventing me',
    subtitle: '',
    md: _tx_bug
  },

  swap_error: {
    title: 'I get an error',
    subtitle: '',
    md: _swap_error
  },

  /*
  =====================================================================================
  Trying to use DApp
  =====================================================================================
  */

  Using_dapp: {
    title: "I'm trying to use a DApp",
    subtitle: '',
    sub: ['dapp_MakerDAO', 'dapp_other']
  },

  dapp_MakerDAO: {
    title: 'MakerDAO',
    subtitle: '',
    md: _dapp_MakerDAO
  },

  dapp_other: {
    title: 'Other',
    subtitle: '(ENS, SafeSend, etc.)',
    md: _dapp_other
  },

  /*
  =====================================================================================
  Trying to buy ETH
  =====================================================================================
  */

  Buying_ETH: {
    title: "I'm trying to buy ETH",
    subtitle: '',
    sub: ['buy_bug', 'buy_fail']
  },

  buy_bug: {
    title: 'There is a bug preventing me',
    subtitle: '',
    md: _buy_bug
  },

  buy_fail: {
    title: 'I completed the process, but do not see my ETH',
    subtitle: '',
    md: _simplex
  },

  /*
  =====================================================================================
  Not listed / Other
  =====================================================================================
  */

  Other: {
    title: "It's an issue that isn't listed",
    subtitle: '',
    sub: ['suggestions', 'not_listed']
  },

  suggestions: {
    title: 'I have suggestions for improvement',
    subtitle: '',
    md: _suggestions
  },

  not_listed: {
    title: "My issue wasn't listed",
    subtitle: '',
    md: _not_listed
  }
};
