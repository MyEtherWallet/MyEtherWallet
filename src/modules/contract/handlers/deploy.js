import BigNumber from 'bignumber.js';
import { toBN, toHex, toWei } from 'web3-utils';
import sanitizeHex from '@/core/helpers/sanitizeHex';
import * as ethUnit from 'ethjs-unit';
import { Transaction } from 'ethereumjs-tx';
import { bufferToHex, generateAddress, toBuffer } from 'ethereumjs-util';
import { isContractArgValid, createTypeValidatingProxy, validateABI } from './common';

export default class Deploy {
  constructor(abi, txByteCode, address, web3, gasPrice) {
    this.userAddress = address;
    this._address = '';
    this.web3 = web3;
    this.gasPrice = gasPrice;
    this.ABI = abi;
    this.constructorABI = null;
    this._constructorInputs = {};
    this.txByteCode = txByteCode;
    this.contractsDeployed = [];
    this.noConstructorInputs = false;
    this._abiConstructor();
  }

  _clear() {
    this.constructorABI = null;
    this._constructorInputs = {};
    this.txByteCode = null;
    this.noConstructorInputs = false;
    this.inputs = {};
    this.ABI = null;
    this.contractMethods = [];
  }

  reset() {
    this._clear();
    this._address = '';
  }

  _updateGasPrice(gasPrice) {
    this.gasPrice = gasPrice;
  }

  get _hasABI() {
    return validateABI(this.ABI);
  }

  get _abiValid() {
    return this._hasABI && typeof this.ABI === 'object';
  }

  get _byteCodeValid() {
    try {
      return this.txByteCode && this.txByteCode.substring(0, 2) === '0x';
    } catch (e) {
      return false;
    }
  }

  get _payableConstructor() {
    if (this.constructorABI) {
      return this.constructorABI.stateMutability
        ? this.constructorABI.stateMutability === 'payable'
        : this.constructorABI.payable;
    }
    return false;
  }

  get _canDeploy() {
    return (
      this._hasABI &&
      this._hasConstructorABI &&
      this.txByteCode !== null &&
      ((Object.values(this._constructorInputs).every(item => {
        return item.value !== null && item.valid;
      }) &&
        Object.values(this._constructorInputs).length > 0) ||
        this.noConstructorInputs)
    );
  }

  get _hasConstructorABI() {
    if (this.constructorABI) {
      return Object.keys(this.constructorABI).length > 0;
    }
    return false;
  }

  _setDeployArg(name, value) {
    this._constructorInputs[name].value = value;
  }

  _abiConstructor() {
    try {
      this._constructorInputs = {};
      if (this._hasABI && this._byteCodeValid) {
        this.ABI.forEach(item => {
          if (item.type === 'constructor') {
            this.constructorABI = item;
          }
        });
        if (
          this.constructorABI &&
          this.constructorABI.hasOwnProperty('inputs')
        ) {
          this.constructorABI.inputs.forEach(item => {
            const itemProxy = createTypeValidatingProxy(item);
            itemProxy.value = null;
            this._constructorInputs[item.name] = itemProxy;
          });
          if (this.constructorABI.inputs.length === 0) {
            this.noConstructorInputs = true;
          }
        }
      }
      return this._constructorInputs;
    } catch (e) {
      return {};
    }
  }
  _deploy(withValue, contractName) {
    return new Promise((resolve, reject) => {
      try {
        if (!this._canDeploy) return Promise.reject();
        const rawTx = {};
        if (this.constructorABI.payable && withValue)
          rawTx.value = toHex(toBN(toWei(withValue, 'ether')));
        else rawTx.value = '0x00';
        rawTx.data = this.txData();
        if (rawTx.data !== '0x') {
          this.sendTransaction(rawTx, contractName)
            .then(res => {
              resolve(res);
            })
            .catch(reject);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }
  get _deployArgs() {
    const _deployArgs = [];
    if (this.constructorABI) {
      this.constructorABI.inputs.forEach(item => {
        if (item.type.includes('[') && item.type.includes(']')) {
          const inputs = this._constructorInputs.hasOwnProperty(item.name)
            ? this._constructorInputs[item.name].value.replace(/\s/g, '')
            : '';
          const arr = inputs.split(',');
          _deployArgs.push(arr);
        } else {
          _deployArgs.push(this._constructorInputs[item.name].value);
        }
      });
    }
    return _deployArgs;
  }

  txData() {
    if (this._canDeploy) {
      return new this.web3.eth.Contract(this.ABI)
        .deploy({ data: this.txByteCode, arguments: this._deployArgs })
        .encodeABI();
    }

    return '0x';
  }
  async _estimateGas(params) {
    return this.web3.eth.estimateGas(params);
  }
  async _getNonce(address) {
    return this.web3.eth.getTransactionCount(address);
  }
  _getGasPrice() {
    return sanitizeHex(ethUnit.toWei(this.gasPrice, 'gwei').toString(16));
  }
  sendTransaction(tx, contractName) {
    let coinbase;
    return this.web3.eth
      .getCoinbase()
      .then(() => {
        coinbase = this.userAddress;
        return Promise.all([
          this._estimateGas({ from: coinbase, ...tx }),
          this._getNonce(coinbase)
        ]);
      })

      .then(results => {
        const _tx = new Transaction({
          from: coinbase,
          nonce: results[1],
          gasPrice: this._getGasPrice(),
          gasLimit: sanitizeHex(new BigNumber(results[0]).toString(16)),
          ...tx
        });
        const json = _tx.toJSON(true);
        delete json.to;
        json.from = coinbase;
        const contractAddr = bufferToHex(
          generateAddress(toBuffer(coinbase), toBuffer(results[1]))
        );
        this._address = contractAddr;
        // this.pushContractToStore(contractAddr, contractName); // TODO remove for new structure
        this.contractsDeployed.push(contractAddr);
        this._clear();
        return this.web3.eth.sendTransaction(json);
      });
  }


}
