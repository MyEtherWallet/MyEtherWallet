import Ledger from '@ledgerhq/hw-app-eth';
import { byContractAddressAndChainId } from '@ledgerhq/hw-app-eth/erc20';
import { Transaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import webUsbTransport from '@ledgerhq/hw-transport-webusb';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import bip44Paths from '@/modules/access-wallet/hardware/handlers/bip44';
import HDWalletInterface from '@/modules/access-wallet/common/HDWalletInterface';
import * as HDKey from 'hdkey';
import platform from 'platform';
import store from '@/core/store';
import commonGenerator from '@/core/helpers/commonGenerator';
import {
  getSignTransactionObject,
  getBufferFromHex,
  sanitizeHex,
  calculateChainIdFromV
} from '@/modules/access-wallet/common/helpers';
import toBuffer from '@/core/helpers/toBuffer';
import errorHandler from './errorHandler';
import Vue from 'vue';
import ledger from '@/assets/images/icons/wallets/ledger.svg';
import { bnToHex, rlp } from 'ethereumjs-util';
import { toBN } from 'web3-utils';

const NEED_PASSWORD = false;

class ledgerWallet {
  constructor() {
    this.identifier = WALLET_TYPES.LEDGER;
    this.isHardware = true;
    this.needPassword = NEED_PASSWORD;
    this.supportedPaths = bip44Paths[WALLET_TYPES.LEDGER];
    this.meta = {
      name: 'Ledger',
      img: {
        type: 'img',
        value: ledger
      }
    };
  }
  async init(basePath) {
    this.basePath = basePath ? basePath : this.supportedPaths[0].path;
    this.isHardened = this.basePath.split('/').length - 1 === 2;
    this.transport = await getLedgerTransport();
    this.ledger = new Ledger(this.transport);
    if (!this.isHardened) {
      const rootPub = await getRootPubKey(this.ledger, this.basePath);
      this.hdKey = new HDKey();
      this.hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      this.hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
    }
  }
  async getAccount(idx) {
    let derivedKey, accountPath;
    if (this.isHardened) {
      const rootPub = await getRootPubKey(
        this.ledger,
        this.basePath + '/' + idx + "'"
      );
      const hdKey = new HDKey();
      hdKey.publicKey = Buffer.from(rootPub.publicKey, 'hex');
      hdKey.chainCode = Buffer.from(rootPub.chainCode, 'hex');
      derivedKey = hdKey.derive('m/0/0');
      accountPath = this.basePath + '/' + idx + "'" + '/0/0';
    } else {
      derivedKey = this.hdKey.derive('m/' + idx);
      accountPath = this.basePath + '/' + idx;
    }
    const txSigner = async txParams => {
      const networkId = store.getters['global/network'].type.chainID;
      const tokenInfo = byContractAddressAndChainId(txParams.to, networkId);
      if (tokenInfo) await this.ledger.provideERC20TokenInformation(tokenInfo);
      const legacySigner = async _txParams => {
        const tx = new Transaction(_txParams, {
          common: commonGenerator(store.getters['global/network'])
        });
        const message = tx.getMessageToSign(false);
        const serializedMessage = rlp.encode(message);
        const result = await this.ledger.signTransaction(
          accountPath,
          serializedMessage.toString('hex')
        );
        // EIP155 support. check/recalc signature v value.
        const rv = parseInt(result.v, 16);
        let cv = networkId * 2 + 35;
        if (rv !== cv && (rv & cv) !== rv) {
          cv += 1; // add signature v bit.
        }
        _txParams.v = '0x' + cv.toString(16);
        _txParams.r = '0x' + result.r;
        _txParams.s = '0x' + result.s;
        const signedChainId = calculateChainIdFromV(_txParams.v);
        if (signedChainId !== networkId)
          throw new Error(
            Vue.$i18n.t('errorsGlobal.invalid-network-id-sig', {
              got: signedChainId,
              expected: networkId
            }),
            'InvalidNetworkId'
          );
        return getSignTransactionObject(Transaction.fromTxData(_txParams));
      };
      if (store.getters['global/isEIP1559SupportedNetwork']) {
        const feeMarket = store.getters['global/gasFeeMarketInfo'];
        const _txParams = Object.assign(
          {
            maxPriorityFeePerGas: bnToHex(
              toBN(txParams.gasPrice).sub(feeMarket.baseFeePerGas)
            ),
            maxFeePerGas: txParams.gasPrice
          },
          txParams
        );
        delete _txParams.gasPrice;
        const tx = FeeMarketEIP1559Transaction.fromTxData(_txParams, {
          common: commonGenerator(store.getters['global/network'])
        });
        const message = tx.getMessageToSign(false);
        try {
          // eslint-disable-next-line no-unused-vars
          const result = await this.ledger.signTransaction(
            accountPath,
            message.toString('hex')
          );
          _txParams.v = '0x' + result.v;
          _txParams.r = '0x' + result.r;
          _txParams.s = '0x' + result.s;
          return getSignTransactionObject(
            FeeMarketEIP1559Transaction.fromTxData(_txParams)
          );
        } catch (e) {
          //old ledger eth app version
          if (e.message === 'Ledger device: UNKNOWN_ERROR (0x6501)')
            return legacySigner(txParams);
          throw e;
        }
      } else {
        return legacySigner(txParams);
      }
    };
    const msgSigner = async msg => {
      const result = await this.ledger.signPersonalMessage(
        accountPath,
        toBuffer(msg).toString('hex')
      );
      const v = parseInt(result.v, 10) - 27;
      const vHex = sanitizeHex(v.toString(16));
      return Buffer.concat([
        getBufferFromHex(result.r),
        getBufferFromHex(result.s),
        getBufferFromHex(vHex)
      ]);
    };
    const displayAddress = async () => {
      await this.ledger.getAddress(accountPath, true, false);
    };
    return new HDWalletInterface(
      accountPath,
      derivedKey.publicKey,
      this.isHardware,
      this.identifier,
      errorHandler,
      txSigner,
      msgSigner,
      displayAddress,
      this.meta
    );
  }
  getCurrentPath() {
    return this.basePath;
  }
  getSupportedPaths() {
    return this.supportedPaths;
  }
}
const createWallet = async basePath => {
  const _ledgerWallet = new ledgerWallet();
  await _ledgerWallet.init(basePath);
  return _ledgerWallet;
};
createWallet.errorHandler = errorHandler;

const isWebUsbSupported = async () => {
  const isSupported = await webUsbTransport.isSupported();
  return (
    isSupported && platform.os.family !== 'Windows' && platform.name !== 'Opera' // take it out later once the windows issue is fixed
  );
};

const getLedgerTransport = async () => {
  let transport;
  const support = await isWebUsbSupported();
  if (support) {
    transport = await webUsbTransport.create();
  } else {
    throw new Error('Browse doesnt support webusb');
  }
  return transport;
};

const getRootPubKey = async (_ledger, _path) => {
  const pubObj = await _ledger.getAddress(_path, false, true);
  return {
    publicKey: pubObj.publicKey,
    chainCode: pubObj.chainCode
  };
};

export default createWallet;
