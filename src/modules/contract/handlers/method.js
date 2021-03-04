import BigNumber from 'bignumber.js';
import * as sanitizeHex from '@/core/helpers/addressUtils';
import * as ethUnit from 'ethjs-unit';
import { isContractArgValid, getType, formatInput } from './common';



export default class Method {
  constructor(abi, contractAddress, address, web3, gasPrice) {
    try {
      this.userAddress = address;
      this.address = contractAddress;
      this.name = abi.name;
      this.constant = abi.constant || abi.stateMutability === 'view';
      this.inputs = {};
      this.outputs = {};
      this.web3 = web3;
      this.gasPrice = gasPrice;
      this.ABI = abi;

      this.contractMethods = [];
      this.selectedMethod = abi;
      this.noInputs = false;
      // ===========
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  static _create(abi, contractAddress, address, web3, gasPrice, storeHandler) {
    return new Promise((resolve, reject) => {
      const method = new Method(
        abi,
        contractAddress,
        address,
        web3,
        gasPrice,
        storeHandler
      );
      method
        .selectedFunction(abi)
        .then(() => {
          resolve(method);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  clear() {
    Object.keys(this.inputs).forEach(item => {
      return this.inputs[item].clear;
    });
  }

  reset() {
    this.address = '';
    this.inputs = {};
    this.ABI = null;
    this.contractMethods = [];
    this.selectedMethod = { inputs: [] };
    this.inputs = {};
    this.outputs = {};
  }

  updateGasPrice(gasPrice) {
    this.gasPrice = gasPrice;
  }

  get isMethodConstant() {
    return this.selectedMethod.constant;
  }

  get inputsValid() {
    return (
      (Object.values(this.inputs).every(item => {
        return item.value !== null && item.valid;
      }) &&
        Object.values(this.inputs).length > 0) ||
      this.noInputs
    );
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

  _setSelectedMethodInputValue(name, value) {
    if (!this.inputs[name]) throw Error(`${name} is not an expected input`);
    this.inputs[name].value = value;
  }

  selectedFunction(method) {
    return new Promise((resolve, reject) => {
      if (!this.address || this.address === '')
        return reject(Error(`No contract address specified`));
      const methodName = method.name;
      this.inputs = {};
      this.outputs = {};
      if (!method)
        return reject(Error(`Selected method ${methodName} not found`));
      try {
        this.selectedMethod = method;
        this.inputs = this.selectedMethod.inputs.reduce((acc, cur, idx) => {
          const itemProxy = this.createTypeValidatingProxy(cur);
          itemProxy.value = null;
          itemProxy.result = null;
          if (acc[cur.name] === '' || cur.name.length === 0) {
            cur.name = idx.toString();
            itemProxy.name = idx.toString();
          }
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
        if (this.constant === true && method.inputs.length === 0) {
          const contract = new this.web3.eth.Contract(
            [method],
            this.address.toLowerCase()
          );
          contract.methods[methodName]()
            .call({ from: this.userAddress.toLowerCase() })
            .then(res => {
              if (Object.keys(this.outputs).length === 1) {
                if (Array.isArray(res)) {
                  if (this.outputs['0'].components) {
                    this.outputs['0'].value = res
                      .slice(0, this.outputs['0'].components.length)
                      .join(',');
                  } else {
                    this.outputs['0'].value = JSON.stringify(res);
                  }
                } else {
                  this.outputs['0'].value = res.toString();
                }
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
              console.error(e);
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
  async _write(txValue) {
    let value;
    const web3 = this.web3;
    const contract = new web3.eth.Contract(
      [this.ABI],
      this.address.toLowerCase()
    );
    if (txValue) {
      value = sanitizeHex(ethUnit.toWei(txValue, 'ether').toString(16));
    } else {
      value = 0;
    }
    this.loading = true;
    if (this.constant === true) {
      return contract.methods[this.name](...this.contractArgs)
        .call({ from: this.userAddress.toLowerCase() })
        .then(res => {
          let result = null;
          if (Array.isArray(res)) {
            result = JSON.stringify(res);
          }
          if (Object.keys(this.outputs).length === 1) {
            const key = '0';
            this.outputs[key].value = result || res.toString();
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
          return { outputs: { ...this.outputs } };
        })
        .catch(e => {
          this.loading = false;
          // eslint-disable-next-line
          console.error(e);
        });
    }
    const nonce = await web3.eth.getTransactionCount(
      this.userAddress.toLowerCase()
    );
    let errored = false;
    const gasLimit = await contract.methods[this.name](...this.contractArgs)
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
        console.error(e);
        errored = true;
      });
    if (!errored) {
      const data = contract.methods[this.name](
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
      this.loading = false;
      this.clear();
      return web3.eth.sendTransaction(raw).catch(err => {
        // eslint-disable-next-line
        console.error(err);
        throw err;
      });
    }
  }

  get contractArgs() {
    try {
      // const _contractArgs = [];
      if (this.selectedMethod) {
        return this.selectedMethod.inputs.reduce((_contractArgs, item) => {
          const value = this.inputs[item.name].value;
          if (item.type.includes('[]')) {
            const parsedItem = formatInput(value);
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
          obj.valid = !!isContractArgValid(
            value,
            getType(obj.type).solidityType
          );
        } else if (prop === 'value' && value === null) {
          obj.valid = false;
        } else if (prop === 'clear') {
          obj.valid = false;
        }
        obj[prop] = value;
        return true;
      },
      get: (obj, prop) => {
        if (prop === 'clear') {
          obj.value = null;
          obj.valid = false;
          return true;
        }
        return obj[prop];
      }
    });
  }
}
