import axios from 'axios';
import { toPayload } from './methods/jsonrpc';

const toQueryString = params => {
  return Object.keys(params)
    .map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    })
    .join('&');
};
class EtherscanProxy {
  constructor(url, apikey) {
    this.url = url;
    this.apikey = apikey;
  }
  etherscanXHR(isGET, params) {
    return new Promise((resolve, reject) => {
      const qString = isGET
        ? '?' + toQueryString(Object.assign(params, { apikey: this.apikey }))
        : '';
      axios({
        method: isGET ? 'get' : 'post',
        data: isGET ? {} : params,
        url: this.url + qString
      })
        .then(res => {
          if (!res.data.error) resolve(res.data);
          else reject(res.data);
        })
        .catch(reject);
    });
  }
  request(payload) {
    return new Promise((resolve, reject) => {
      switch (payload.method) {
        case 'eth_blockNumber':
          this.etherscanXHR(true, {
            module: 'proxy',
            action: 'eth_blockNumber'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getBlockByNumber':
          this.etherscanXHR(true, {
            module: 'proxy',
            action: 'eth_getBlockByNumber',
            tag: payload.params[0],
            boolean: payload.params[1]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getBlockTransactionCountByNumber':
          this.etherscanXHR(true, 'eth_getBlockTransactionCountByNumber', {
            module: 'proxy',
            action: 'eth_getBlockTransactionCountByNumber',
            tag: payload.params[0]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getTransactionByHash':
          this.etherscanXHR(true, {
            module: 'proxy',
            action: 'eth_getTransactionByHash',
            txhash: payload.params[0]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getBalance':
          this.etherscanXHR(true, {
            module: 'account',
            action: 'balance',
            address: payload.params[0],
            tag: payload.params[1]
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_call':
          Object.keys(payload.params[0]).forEach(key =>
            payload.params[0][key] === undefined
              ? delete payload.params[0][key]
              : ''
          );
          this.etherscanXHR(
            true,
            Object.assign(payload.params[0], {
              module: 'proxy',
              action: 'eth_call'
            })
          )
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_estimateGas':
          this.etherscanXHR(
            true,
            Object.assign(
              {
                module: 'proxy',
                action: 'eth_estimateGas'
              },
              payload.params[0]
            )
          )
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_sendRawTransaction':
          this.etherscanXHR(true, {
            hex: payload.params[0],
            module: 'proxy',
            action: 'eth_sendRawTransaction'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getTransactionReceipt':
          this.etherscanXHR(true, {
            txhash: payload.params[0],
            module: 'proxy',
            action: 'eth_getTransactionReceipt'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getTransactionCount':
          this.etherscanXHR(true, {
            address: payload.params[0],
            tag: payload.params[1],
            module: 'proxy',
            action: 'eth_getTransactionCount'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_gasPrice':
          this.etherscanXHR(true, {
            module: 'proxy',
            action: 'eth_gasPrice'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getCode':
          this.etherscanXHR(true, {
            address: payload.params[0],
            tag: payload.params[1],
            module: 'proxy',
            action: 'eth_getCode'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        case 'eth_getStorageAt':
          this.etherscanXHR(true, {
            address: payload.params[0],
            position: payload.params[1],
            tag: payload.params[2],
            module: 'proxy',
            action: 'eth_getStorageAt'
          })
            .then(body => {
              resolve(toPayload(payload.id, body.result));
            })
            .catch(reject);
          break;
        default:
          reject(new Error('Not supported'));
      }
    });
  }
}
export default EtherscanProxy;
