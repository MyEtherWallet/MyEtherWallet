import utils from 'web3-utils';
import { address, bool, bytes, int, string, uint } from './solidityTypes';
import Method from './method';
import Deploy from './deploy';
import Web3 from 'web3';

const stringToArray = str => {
  return str.replace(/[^a-zA-Z0-9_,]+/g, '').split(',');
};

const isInt = num => {
  try {
    utils.toBN(num);
    return true;
  } catch (e) {
    return false;
  }
};

const validateHexString = str => {
  if (str === '') return true;
  str =
    str.substring(0, 2) === '0x'
      ? str.substring(2).toUpperCase()
      : str.toUpperCase();
  return utils.isHex(str);
};

export default class Contracts {
  constructor(address, web3, gasPrice, storeHandler) {
    try {
      this.userAddress = address;
      this.address = '';
      this.inputs = {};
      this.web3 =
        web3 ||
        new Web3(
          // 'https://ropsten.infura.io/v3/c9b249497d074ab59c47a97bdfe6b401'
          'HTTP://127.0.0.1:7545'
          // 'wss://mainnet.infura.io/ws/v3/7d06294ad2bd432887eada360c5e1986'
        );
      this.gasPrice = gasPrice;
      this.ABI = null;
      this.contractMethods = [];
      this.selectedMethod = { inputs: [] };
      this.storeContractAddress = storeHandler || function () {};
      this.noInputs = false;
      // ===========
      this.deployer = null;
      this.txByteCode = null;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  clear() {
    this.txByteCode = null;
  }

  reset() {
    this.txByteCode = null;
    this.address = '';
    this.inputs = {};
    this.ABI = null;
    this.contractMethods = [];
    this.selectedMethod = { inputs: [] };
    this.contractMethodDetails = {};
  }

  updateGasPrice(gasPrice) {
    this.gasPrice = gasPrice;
  }

  get hasABI() {
    try {
      return !!Contracts.validateABI(this.ABI);
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return false;
    }
  }

  get abiValid() {
    return this.hasABI && typeof this.ABI === 'object';
  }

  get byteCodeValid() {
    try {
      return !!this.txByteCode && this.txByteCode.substring(0, 2) === '0x';
    } catch (e) {
      return false;
    }
  }

  get constructorInputs() {
    if (this.deployer) {
      return this.deployer.constructorInputs;
    }
    return {};
  }

  get hasContractAddress() {
    try {
      return this.address !== '' && utils.isAddress(this.address); // todo replace with helper
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return false;
    }
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
    return this.selectedMethod.constant;
  }

  get hasOutputs() {
    try {
      return this.selectedMethod.hasOutputs;
    } catch (e) {
      return false;
    }
  }

  get selectedMethodInputs() {
    return this.selectedMethod.inputs;
  }

  get inputsValid() {
    return this.selectedMethod.inputsValid;
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

  setStoreHandler(storeHandler) {
    this.storeContractAddress = storeHandler;
  }

  setSelectedMethodInputValue(name, value) {
    this.selectedMethod.setSelectedMethodInputValue(name, value);
  }

  setAbi(abi) {
    return new Promise((resolve, reject) => {
      try {
        if (abi) {
          this.ABI = Contracts.validateABI(abi);
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
        // eslint-disable-next-line
      console.error(e);
        this.ABI = null;
        reject(e);
      }
    });
  }

  setContractAddress(address) {
    return new Promise((resolve, reject) => {
      this.address = address;
      if (this.contractActive) {
        this.processAbi(this.ABI)
          .then(resolve)
          .catch(err => {
            this.ABI = null;
            // eslint-disable-next-line
            console.error(err);
            reject(err);
          });
      }
    });
  }

  processAbi() {
    return new Promise((resolve, reject) => {
      try {
        if (this.ABI !== '') {
          if (Array.isArray(this.ABI)) {
            this.contractMethods = this.ABI.filter(item => {
              if (item.type !== 'constructor' && item.type !== 'event') {
                return item;
              }
            });
            this.contractMethodDetails = this.ABI.reduce((acc, cur) => {
              if (cur.type !== 'constructor' && cur.type !== 'event') {
                acc[cur.name] = cur;
              }
              return acc;
            }, {});
            resolve();
          } else {
            reject('invalid abi');
          }
        } else {
          reject('processAbi error');
        }
      } catch (e) {
        // eslint-disable-next-line
      console.error(e);
        reject(e);
      }
    });
  }
  selectedFunction(methodName) {
    return new Promise((resolve, reject) => {
      if (this.contractMethodDetails[methodName] instanceof Method) {
        this.selectedMethod = this.contractMethodDetails[methodName];
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
    try {
      if (this.hasABI && this.byteCodeValid) {
        this.deployer = new Deploy(
          this.ABI,
          this.txByteCode,
          this.userAddress,
          this.web3,
          this.gasPrice
        );
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return {};
    }
  }
  deploy(withValue, keepMethods = false) {
    return this.deployer.deploy(withValue, keepMethods);
  }

  setDeployArg(name, value) {
    this.deployer.setDeployArg(name, value);
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
      if (this.hasABI) {
        this.abiConstructor();
      }
    } catch (e) {
      this.txByteCode = null;
    }
  }

  async write(txValue) {
    return this.selectedMethod.write(txValue);
  }

  static validateABI(json) {
    if (json === '') return false;
    try {
      const value = JSON.parse(json);
      if (Array.isArray(value)) {
        if (value.length > 0) {
          return value;
        }
      }
      return JSON.parse(json);
    } catch (e) {
      if (Array.isArray(json)) {
        if (json.length > 0) {
          return json;
        }
      }
      return false;
    }
  }
  static isContractArgValid(value, solidityType) {
    try {
      if (!value) value = '';
      if (solidityType.includes('[]')) {
        const parsedValue = Array.isArray(value) ? value : stringToArray(value);
        const type = solidityType.replace('[]', '');
        for (const parsedItem of parsedValue) {
          if (!Contracts.isContractArgValid(parsedItem, type)) return false;
        }
        return true;
      }
      if (solidityType.includes(uint) || solidityType.includes(int))
        return value !== '' && !isNaN(value) && isInt(value);
      if (solidityType === address) return utils.isAddress(value);
      if (solidityType === string) return true;
      if (solidityType.includes(bytes))
        return value.substr(0, 2) === '0x' && validateHexString(value);
      if (solidityType === bool)
        return typeof value === typeof true || typeof value === typeof false;
      return false;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return false;
    }
  }
  static getType(inputType) {
    try {
      if (!inputType) inputType = '';
      if (inputType.includes('[]')) {
        return { type: 'string', solidityType: `${inputType}` };
      }
      if (inputType.includes(uint))
        return { type: 'number', solidityType: uint };
      if (inputType.includes(address))
        return { type: 'text', solidityType: address };
      if (inputType.includes(string))
        return { type: 'text', solidityType: string };
      if (inputType.includes(bytes))
        return { type: 'text', solidityType: bytes };
      if (inputType.includes(bool))
        return { type: 'radio', solidityType: bool };
      return { type: 'text', solidityType: string };
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }
  static formatInput(str) {
    try {
      if (str[0] === '[') {
        return JSON.parse(str);
      }
      const newArr = str.split(',');
      return newArr.map(item => {
        return item.replace(' ', '');
      });
    } catch (e) {
      // Toast.responseHandler(e, Toast.ERROR);
    }
  }
}
