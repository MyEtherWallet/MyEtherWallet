import HttpRequestManger from '../providers/http-request-manager';
import MiddleWare from '../middleware';
import {
  ethAccounts,
  ethCoinbase,
  ethSendTransaction,
  ethSign
} from '../cx-web3-methods';
import { ethRequestAccounts } from '../cx-ethereum-methods';

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
    this.host = host;
    this._id = 0;
    // this._promises = {};
    this._connect();
    this.provider = {
      send: method => {
        const payload = {
          jsonrpc: '2,0',
          method: method,
          params: [],
          id: this._id++
        };
        const middleware = new MiddleWare();
        middleware.use(ethRequestAccounts);
        const requestManager = new HttpRequestManger(host, {});

        const req = {
          payload,
          requestManager
        };
        middleware.use(ethRequestAccounts);
        middleware.run(req, this.callback).then(() => {
          requestManager.provider.send(payload, this.callback);
        });
      }
    };

    return this.provider;
    //   sendAsync: (payload, callback) => {
    //      return this.send(payload.method, payload.params)
    // .then(result => {
    //   const response = payload;
    //   response.result = result;
    //   callback(null, response);
    // })
    // .catch(error => {
    //   callback(error, null);
    //   // eslint-disable-next-line no-console
    //   console.error(
    //     `Error from EthereumProvider sendAsync ${payload}: ${error}`
    //   );
    // });
    //   }
    // };
  }

  // send(method, params = []) {
  //   if (!method || typeof method !== 'string') {
  //     return new Error('Method is not a valid string.');
  //   }

  //   if (!(params instanceof Array)) {
  //     return new Error('Params is not a valid array.');
  //   }
  //   const id = this._id++;
  //   const jsonrpc = '2.0';
  //   const payload = { jsonrpc, id, method, params };
  //   const reqManager = this._requestManager;
  //   const req = {
  //     payload,
  //     reqManager
  //   };
  //   return this.middleware.run(req, this._callback).then(() => {
  //     this._requestManager.provider.send(req);
  //   });
  // }
  // _callback() {}
  _callback(e, res) {
    // new Promise((resolve, reject) => {
    //   if (e) reject(e);
    //   resolve(res);
    // });
    if (e !== null) {
      return e;
    }
    return res;
  }

  async _connect() {
    fetch(this.host, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: {
        jsonrpc: '2.0',
        method: 'net_version',
        params: [],
        id: this._id++
      }
    })
      .then(() => {
        this.emit('connect');
      })
      .catch(() => {
        this._emitClose(1011, 'No connection found');
      });

    this.once('close', this._connect.bind(this));
  }

  _emitClose(code, reason) {
    this.emit('close', code, reason);
  }
}

export { MewCxWeb3, MewCxEthereum };
