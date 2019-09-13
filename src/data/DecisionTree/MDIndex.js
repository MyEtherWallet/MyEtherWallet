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

export default {
  /*
  =====================================================================================
  ROOT
  =====================================================================================
  */

  ROOT: {
    title: 'What issue are you having?',
    subtitle: '',
    sub: [
      'Cant_access_wallet',
      'Cant_find_address'
      /*
      'Funds_missing',
      'Cant_send_tx',
      'Making_swap',
      'Using_dapp',
      'Buying_ETH',
      'Other'
      */
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
  }

  /*
  =====================================================================================
  My funds are missing
  =====================================================================================
  */
};
