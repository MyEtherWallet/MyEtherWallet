import utils from 'web3-utils';
import validateHexString from '@/core/helpers/validateHexString';
import { isInt, stringToArray } from '@/core/helpers/common';
import { address, bool, bytes, int, string, uint } from './solidityTypes';
import Method from './method';
import Deploy from './deploy';
import Web3 from 'web3';
import {isContractArgValid, getType, validateABI, formatInput} from './common'

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
    this.deployer = null;
    this.txByteCode = null;
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
    this.deployer = null;
  }

  updateGasPrice(gasPrice) {
    if (this.deployer) {
      this.deployer.updateGasPrice(gasPrice);
    }
    this.gasPrice = gasPrice;
  }

  get hasABI() {
    return !!parseABI(this.ABI);
  }

  get abiValid() {
    return this.hasABI && !!validateABI(this.ABI);
  }

  get byteCodeValid() {
    return !!this.txByteCode && this.txByteCode.substring(0, 2) === '0x';
  }

  get constructorInputs() {
    if (this.deployer) {
      return this.deployer.constructorInputs;
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
    if (this.deployer) {
      return this.deployer.payableConstructor;
    }
    return false;
  }

  get canDeploy() {
    if (this.deployer) {
      return this.deployer.canDeploy;
    }
    return false;
  }

  get hasConstructorABI() {
    if (this.deployer) {
      return this.deployer.hasConstructorABI;
    }
    return false;
  }

  get deployedContractAddress() {
    if (this.deployer) {
      return this.deployer.address;
    }
    return '';
  }

  get isMethodConstant() {
    return !!this.selectedMethod.constant;
  }

  get hasOutputs() {
    return !!this.selectedMethod.hasOutputs;
  }

  get selectedMethodInputs() {
    return this.selectedMethod.inputs;
  }

  get inputsValid() {
    try {
      return this.selectedMethod.inputsValid;
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
    this.selectedMethod.setSelectedMethodInputValue(name, value);
  }
  deploy(withValue, contractName) {
    this.clear();
    return this.deployer.deploy(withValue, contractName);
  }

  setDeployArg(name, value) {
    this.deployer.setDeployArg(name, value);
  }

  async write(txValue) {
    return this.selectedMethod.write(txValue);
  }

  setAbi(abi) {
    return new Promise((resolve, reject) => {
      try {
        if (abi) {
          this.ABI = Contracts.parseABI(abi);
          if (this.contractActive) {
            this.processAbi(this.ABI)
              .then(resolve)
              .catch(err => {
                this.ABI = null;
                reject(err);
              });
          } else if (this.byteCodeValid) {
            this.abiConstructor();
          }
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
      return this.processAbi(this.ABI).catch(err => {
        this.ABI = null;
        throw err;
      });
    }
    return Promise.resolve();
  }

  processAbi() {
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
        this.selectedMethod.updateGasPrice(this.gasPrice);
        resolve({
          inputs: this.selectedMethod.inputs,
          outputs: this.selectedMethod.outputs
        });
      } else {
        this.contractMethodDetails[methodName] = Method.create(
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
  abiConstructor() {
    if (this.hasABI && this.byteCodeValid) {
      this.deployer = new Deploy(
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
        this.abiConstructor();
      }
    } catch (e) {
      this.txByteCode = null;
    }
  }


}
