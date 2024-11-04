import { Wallet, thirdparty } from "@ethereumjs/wallet";
import { bigIntToHex } from '@ethereumjs/util';
import { toBigInt, toWei } from "web3-utils";

/* ***********************  */
// maybe reused in the future
// consider moving to a common file
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

const config = {
  kdf: 'scrypt',
  n: 131072
}


const padLeftEven = (hex: string) => {
  return hex.length % 2 !== 0 ? `0${hex}` : hex;
}

const sanitizeHex = (hex: string) => {
  hex = hex.substring(0, 2) === '0x' ? hex.substring(2) : hex;
  return `0x${padLeftEven(hex)}`;
}

const getMinPriorityFee = () => {
  return toBigInt(toWei('1.25', 'gwei'));
}

const getBufferFromHex = (hex: string) => {
  hex = sanitizeHex(hex);
  return new Buffer(hex.toLowerCase().replace('0x', ''), 'hex');
}

const bufferToHex = (buffer: Buffer) => {
  const converted = buffer.toString('hex');
  return converted.substr(0, 2) === '0x' ? converted : `0x${converted}`;
}

const bufferToInt = (buffer: Buffer) => {
  return parseInt(buffer.toString('hex'), 16);
}

const getHexTxObject = (tx: { to: Buffer, value: Buffer, data: Buffer, common: { chainId: () => number }, nonce: Buffer, gasLimit: Buffer, gasPrice: Buffer }) => {
  return {
    to: sanitizeHex(tx.to.toString('hex')),
    value: sanitizeHex(tx.value.toString('hex')),
    data: sanitizeHex(tx.data.toString('hex')),
    chainId: tx.common.chainId(),
    nonce: sanitizeHex(tx.nonce.toString('hex')),
    gasLimit: sanitizeHex(tx.gasLimit.toString('hex')),
    gasPrice: sanitizeHex(tx.gasPrice.toString('hex'))
  };
}

const getSignTransactionObject = (tx: { serialize: () => Buffer, v: Buffer, r: Buffer, s: Buffer, hash: () => Buffer, to: Buffer, value: Buffer, data: Buffer, common: { chainId: () => number }, nonce: Buffer, gas: Buffer, gasLimit: Buffer, gasPrice: Buffer, maxFeePerGas: Buffer }) => {
  return {
    rawTransction: bufferToHex(tx.serialize()),
    tx: {
      nonce: bufferToHex(tx.nonce),
      gasPrice: tx.gasPrice ? bufferToHex(tx.gasPrice) : bufferToHex(tx.maxFeePerGas),
      gas: tx.gasLimit ? bufferToHex(tx.gasLimit) : bufferToHex(tx.gas),
      to: tx.to ? bufferToHex(tx.to) : '',
      value: bufferToHex(tx.value),
      input: bufferToHex(tx.data),
      v: bufferToHex(tx.v),
      r: bufferToHex(tx.r),
      s: bufferToHex(tx.s),
      hash: bufferToHex(tx.hash())
    }
  }
}

const eip1559Params = (gasPrice: string, feeMarket: { maxPriorityFeePerGas: string, baseFeePerGas: string, maxFeePerGas: string }) => {
  const tip = toBigInt(gasPrice) - toBigInt(feeMarket.baseFeePerGas);
  const fees = {
    maxPriorityFeePerGas: tip < getMinPriorityFee() ? bigIntToHex(getMinPriorityFee()) : tip > toBigInt(feeMarket.maxPriorityFeePerGas) ? bigIntToHex(toBigInt(feeMarket.maxPriorityFeePerGas)) : bigIntToHex(tip),
    maxFeePerGas: gasPrice
  }

  if (toBigInt(fees.maxPriorityFeePerGas) > toBigInt(fees.maxFeePerGas)) {
    fees.maxPriorityFeePerGas = bigIntToHex(toBigInt(fees.maxFeePerGas));
  }
  return fees;
}

const calculateChainIdFromV = (v: Buffer) => {
  const sigV = bufferToInt(v);
  const chainId = Math.floor((sigV - 35) / 2);
  if (chainId < 0) return 0;
  return chainId
}

/* ***********************  */

const fromMyEtherWalletV2 = (json: MEWKeystore) => {
  if (json.privKey.length !== 64) {
    throw new Error('Invalid private key length');
  }
  const privKey = Buffer.from(json.privKey, 'hex');
  return new Wallet(privKey);
}

const getWalletFromPrivKeyFile = (json: EthSaleKeystore | V3Keystore | MEWKeystore | EtherWalletOptions, password: string) => {
  if ((json as EthSaleKeystore).encseed !== null) return Wallet.fromEthSale(json as EthSaleKeystore, password);
  else if ((json as V3Keystore).Crypto !== null || (json as V3Keystore).crypto !== null) return Wallet.fromV3(json as V3Keystore, password, true);
  else if ((json as EtherWalletOptions).hash !== null) return thirdparty.fromEtherWallet(json as EtherWalletOptions, password);
  else if ((json as MEWKeystore).publisher === 'MyEtherwallet') return fromMyEtherWalletV2(json as MEWKeystore);
  else throw new Error('Invalid JSON Keystore');
}

const createKeystore = async (pw: string): Promise<CreatedWallet> => {
  const createdWallet: CreatedWallet = {};
  const wallet = Wallet.generate();
  createdWallet.walletJson = await wallet.toV3(pw, config) as V3Keystore;
  return createdWallet;
}

const unlockKeystore = async (file: EthSaleKeystore | V3Keystore | MEWKeystore | EtherWalletOptions, pw: string) => {
  // const newFile = {};
  // Object.keys(file).forEach(key => {
  //   newFile[key] = file[key];
  // });
  return getWalletFromPrivKeyFile(file, pw);
}

export { createKeystore, unlockKeystore, getMinPriorityFee, getBufferFromHex, bufferToHex, bufferToInt, getHexTxObject, getSignTransactionObject, eip1559Params, calculateChainIdFromV };