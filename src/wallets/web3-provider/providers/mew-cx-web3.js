import HttpRequestManger from '../providers/http-request-manager';
import MiddleWare from '../middleware';
import {
  ethSignTransaction,
  ethGetTransactionCount,
  ethGetTransactionReceipt,
  ethGetBlockByNumber,
  ethGetBlockNumber,
  netVersion
} from '../methods';
import {
  ethAccounts,
  ethCoinbase,
  ethSendTransaction,
  ethSign
} from '../cx-web3-methods';
import { ethRequestAccounts } from '../cx-ethereum-methods';

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
    this.middleware = new MiddleWare();
    this.middleware.use(ethRequestAccounts);
    this.middleware.use(ethSendTransaction);
    this.middleware.use(ethSignTransaction);
    this.middleware.use(ethGetTransactionCount);
    this.middleware.use(ethGetTransactionReceipt);
    this.middleware.use(ethSign);
    this.middleware.use(ethAccounts);
    this.middleware.use(ethCoinbase);
    this.middleware.use(ethGetBlockByNumber);
    this.middleware.use(ethGetBlockNumber);
    this.middleware.use(netVersion);
    this._requestManager = new HttpRequestManger(host, {});
    this._id = 0;
    this._promises = {};
    this._connect();
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
    const requestManager = this._requestManager;
    const req = {
      payload,
      requestManager
    };

    const promise = new Promise((resolve, reject) => {
      this._promises[payload.id] = { resolve, reject };
    });
    const cb = (e, res) => {
      if (e !== null) this._promises[res.id].reject(e);
      this._promises[res.id].resolve(res.result);
    };

    this.middleware.run(req, cb).then(() => {
      this._requestManager.provider.send(req, cb);
    });

    return promise;
  }

  sendAsync(payload) {
    return this.send(payload.method, payload.params);
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
