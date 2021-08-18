import Wallet from 'ethereumjs-wallet';
import walletConfigs from './walletConfigs';
import { bufferToInt } from 'ethereumjs-util';
import sanitizeHex from '@/core/helpers/sanitizeHex';
/* These needs to be changed further due to the new async library */
const fromMyEtherWalletV2 = json => {
  if (json.privKey.length !== 64) {
    throw new Error('Invalid private key length');
  }
  const privKey = new Buffer(json.privKey, 'hex');
  return new Wallet(privKey);
};
const getWalletFromPrivKeyFile = (jsonfile, password) => {
  2;
  if (jsonfile.encseed != null) return Wallet.fromEthSale(jsonfile, password);
  else if (jsonfile.Crypto != null || jsonfile.crypto != null)
    return Wallet.fromV3(jsonfile, password, true);
  else if (jsonfile.hash != null)
    return Wallet.ThirdParty.fromEtherWallet(jsonfile, password);
  else if (jsonfile.publisher == 'MyEtherWallet')
    return fromMyEtherWalletV2(jsonfile);
  throw new Error('Invalid Wallet file');
};

const createKeystore = password => {
  const createdWallet = {};
  const wallet = new Wallet.generate();
  createdWallet.walletJson = wallet.toV3(password, {
    kdf: walletConfigs.kdf,
    n: walletConfigs.n
  });
  createdWallet.name = wallet.getV3Filename();
  return createdWallet;
};
const unlockKeystore = async (file, password) => {
  const newFile = {};
  // Small hack because non strict wasn't working..
  Object.keys(file).forEach(key => {
    newFile[key.toLowerCase()] = file[key];
  });

  return getWalletFromPrivKeyFile(newFile, password);
};

/* End Comment */

const walletRequirePass = ethjson => {
  if (!ethjson) return false;
  if (ethjson.encseed != null) return true;
  else if (ethjson.Crypto != null || ethjson.crypto != null) return true;
  else if (ethjson.hash != null && ethjson.locked) return true;
  else if (ethjson.hash != null && !ethjson.locked) return false;
  else if (ethjson.publisher == 'MyEtherWallet' && !ethjson.encrypted)
    return false;
  return true;
};

const getBufferFromHex = hex => {
  hex = sanitizeHex(hex);
  const _hex = hex.toLowerCase().replace('0x', '');
  return new Buffer(_hex, 'hex');
};
const padLeftEven = hex => {
  hex = hex.length % 2 != 0 ? '0' + hex : hex;
  return hex;
};
const bufferToHex = buffer => {
  return '0x' + buffer.toString('hex');
};
const getHexTxObject = tx => {
  return {
    to: sanitizeHex(tx.to.toString('hex')),
    value: sanitizeHex(tx.value.toString('hex')),
    data: sanitizeHex(tx.data.toString('hex')),
    chainId: tx.getChainId(),
    nonce: sanitizeHex(tx.nonce.toString('hex')),
    gasLimit: sanitizeHex(tx.gasLimit.toString('hex')),
    gasPrice: sanitizeHex(tx.gasPrice.toString('hex'))
  };
};
const getSignTransactionObject = tx => {
  return {
    rawTransaction: bufferToHex(tx.serialize()),
    tx: {
      nonce: bufferToHex(tx.nonce),
      gasPrice: tx.gasPrice
        ? bufferToHex(tx.gasPrice)
        : bufferToHex(tx.maxFeePerGas),
      maxFeePerGas: tx.maxFeePerGas ? bufferToHex(tx.maxFeePerGas) : null,
      maxPriorityFeePerGas: tx.maxPriorityFeePerGas
        ? bufferToHex(tx.maxPriorityFeePerGas)
        : null,
      gas: tx.gasLimit ? bufferToHex(tx.gasLimit) : bufferToHex(tx.gas),
      to: bufferToHex(tx.to),
      value: bufferToHex(tx.value),
      input: bufferToHex(tx.data),
      v: bufferToHex(tx.v),
      r: bufferToHex(tx.r),
      s: bufferToHex(tx.s),
      hash: bufferToHex(tx.hash())
    }
  };
};
const calculateChainIdFromV = v => {
  const sigV = bufferToInt(v);
  let chainId = Math.floor((sigV - 35) / 2);
  if (chainId < 0) chainId = 0;
  return chainId;
};

export {
  getBufferFromHex,
  bufferToHex,
  getSignTransactionObject,
  sanitizeHex,
  padLeftEven,
  getHexTxObject,
  calculateChainIdFromV,
  walletRequirePass,
  createKeystore,
  unlockKeystore
};
