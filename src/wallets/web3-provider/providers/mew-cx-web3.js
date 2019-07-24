import HttpRequestManger from '../providers/http-request-manager';
import MiddleWare from '../middleware';
import {
  ethAccounts,
  ethCoinbase,
  ethSendTransaction,
  ethSign
} from '../cx-web3-methods';

// import { ethRequestAccounts } from '../cx-ethereum-methods';
const EventEmitter = require('events');
class MewCxWeb3 {
  constructor(host) {
    const requestManager = new HttpRequestManger(host, {});
    this.httpProvider = {
      send: (payload, callback) => {
        const req = {
          payload,
          requestManager
        };
        const middleware = new MiddleWare();
        middleware.use(ethSendTransaction);
        middleware.use(ethSign);
        middleware.use(ethAccounts);
        middleware.use(ethCoinbase);
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      }
    };
    return this.httpProvider;
  }
}

class MewCxEthereum extends EventEmitter {
  constructor(host) {
    super();
    this._requestManager = new HttpRequestManger(host, {});
    this._id = 0;
    this._promises = {};
    this._connect();
    // this.provider = {
    //   send: (method, callback) => {
    //     const payload = {
    //       jsonrpc: '2,0',
    //       method: method,
    //       params: [],
    //       id: this._id++
    //     };

    //     const req = {
    //       payload,
    //       requestManager
    //     };
    //     const middleware = new MiddleWare();
    //     middleware.use(ethRequestAccounts);
    //     middleware.run(req, callback).then(() => {
    //       requestManager.provider.send(payload, callback);
    //     });
    //   }
    //   // sendAsync: (payload, callback) => {
    //   //   return this.send().then()
    //   // }
    // };
  }

  send(method, params = []) {
    if (!method || typeof method !== 'string') {
      return new Error('Method is not a valid string.');
    }

    if (!(params instanceof Array)) {
      return new Error('Params is not a valid array.');
    }
    const id = this._id++;
    const jsonrpc = '2.0';
    const payload = { jsonrpc, id, method, params };
    const promise = new Promise((resolve, reject) => {
      this._promises[payload.id] = { resolve, reject };
    });

    return promise;
  }

  _handleJsonrpcMessage(event) {
    // Return if no data to parse
    if (!event || !event.data) {
      return;
    }

    let data;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      // Return if we can't parse a valid object
      return;
    }

    // Return if not a jsonrpc response
    if (!data || !data.message || !data.message.jsonrpc) {
      return;
    }

    const message = data.message;
    const { id, method, error, result } = message;

    if (typeof id !== 'undefined') {
      const promise = this._promises[id];
      if (promise) {
        // Handle pending promise
        if (data.type === 'error') {
          promise.reject(message);
        } else if (message.error) {
          promise.reject(error);
        } else {
          promise.resolve(result);
        }
        delete this._promises[id];
      }
    } else {
      if (method && method.indexOf('_subscription') > -1) {
        // Emit subscription notification
        this._emitNotification(message.params);
      }
    }
  }

  /* Connection handling */

  _connect() {
    // Send to Mist
    // window.postMessage(
    //   { type: 'mistAPI_ethereum_provider_connect' },
    //   targetOrigin
    // );

    // Reconnect on close
    this.once('close', this._connect.bind(this));
  }

  /* Events */

  _emitNotification(result) {
    this.emit('notification', result);
  }

  _emitConnect() {
    this.emit('connect');
  }

  _emitClose(code, reason) {
    this.emit('close', code, reason);
  }

  _emitNetworkChanged(networkId) {
    this.emit('networkChanged', networkId);
  }

  _emitAccountsChanged(accounts) {
    this.emit('accountsChanged', accounts);
  }

  /* web3.js Provider Backwards Compatibility */

  sendAsync(payload, callback) {
    return this.send(payload.method, payload.params)
      .then(result => {
        const response = payload;
        response.result = result;
        callback(null, response);
      })
      .catch(error => {
        callback(error, null);
        // eslint-disable-next-line no-console
        console.error(
          `Error from EthereumProvider sendAsync ${payload}: ${error}`
        );
      });
  }
}

export { MewCxWeb3, MewCxEthereum };
