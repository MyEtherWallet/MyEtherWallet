// this is based off of current v6 implementation

import type { Address } from "@ethereumjs/util";

// this may/should change once further refactoring is done
type MEWTransaction = {
  chainId: number;
  data: string;
  from: string;
  gas: string;
  gasLimit: string;
  gasPrice: string;
  network: string;
  nonce: string;
  r: undefined | Uint8Array;
  s: undefined | Uint8Array;
  to: string;
  transactionFee: string;
  v: undefined | Uint8Array;
  value: string;
}

type Transaction = {
  to?: Address | undefined;
  value: bigint;
  data: Uint8Array;
  common: {
    chainId: () => bigint;
  };
  nonce: bigint;
  gasLimit: bigint;
  gas?: bigint;
  maxFeePerGas?: bigint;
  gasPrice?: bigint | undefined;
  hash: () => Uint8Array;
  serialize: () => Uint8Array;
  v?: bigint | undefined;
  r?: bigint | undefined;
  s?: bigint | undefined;
}

type CreatedWallet = {
  walletJson?: V3Keystore;
}

type CipherParams = {
  iv: string;
}

type KdfParams = {
  dklen: number;
  n: number;
  p: number;
  r: number;
  salt: string;
}

type Crypto = {
  cipher: string;
  ciphertext: string;
  cipherparams: CipherParams;
  kdf: string;
  kdfparams: KdfParams;
  mac: string;
}

type EthSaleKeystore = {
  encseed: string;
  ethaddr: string;
  btcaddr: string;
  email: string;
}

type V3Keystore = {
  crypto: Crypto;
  Crypto: Crypto;
  id: string;
  version: number;
}

type MEWKeystore = {
  privKey: string;
  publisher: string;
}

type EtherWalletOptions = {
  address: string;
  encrypted: boolean;
  locked: boolean;
  hash: string;
  private: string;
  public: string;
}

export type {
  Transaction,
  CreatedWallet,
  EthSaleKeystore,
  V3Keystore,
  MEWKeystore,
  EtherWalletOptions,
  MEWTransaction
}