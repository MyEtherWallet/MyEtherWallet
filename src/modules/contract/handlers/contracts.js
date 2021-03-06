import utils from 'web3-utils';
import validateHexString from '@/core/helpers/validateHexString';
import Method from './method';
import Deploy from './deploy';
import Web3 from 'web3';
import { validateABI, parseABI, isContractArgValid, getType } from './common';

export default class Contracts {
  constructor(address, web3, gasPrice, storeHandler) {
    this.userAddress = address;
    this.address = '';
    this.inputs = {};
    this.web3 = web3 || new Web3('HTTP://127.0.0.1:7545');
    this.gasPrice = gasPrice || 1;
    this.ABI = null;
    this.contractMethods = [];
    this.selectedMethod = { inputs: [] };
    this.storeContractAddress = storeHandler || function () {};
    this.noInputs = false;
    this._deployer = null;
    this.txByteCode = null;
    this.helpers = {
      validateABI,
      parseABI,
      isContractArgValid,
      getType
    };
  }

  clear() {
    this.txByteCode = null;
    this.ABI = null;
    this.address = '';
  }

  reset() {
    this.txByteCode = null;
    this.address = '';
    this.inputs = {};
    this.ABI = null;
    this.contractMethods = [];
    this.selectedMethod = { inputs: [] };
    this.contractMethodDetails = {};
    this._deployer = null;
  }

  updateGasPrice(gasPrice) {
    if (this._deployer) {
      this._deployer._updateGasPrice(gasPrice);
    }
    if (this.selectedMethod instanceof Method) {
      this.selectedMethod._updateGasPrice(this.gasPrice);
    }
    this.gasPrice = gasPrice;
  }

  static utils() {
    return {
      validateABI,
      parseABI,
      isContractArgValid,
      getType
    };
  }

  get hasABI() {
    try {
      return !!parseABI(this.ABI);
    } catch (e) {
      return false;
    }
  }

  get abiValid() {
    return this.hasABI && !!validateABI(this.ABI);
  }

  get byteCodeValid() {
    return !!this.txByteCode && this.txByteCode.substring(0, 2) === '0x';
  }

  get constructorInputs() {
    if (this._deployer) {
      return this._deployer._constructorInputs;
    }
    return {};
  }

  get hasContractAddress() {
    return this.address !== '' && utils.isAddress(this.address);
  }

  get contractActive() {
    return this.hasABI && this.hasContractAddress;
  }

  get payableConstructor() {
    if (this._deployer) {
      return this._deployer._payableConstructor;
    }
    return false;
  }

  get canDeploy() {
    if (this._deployer) {
      return this._deployer._canDeploy;
    }
    return false;
  }

  get hasConstructorABI() {
    if (this._deployer) {
      return this._deployer._hasConstructorABI;
    }
    return false;
  }

  get deployedContractAddress() {
    if (this._deployer) {
      return this._deployer._address;
    }
    return '';
  }

  get isMethodConstant() {
    return !!this.selectedMethod.constant;
  }

  get hasOutputs() {
    return !!this.selectedMethod._hasOutputs;
  }

  get selectedMethodInputs() {
    return this.selectedMethod.inputs;
  }

  get inputsValid() {
    try {
      return this.selectedMethod._inputsValid;
    } catch (e) {
      return false;
    }
  }

  get contractMethodNames() {
    if (this.contractMethods.length > 0 && this.contractActive) {
      return this.contractMethods.reduce((acc, cur) => {
        acc.push(cur.name);
        return acc;
      }, []);
    }
    return [];
  }

  setSelectedMethodInputValue(name, value) {
    this.selectedMethod._setSelectedMethodInputValue(name, value);
  }
  deploy(withValue, contractName) {
    this.clear();
    return this._deployer._deploy(withValue, contractName);
  }

  setDeployArg(name, value) {
    if (this._deployer) {
      this._deployer._setDeployArg(name, value);
      return true;
    }
    return false;
  }

  async write(txValue) {
    return this.selectedMethod._write(txValue);
  }

  setAbi(abi) {
    return new Promise((resolve, reject) => {
      try {
        if (abi) {
          this.ABI = parseABI(abi);
          if (this.contractActive) {
            this._processAbi(this.ABI);
            return resolve();
          } else if (this.byteCodeValid) {
            this._abiConstructor();
            resolve();
          }
          resolve();
        } else {
          this.ABI = null;
        }
      } catch (e) {
        this.ABI = null;
        reject(e);
      }
    });
  }

  setContractAddress(address) {
    this.address = address;
    if (this.contractActive) {
      return this._processAbi(this.ABI).catch(err => {
        this.ABI = null;
        throw err;
      });
    }
    return Promise.resolve();
  }

  _processAbi() {
    if (this.ABI !== '') {
      if (Array.isArray(this.ABI)) {
        this.contractMethods = this.ABI.filter(item => {
          if (item.type !== 'constructor' && item.type !== 'event') {
            return item;
          }
        });
        this.contractMethodDetails = this.ABI.reduce((acc, cur) => {
          if (cur.type === 'function') {
            acc[cur.name] = cur;
          }
          return acc;
        }, {});
        return;
      }
    } else {
      throw 'processAbi error';
    }
  }
  selectedFunction(methodName) {
    return new Promise((resolve, reject) => {
      if (this.contractMethodDetails[methodName] instanceof Method) {
        this.selectedMethod = this.contractMethodDetails[methodName];
        this.selectedMethod._updateGasPrice(this.gasPrice);
        resolve({
          inputs: this.selectedMethod.inputs,
          outputs: this.selectedMethod.outputs
        });
      } else {
        this.contractMethodDetails[methodName] = Method._create(
          this.contractMethodDetails[methodName],
          this.address,
          this.userAddress,
          this.web3,
          this.gasPrice
        )
          .then(instance => {
            this.selectedMethod = instance;
            this.contractMethodDetails[methodName] = instance;
            resolve({
              inputs: this.selectedMethod.inputs,
              outputs: this.selectedMethod.outputs
            });
          })
          .catch(reject);
      }
    });
  }
  _abiConstructor() {
    if (this.hasABI && this.byteCodeValid) {
      this._deployer = new Deploy(
        this.ABI,
        this.txByteCode,
        this.userAddress,
        this.web3,
        this.gasPrice
      );
    }
  }

  setByteCode(txByteCode) {
    try {
      if (typeof txByteCode === 'object') {
        if (txByteCode.hasOwnProperty('object'))
          this.txByteCode =
            txByteCode.object.substring(0, 2) === '0x'
              ? txByteCode.object
              : '0x' + txByteCode.object;
      } else if (typeof txByteCode === 'string') {
        this.txByteCode =
          txByteCode.substring(0, 2) === '0x' ? txByteCode : '0x' + txByteCode;
      } else {
        this.txByteCode = null;
      }
      if (!validateHexString(this.txByteCode)) {
        this.txByteCode = null;
      }
      if (this.hasABI) {
        this._abiConstructor();
      }
    } catch (e) {
      this.txByteCode = null;
    }
  }
}
