import { Transaction } from 'ethereumjs-tx';
import { hashPersonalMessage } from 'ethereumjs-util';
import * as bc from 'bc-vault-js';
import { BCVAULT as bcVault } from '../../bip44/walletTypes';
import HDWalletInterface from '@/wallets/HDWalletInterface';
import errorHandler from './errorHandler';
import BigNumber from 'bignumber.js';
import {
  getBufferFromHex,
  sanitizeHex,
  getSignTransactionObject,
  calculateChainIdFromV
} from '../../utils';
import commonGenerator from '@/helpers/commonGenerator';
import store from '@/store';
import { Toast, Misc } from '@/helpers';

const NEED_PASSWORD = false;

class BCVault {
  constructor() {
    this.identifier = bcVault;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.selectedAddress = '';
    this.bcWallet = new bc.BCJS(() => {});
    this.deviceNumber = null;
    this.bcWalletType = bc.WalletType.ethereum;
  }

  async init() {
    // fetch devices
    this.deviceNumber = await this.bcWallet.getDevices();
    // get wallet of first device and password
    // not sure if we want the users to pass this as a parameter or ask user
    // for which wallet to use
    await this.bcWallet.EnterGlobalPin(this.deviceNumber[0], this.bcWalletType);
    // get the wallet addresses for ethereum
    // allegedly deprecated
    const walletAddresses = await this.bcWallet.getWalletsOfType(
      this.deviceNumber[0],
      bc.WalletType.ethereum
    );
    // const walletAddresses = await this.bcWallet.getBatchWalletDetails(
    //   1,
    //   bc.WalletType.ethereum
    // );

    return walletAddresses;
  }

  getAccount(address) {
    this.selectedAddress = address;
    const path = null;
    const publickey = null;
    const txSigner = async tx => {
      tx = new Transaction(tx, {
        common: commonGenerator(store.state.main.network)
      });
      const newTx = Object.assign({}, tx);
      newTx['feeCount'] = new BigNumber(tx['gasLimit']).toNumber();
      newTx['feePrice'] = new BigNumber(tx['gasPrice']).toString();
      newTx['amount'] = new BigNumber(tx['value']).toString();
      if (tx.hasOwnProperty('nonce')) {
        newTx['advanced'] = {
          eth: {
            nonce: new BigNumber(tx['nonce']).toNumber()
          }
        };
      }

      delete newTx['gasLimit'];
      delete newTx['gasPrice'];
      delete newTx['value'];
      delete newTx['nonce'];
      delete newTx['common'];

      const networkId = tx.getChainId();
      const result = await this.bcWallet.GenerateTransaction(
        this.deviceNumber[0],
        this.bcWalletType,
        newTx
      );
      tx.v = getBufferFromHex(sanitizeHex(result.v));
      tx.r = getBufferFromHex(sanitizeHex(result.r));
      tx.s = getBufferFromHex(sanitizeHex(result.s));
      const signedChainId = calculateChainIdFromV(tx.v);
      if (signedChainId !== networkId)
        Toast.responseHandler(
          new Error(
            'Invalid networkId signature returned. Expected: ' +
              networkId +
              ', Got: ' +
              signedChainId,
            'InvalidNetworkId'
          ),
          false
        );
      return getSignTransactionObject(tx);
    };
    const msgSigner = async msg => {
      const hashedMsg = hashPersonalMessage(Misc.toBuffer(msg));
      const result = await this.bcWallet(
        this.deviceNumber,
        this.bcWalletType,
        this.selectedAddress,
        hashedMsg
      );
      return Buffer.concat([
        getBufferFromHex(sanitizeHex(result.r)),
        getBufferFromHex(sanitizeHex(result.s)),
        getBufferFromHex(sanitizeHex(result.v))
      ]);
    };
    return new HDWalletInterface(
      path,
      publickey,
      errorHandler,
      txSigner,
      msgSigner,
      address
    );
  }
}

const createWallet = async () => {
  const _bcvault = new BCVault();
  const addresses = await _bcvault.init();
  return addresses;
};

createWallet.errorHandler = errorHandler;

export default createWallet;
