import { Wallet, thirdparty } from "@ethereumjs/wallet";
import { bigIntToHex, hexToBigInt } from "@ethereumjs/util";
import { toBigInt, toWei } from "web3-utils";
import { Hardfork, Common } from "@ethereumjs/common";

import type { EthSaleKeystore, V3Keystore, MEWKeystore, Transaction, EtherWalletOptions, CreatedWallet } from "./types";

/* ***********************  */
// maybe reused in the future
// consider moving to a common file

const config = {
  kdf: 'scrypt',
  n: 131072
}

const GAS_PRICE_TYPES = {
  ECONOMY: 'economy',
  REGULAR: 'regular',
  FAST: 'fast'
}

const commonGenerator = (network: { type: { chainID: number } }) => {
  return Common.custom({
    chainId: network.type.chainID,
    hardfork: Hardfork.London
  })
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

const getBaseFeeBasedOnType = (baseFeeBN: bigint, gasPriceType: string) => {
  switch (gasPriceType) {
    case GAS_PRICE_TYPES.ECONOMY:
      return baseFeeBN * BigInt(1.25);
    case GAS_PRICE_TYPES.REGULAR:
      return baseFeeBN * BigInt(1.5);
    case GAS_PRICE_TYPES.FAST:
      return baseFeeBN * BigInt(1.75);
    default:
      return baseFeeBN;
  }
};


const getPriorityFeeBasedOnType = (priorityFeeBN: bigint, gasPriceType: string) => {
  const minFee = getMinPriorityFee();
  const mediumTip = priorityFeeBN;
  let returnVal;
  switch (gasPriceType) {
    case GAS_PRICE_TYPES.ECONOMY:
      returnVal = mediumTip * BigInt(0.8);
      break;
    case GAS_PRICE_TYPES.REGULAR:
      returnVal = mediumTip;
      break;
    case GAS_PRICE_TYPES.FAST:
      returnVal = mediumTip * BigInt(1.25);
      break;
    default:
      returnVal = minFee;
  }
  if (returnVal < minFee) return minFee;
  return returnVal;
};

const getBufferFromHex = (hex: string) => {
  hex = sanitizeHex(hex);
  return new Buffer(hex.toLowerCase().replace('0x', ''), 'hex');
}

const bufferToHex = (buffer: Buffer) => {
  const converted = buffer.toString('hex');
  return converted.substr(0, 2) === '0x' ? converted : `0x${converted}`;
}

const uint8ToHex = (uint8: Uint8Array) => {
  return Buffer.from(uint8).toString('hex');
}

const bufferToInt = (buffer: Buffer) => {
  return parseInt(buffer.toString('hex'), 16);
}

const getHexTxObject = (tx: Transaction) => {
  return {
    to: sanitizeHex(tx.to),
    value: sanitizeHex(bigIntToHex(tx.value)),
    data: sanitizeHex(uint8ToHex(tx.data)),
    chainId: sanitizeHex(bigIntToHex(tx.common.chainId())),
    nonce: sanitizeHex(bigIntToHex(tx.nonce)),
    gasLimit: sanitizeHex(bigIntToHex(tx.gasLimit)),
    gasPrice: sanitizeHex(bigIntToHex(tx.gasPrice))
  };
}

const getSignTransactionObject = (tx: Transaction) => {
  return {
    rawTransction: uint8ToHex(tx.serialize()),
    tx: {
      nonce: bigIntToHex(tx.nonce),
      gasPrice: tx.gasPrice ? bigIntToHex(tx.gasPrice) : bigIntToHex(tx.maxFeePerGas as bigint),
      gas: tx.gasLimit ? bigIntToHex(tx.gasLimit) : bigIntToHex(tx.gas as bigint),
      to: tx.to ? tx.to : '',
      value: bigIntToHex(tx.value),
      input: uint8ToHex(tx.data),
      v: bigIntToHex(tx.v),
      r: bigIntToHex(tx.r),
      s: bigIntToHex(tx.s),
      hash: uint8ToHex(tx.hash())
    }
  }
}

const eip1559Params = (gasPrice: bigint, feeMarket: { maxPriorityFeePerGas: bigint, baseFeePerGas: bigint, maxFeePerGas: bigint }) => {
  const tip = gasPrice - feeMarket.baseFeePerGas;
  const fees = {
    maxPriorityFeePerGas: tip < getMinPriorityFee() ? bigIntToHex(getMinPriorityFee()) : tip > toBigInt(feeMarket.maxPriorityFeePerGas) ? bigIntToHex(toBigInt(feeMarket.maxPriorityFeePerGas)) : bigIntToHex(tip),
    maxFeePerGas: gasPrice
  }

  if (toBigInt(fees.maxPriorityFeePerGas) > toBigInt(fees.maxFeePerGas)) {
    fees.maxPriorityFeePerGas = bigIntToHex(toBigInt(fees.maxFeePerGas));
  }
  return fees;
}

const calculateChainIdFromV = (v: string) => {
  const sigV = hexToBigInt(v);
  const chainId = Math.floor(Number((sigV - BigInt(35)) / BigInt(2)));
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
  if ((json as EthSaleKeystore).encseed != null) { return Wallet.fromEthSale(json as EthSaleKeystore, password) }
  else if ((json as V3Keystore).Crypto != null || (json as V3Keystore).crypto != null) { return Wallet.fromV3(json as V3Keystore, password, true) }
  else if ((json as EtherWalletOptions).hash != null) { return thirdparty.fromEtherWallet(json as EtherWalletOptions, password); }
  else if ((json as MEWKeystore).publisher == 'MyEtherwallet') { return fromMyEtherWalletV2(json as MEWKeystore); }
  else throw new Error('Invalid JSON Keystore');
}


const unlockKeystore = async (file: EthSaleKeystore | V3Keystore | MEWKeystore | EtherWalletOptions, pw: string) => {
  const newFile = {};
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key];
  });
  return getWalletFromPrivKeyFile(newFile, pw);
}
export type {
  EthSaleKeystore,
  V3Keystore,
  MEWKeystore
}
export { unlockKeystore, getMinPriorityFee, getBufferFromHex, bufferToHex, bufferToInt, getHexTxObject, getSignTransactionObject, eip1559Params, calculateChainIdFromV, commonGenerator, sanitizeHex, getPriorityFeeBasedOnType, getBaseFeeBasedOnType };