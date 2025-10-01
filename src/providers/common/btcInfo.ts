

import { payments, type PaymentCreator } from 'bitcoinjs-lib'

const { p2wpkh, p2pkh } = payments;
interface InfoTemplate {
  name: string
  network: {
    bip32: {
      public: number
      private: number
    }
    messagePrefix: string
    bech32: string
    pubKeyHash: number
    scriptHash: number
    wif: number
  }
  dustThreshold: number | null
  paymentType: PaymentCreator
  maxFeeRate: number
}

const bitcoinInfo: InfoTemplate = {
  name: "BTC",
  network: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4,
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80,
  },
  dustThreshold: null,
  paymentType: p2wpkh,
  maxFeeRate: 5000,
}

const bitcoinTestInfo: InfoTemplate = {
  name: "BTCTest",
  network: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394,
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef,
  },
  dustThreshold: null,
  paymentType: p2wpkh,
  maxFeeRate: 5000 * 2,
}

const dogecoinInfo: InfoTemplate = {
  name: "DOGE",
  network: {
    messagePrefix: '\x19Dogecoin Signed Message:\n',
    bech32: 'dc',
    bip32: {
      public: 0x02facafd,
      private: 0x02fac398,
    },
    pubKeyHash: 0x1e,
    scriptHash: 0x16,
    wif: 0x9e,
  },
  dustThreshold: null,
  paymentType: p2pkh,
  maxFeeRate: 100000 * 10,
}

const litecoinInfo: InfoTemplate = {
  name: "LTC",
  network: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bech32: 'ltc',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe,
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0,
  },
  dustThreshold: null,
  paymentType: p2wpkh,
  maxFeeRate: 5000 * 2,
}

export { bitcoinInfo, bitcoinTestInfo, type InfoTemplate, dogecoinInfo, litecoinInfo }