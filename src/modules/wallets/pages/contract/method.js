import BigNumber from 'bignumber.js';
import utils from 'web3-utils';
import { address, bool, bytes, int, string, uint } from './solidityTypes';
import { isAddress } from '@/helpers/addressUtils';
import sanitizeHex from '@/helpers/sanitizeHex';
import * as ethUnit from 'ethjs-unit';
import { Transaction } from 'ethereumjs-tx';

import Web3 from 'web3';
import { bufferToHex, generateAddress, toBuffer } from 'ethereumjs-util';

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

export default class Method {
  constructor(abi, contractAddress, address, web3, gasPrice, storeHandler) {
    try {
      this.userAddress = address;
      this.address = contractAddress;
      this.name = abi.name;
      this.constant = abi.constant;
      this.inputs = {};
      this.web3 =
        web3 ||
        new Web3(
          'HTTP://127.0.0.1:7545'
          // 'wss://mainnet.infura.io/ws/v3/7d06294ad2bd432887eada360c5e1986'
        );
      this.gasPrice = gasPrice;
      this.ABI = abi;
      this.selectedFunction(abi);
      this.contractMethods = [];
      this.selectedMethod = abi;
      this.storeContractAddress = storeHandler || function () {};
      this.selectedMethodName = '';
      this.selectedMethodInputs = {};
      this.noInputs = false;
      this.selectedMethodInputValues = {};
      // ===========
      this.constructorABI = null;
      this.constructorInputs = {};
      this.txByteCode = null;
      this.contractsDeployed = [];
      this.noConstructorInputs = false;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  clear() {
    this.constructorABI = null;
    this.constructorInputs = {};
    this.txByteCode = null;
    this.noConstructorInputs = false;
    Object.keys(this.inputs).forEach(item => {
      return this.inputs[item].clear;
    });
  }

  reset() {
    this.constructorABI = null;
    this.constructorInputs = {};
    this.txByteCode = null;
    this.noConstructorInputs = false;
    this.address = '';
    this.inputs = {};
    this.ABI = null;
    this.contractMethods = [];
    this.selectedMethod = { inputs: [] };
    this.selectedMethodName = '';
    this.inputs = {};
    this.inputs = {};
    this.selectedMethodInputValues = {};
    console.log('reset'); // todo remove dev item
  }

  updateGasPrice(gasPrice) {
    this.gasPrice = gasPrice;
  }

  get methodInputs() {
    return this.inputs;

  }
  get isMethodConstant() {
    return this.selectedMethod.constant;
  }
  get hasInputs() {
    return this.noInputs;
  }

  get hasOutputs() {
    try {
      return Object.keys(this.outputs).length > 0;
    } catch (e) {
      return false;
    }
  }

  setStoreHandler(storeHandler) {
    this.storeContractAddress = storeHandler;
  }

  setSelectedMethodInputValue(name, value) {
    if (arguments.length > 2) {
      for (let i = 0; i < arguments.length - 1; i = i + 2) {
        console.log(arguments[i], arguments[i + 1]); // todo remove dev item
        if (!this.inputs[arguments[i]])
          throw Error(`${arguments[i]} is not an expected input`);
        this.inputs[arguments[i]].value = arguments[i + 1];
      }
    } else {
      if (!this.inputs[name]) throw Error(`${name} is not an expected input`);
      this.inputs[name].value = value;
    }
  }

  isInputValid(name) {
    if (!this.inputs[name]) throw Error(`${name} is not an expected input`);
    return this.inputs[name].valid;
  }

  selectedFunction(method) {
    // todo make this and getting contract args similar to how a constructor is handled
    // todo remove using map and see constructor setup
    return new Promise((resolve, reject) => {
      if (!this.address || this.address === '')
        return reject(Error(`No contract address specified`));
      const methodName = method.name;
      console.log(`selectedFunction(${methodName})`); // todo remove dev item
      this.selectedMethodInputs = {};
      this.selectedMethodOutputs = {};
      // const method = this.contractMethodDetails[methodName];
      if (!method)
        return reject(Error(`Selected method ${methodName} not found`));
      try {
        if (!method.hasOwnProperty('constant')) return;
        this.selectedMethod = method;
        this.inputs = this.selectedMethod.inputs.reduce((acc, cur) => {
          const itemProxy = this.createTypeValidatingProxy(cur);
          itemProxy.value = null;
          itemProxy.result = null;
          acc[cur.name] = itemProxy;
          return acc;
        }, {});
        this.noInputs = this.selectedMethod.inputs.length === 0;
        this.outputs = this.selectedMethod.outputs.reduce((acc, cur, idx) => {
          const itemProxy = this.createTypeValidatingProxy(cur);
          itemProxy.value = null;
          itemProxy.result = null;
          acc[idx.toString()] = itemProxy;
          return acc;
        }, {});
        if (method.constant === true && method.inputs.length === 0) {
          const contract = new this.web3.eth.Contract(
            [method],
            this.address.toLowerCase()
          );
          contract.methods[methodName]()
            .call({ from: this.userAddress.toLowerCase() })
            .then(res => {
              if (Object.keys(this.outputs).length === 1) {
                this.outputs['0'].value = res;
              } else if (
                typeof res === 'object' &&
                Object.keys(this.outputs).length > 1
              ) {
                Object.keys(res).forEach(key => {
                  if (this.outputs[key]) {
                    this.outputs[key].value = res[key];
                  }
                });
              }
              resolve({
                inputs: this.inputs,
                outputs: this.outputs
              });
            })
            .catch(e => {
              this.loading = false;
              reject(e);
              // eslint-disable-next-line
              console.error(e); // todo remove dev item
              // Toast.responseHandler(e, Toast.WARN);
            });
        } else {
          this.result = '';
          resolve({
            inputs: this.inputs,
            outputs: this.outputs
          });
        }
        this.loading = false;
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    });
  }
  async write(txValue) {
    let value;
    const web3 = this.web3;
    const contract = new web3.eth.Contract(
      [this.selectedMethod],
      this.address.toLowerCase()
    );
    if (txValue) {
      value = sanitizeHex(ethUnit.toWei(txValue, 'ether').toString(16));
    } else {
      value = 0;
    }
    this.loading = true;
    if (this.selectedMethod.constant === true) {
      console.log('CONSTANT'); // todo remove dev item

      return contract.methods[this.selectedMethod.name](...this.contractArgs)
        .call({ from: this.userAddress.toLowerCase() })
        .then(res => {
          // todo change just so that it returns a new object (such as using ... or similar)
          const results = {};
          if (Object.keys(this.outputs).length === 1) {
            const key = '0';
            results[key] = {};
            results[key].value = res;
            results[key].name = this.outputs[key].name;
            results[key].type = this.outputs[key].type;
          } else if (
            typeof res === 'object' &&
            Object.keys(this.outputs).length > 1
          ) {
            Object.keys(res).forEach(key => {
              if (this.outputs[key]) {
                results[key] = {};
                results[key].value = res;
                results[key].name = this.outputs[key].name;
                results[key].type = this.outputs[key].type;
                this.outputs[key].value = res[key];
              }
            });
          }
          console.log('res', res); // todo remove dev item
          // if (Array.isArray(res)) {
          //   this.outputs.result = JSON.stringify(res);
          // } else this.outputs.result = res;
          // this.loading = false;
          return { outputs: results };
        })
        .catch(e => {
          this.loading = false;
          // eslint-disable-next-line
          console.error(e); // todo remove dev item
          // Toast.responseHandler(e, false);
        });
    }
    const nonce = await web3.eth.getTransactionCount(
      this.userAddress.toLowerCase()
    );
    let errored = false;
    const gasLimit = await contract.methods[this.selectedMethod.name](
      ...this.contractArgs
    )
      .estimateGas({
        from: this.userAddress.toLowerCase(),
        value: value
      })
      .then(res => {
        return res;
      })
      .catch(e => {
        this.loading = false;
        // eslint-disable-next-line
        console.error(e); // todo remove dev item
        // Toast.responseHandler(e, Toast.ERROR);
        errored = true;
      });
    if (!errored) {
      const data = contract.methods[this.selectedMethod.name](
        ...this.contractArgs
      ).encodeABI();

      const raw = {
        from: this.userAddress.toLowerCase(),
        gas: gasLimit,
        nonce: nonce,
        gasPrice: Number(ethUnit.toWei(this.gasPrice, 'gwei')),
        value: value,
        to: this.address.toLowerCase(),
        data: data
      };
      console.log(raw); // todo remove dev item
      this.loading = false;
      this.clear();
      return web3.eth.sendTransaction(raw).catch(err => {
        // eslint-disable-next-line
        console.error(err); // todo remove dev item
        // Toast.responseHandler(err, Toast.ERROR);
      });
    }
  }

  get contractArgs() {
    try {
      // const _contractArgs = [];
      console.log(this.selectedMethod); // todo remove dev item
      if (this.selectedMethod) {
        return this.selectedMethod.inputs.reduce((_contractArgs, item) => {
          const value = this.inputs[item.name].value;
          console.log(this.inputs, item.name, value); // todo remove dev item
          if (item.type.includes('[]')) {
            const parsedItem = Method.formatInput(value);
            _contractArgs.push(parsedItem);
          } else if (item.type === 'address') {
            _contractArgs.push(value.toLowerCase().trim());
          } else if (item.includes === 'uint') {
            const number = new BigNumber(value.trim());
            _contractArgs.push(number.toFixed());
          } else {
            _contractArgs.push(value);
          }
          return _contractArgs;
        }, []);
      }
      return [];
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      throw e;
    }
  }
  createTypeValidatingProxy(item) {
    return new Proxy(item, {
      set: (obj, prop, value) => {
        if (prop === 'value' && value !== null) {
          if (
            Method.isContractArgValid(
              value,
              Method.getType(obj.type).solidityType
            )
          ) {
            obj.valid = true;
          } else {
            obj.valid = false;
          }
        } else if (prop === 'value' && value === null) {
          obj.valid = false;
        } else if (prop === 'clear') {
          obj.valid = false;
        }
        obj[prop] = value;

        // The default behavior to store the value
        // obj[prop] = value;

        // Indicate success
        return true;
      },
      get: (target, prop) => {
        if (prop === 'clear') {
          target.value = null;
          target.valid = false;
          return true;
        }
        return target[prop];
      }
    });
  }
  parseJSON(json) {
    try {
      JSON.parse(json);
      return JSON.parse(json);
    } catch (e) {
      if (Array.isArray(json)) {
        return json;
      }
      return false;
    }
  }
  static validateABI(json) {
    console.log(json); // todo remove dev item
    if (json === '') return false;
    try {
      JSON.parse(json);
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
          if (!Method.isContractArgValid(parsedItem, type)) return false;
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
  getEntireBal() {
    return '20000';
  }
}
