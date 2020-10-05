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

export default class Contracts {
  constructor(address, web3, gasPrice, storeHandler) {
    try {
      this.userAddress = address;
      this.address = '';
      this.address = '0x0d8775f648430679a709e98d2b0cb6250d2887ef'; // todo remove dev item
      this.inputs = {};
      this.web3 =
        web3 ||
        new Web3(
          'wss://mainnet.infura.io/ws/v3/7d06294ad2bd432887eada360c5e1986'
        );
      this.gasPrice = gasPrice;
      this.ABI = null;
      this.contractMethods = [];
      this.selectedMethod = { inputs: [] };
      this.storeContractAddress = storeHandler || function () {};
      this.selectedMethodName = '';
      this.selectedMethodInputs = {};
      this.selectedMethodInputValues = new Map();
      // ===========
      this.constructorABI = null;
      this.constructorInputs = {};
      this.txByteCode = null;
      this.contractsDeployed = [];
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  clear(keepMethods) {
    // this.contractActive = false;
    // ===========
    this.constructorABI = null;
    this.constructorInputs = {};
    this.txByteCode = null;
    if (!keepMethods) {
      this.address = '';
      this.inputs = {};
      this.ABI = null;
      this.contractMethods = [];
      this.selectedMethod = { inputs: [] };
      this.selectedMethodName = '';
      this.selectedMethodInputs = {};
      this.selectedMethodInputValues = new Map();
    }
  }

  updateGasPrice(gasPrice) {
    this.gasPrice = gasPrice;
  }

  get hasABI() {
    return this.ABI !== null || true;
  }

  get contractActive() {
    return this.hasABI && this.address !== '';
  }

  get canDeploy() {
    return (
      this.hasABI &&
      this.hasConstructorABI &&
      this.txByteCode !== null &&
      Object.values(this.constructorInputs).every(item => {
        return item.value !== null && item.valid;
      })
    );
  }

  get hasConstructorABI() {
    return Object.keys(this.constructorABI).length > 0;
  }

  get methodInputs() {
    if (this.selectedMethod) {
      return this.selectedMethodInputs;
    }
    return {};
  }

  get contractMethodNames() {
    console.log('contractMethodNames', this.contractMethods); // todo remove dev item
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
    if (arguments.length > 2) {
      for (let i = 0; i < arguments.length - 1; i = i + 2) {
        console.log(arguments[i], arguments[i + 1]); // todo remove dev item
        this.selectedMethodInputValues.set(arguments[i], arguments[i + 1]);
      }
    } else {
      this.selectedMethodInputValues.set(name, value);
    }

    console.log(this.selectedMethodInputValues); // todo remove dev item
  }

  setAbi(abi) {
    try {
      if (abi) {
        this.ABI = this.parseJSON(abi);
        this.processAbi(this.ABI);
        // console.log('setAbi', this.contractMethods); // todo remove dev item
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  setContractAddress(address) {
    console.log(address); // todo remove dev item
    this.address = '0x0d8775f648430679a709e98d2b0cb6250d2887ef';
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
  processAbi(jsonAbi) {
    try {
      if (jsonAbi !== '') {
        if (Array.isArray(jsonAbi)) {
          this.contractMethods = jsonAbi.filter(item => {
            if (item.type !== 'constructor' && item.constant !== undefined) {
              return item;
            }
          });
          this.contractMethodDetails = jsonAbi.reduce((acc, cur) => {
            if (cur.type !== 'constructor' && cur.constant !== undefined) {
              cur.result = cur.constant;
              acc[cur.name] = cur;
            }
            if (cur.type === 'constructor') {
              this.constructorABI = cur;
              this.abiConstructor();
            }
            return acc;
          }, {});
        } else {
          // this.resetDefaults();
          console.log('invalid abi'); // todo remove dev item
        }
      } else {
        console.log('processAbi error'); // todo remove dev item
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }
  selectedFunction(methodName) {
    // todo make this and getting contract args similar to how a constructor is handled
    // todo remove using map and see constructor setup
    return new Promise((resolve, reject) => {
      console.log(`selectedFunction(${methodName})`); // todo remove dev item
      this.selectedMethodName = methodName;
      this.selectedMethodInputValues.clear();
      const method = this.contractMethodDetails[methodName];
      try {
        if (!method.hasOwnProperty('constant')) return;
        this.selectedMethod = method;
        this.selectedMethodInputs = this.selectedMethod.inputs.reduce(
          (acc, cur) => {
            this.selectedMethodInputValues.set(cur.name, null);
            acc[cur.name] = cur;
            return acc;
          },
          {}
        );
        this.selectedMethodName = methodName;
        if (method.constant === true && method.inputs.length === 0) {
          const contract = new this.web3.eth.Contract(
            [method],
            this.address.toLowerCase()
          );
          contract.methods[methodName]()
            .call({ from: this.userAddress.toLowerCase() })
            .then(res => {
              this.selectedMethodInputs.result = res;
              resolve(this.selectedMethodInputs);
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
          resolve(this.selectedMethodInputs);
        }
        this.loading = false;

        // =================== may no longer need
        // this.selectedMethod.inputs.forEach(input => {
        //   if (input.type === 'bool') {
        //     this.inputs[input.name] = false;
        //   }
        // });
      } catch (e) {
        // eslint-disable-next-line
        console.error(e);
      }
    });
  }
  abiConstructor() {
    try {
      this.constructorInputs = {};
      if (this.hasABI) {
        // console.log(this.ABI); // todo remove dev item
        if (!this.constructorABI.hasOwnProperty('inputs')) {
          this.ABI.forEach(item => {
            if (item.type === 'constructor') {
              this.constructorABI = item;
            }
          });
        }

        // Sets radio buttons to false due to vue reactivity
        if (
          this.constructorABI &&
          this.constructorABI.hasOwnProperty('inputs')
        ) {
          this.constructorABI.inputs.forEach(item => {
            const itemProxy = this.createTypeValidatingProxy(item);
            itemProxy.value = null;
            this.constructorInputs[item.name] = itemProxy;
          });
        }
      }
      return this.constructorInputs;
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
      return {};
    }
  }
  deploy(withValue, keepMethods = false) {
    return new Promise((resolve, reject) => {
      try {
        console.log(this.canDeploy); // todo remove dev item
        if (!this.canDeploy) return Promise.reject();
        const rawTx = {};
        if (this.constructorABI.payable && withValue)
          rawTx.value = sanitizeHex(
            ethUnit.toWei(withValue, 'ether').toString(16)
          );
        else rawTx.value = '0x00';
        rawTx.data = this.txData();
        if (rawTx.data !== '0x') {
          this.sendTransaction(rawTx)
            .then(res => {
              this.clear(keepMethods);
              resolve(res);
            })
            .catch(reject);
        }
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }
  get deployArgs() {
    const _deployArgs = [];
    if (this.constructorABI) {
      this.constructorABI.inputs.forEach(item => {
        if (item.type.includes('[') && item.type.includes(']')) {
          const inputs = this.constructorInputs.hasOwnProperty(item.name)
            ? this.constructorInputs[item.name].value.replace(/\s/g, '')
            : '';
          const arr = inputs.split(',');
          _deployArgs.push(arr);
        } else {
          _deployArgs.push(this.constructorInputs[item.name].value);
        }
      });
    }
    return _deployArgs;
  }
  setDeployArg(name, value) {
    this.constructorInputs[name].value = value;
  }
  setByteCode(txByteCode) {
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
  }
  txData() {
    if (this.canDeploy) {
      // console.log(JSON.parse(this.ABI)); // todo remove dev item
      return new this.web3.eth.Contract(this.ABI)
        .deploy({ data: this.txByteCode, arguments: this.deployArgs })
        .encodeABI();
    }

    return '0x';
  }
  async estimateGas(params) {
    return this.web3.eth.estimateGas(params).catch(err => {
      // Toast.responseHandler(err, Toast.WARN);
      // eslint-disable-next-line
      console.error(err); // todo replace with proper error
    });
  }
  async getNonce(address) {
    return this.web3.eth.getTransactionCount(address);
  }
  getGasPrice() {
    return sanitizeHex(ethUnit.toWei(this.gasPrice, 'gwei').toString(16));
  }
  sendTransaction(tx) {
    let coinbase;
    return this.web3.eth
      .getCoinbase()
      .then(() => {
        coinbase = this.userAddress; // todo use actual result from getCoinbase if correctly returns user address
        return Promise.all([
          this.estimateGas({ from: coinbase, ...tx }),
          this.getNonce(coinbase)
        ]);
      })

      .then(results => {
        const _tx = new Transaction({
          from: coinbase,
          nonce: results[1],
          gasPrice: this.getGasPrice(),
          gasLimit: sanitizeHex(new BigNumber(results[0]).toString(16)),
          ...tx
        });
        const json = _tx.toJSON(true);
        delete json.to;
        json.from = coinbase;
        const contractAddr = bufferToHex(
          generateAddress(toBuffer(coinbase), toBuffer(results[1]))
        );
        this.address = contractAddr;
        this.storeContractAddress(contractAddr);
        this.contractsDeployed.push(contractAddr);
        return this.web3.eth.sendTransaction(json);
      })
      .catch(err => {
        throw err;
      });
  }
  async write() {
    const web3 = this.web3;
    const contract = new web3.eth.Contract(
      [this.selectedMethod],
      this.userAddress.toLowerCase()
    );
    this.loading = true;
    if (this.selectedMethod.constant === true) {
      contract.methods[this.selectedMethod.name](...this.contractArgs)
        .call({ from: this.userAddress.toLowerCase() })
        .then(res => {
          this.result = res;
          if (Array.isArray(res)) this.result = JSON.stringify(res);
          else this.result = res;
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
          // eslint-disable-next-line
          console.error(e); // todo remove dev item
          // Toast.responseHandler(e, false);
        });
    } else {
      const nonce = await web3.eth.getTransactionCount(
        this.userAddress.toLowerCase()
      );
      let errored = false;
      const gasLimit = await contract.methods[this.selectedMethod.name](
        ...this.contractArgs
      )
        .estimateGas({
          from: this.userAddress.toLowerCase(),
          value: this.txValue
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
          value: this.txValue,
          to: this.address.toLowerCase(),
          data: data
        };
        this.loading = false;
        web3.eth.sendTransaction(raw).catch(err => {
          // eslint-disable-next-line
          console.error(err); // todo remove dev item
          // Toast.responseHandler(err, Toast.ERROR);
        });
      }
    }
  }

  get contractArgs() {
    try {
      // const _contractArgs = [];
      console.log(this.selectedMethod); // todo remove dev item
      if (this.selectedMethod) {
        this.inputs = this.selectedMethodInputs;
        return this.selectedMethod.inputs.reduce((_contractArgs, item) => {
          const value = this.selectedMethodInputValues.get(item.name);
          console.log(this.selectedMethodInputValues, item.name, value); // todo remove dev item
          if (item.type.includes('[]')) {
            const parsedItem = Contracts.formatInput(value);
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
            Contracts.isContractArgValid(
              value,
              Contracts.getType(obj.type).solidityType
            )
          ) {
            obj.valid = true;
          } else {
            obj.valid = false;
          }
        } else if (prop === 'value' && value === null) {
          obj.valid = false;
        }
        console.log(obj, prop, value); // todo remove dev item
        obj[prop] = value;
        console.log(obj); // todo remove dev item

        // The default behavior to store the value
        // obj[prop] = value;

        // Indicate success
        return true;
      }
    });
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
      if (solidityType === address) return isAddress(value);
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
