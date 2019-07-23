import HttpRequestManger from '../providers/http-request-manager';
import MiddleWare from '../middleware';
import {
  ethAccounts,
  ethCoinbase,
  ethSendTransaction,
  ethSign
} from '../cx-web3-methods';

import { ethRequestAccounts } from '../cx-ethereum-methods';
import { EventEmitter } from 'events';
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
    const requestManager = new HttpRequestManger(host, {});
    this.httpProvider = {
      send: (method, callback) => {
        const payload = {
          jsonrpc: '2,0',
          method: method,
          params: []
        };

        const req = {
          payload,
          requestManager
        };
        const middleware = new MiddleWare();
        middleware.use(ethRequestAccounts);
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      }
      // sendAsync: (payload, callback) => {
      //   return this.send().then()
      // }
    };
    return this.httpProvider;
  }
}

export { MewCxWeb3, MewCxEthereum };
