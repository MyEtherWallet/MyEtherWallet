import MEWCXProvider from '../providers/mew-cx-request-manager';
import MiddleWare from '../middleware';
import {
  ethSignTransaction,
  ethGetTransactionCount,
  ethGetTransactionReceipt,
  ethGetBlockByNumber,
  ethGetBlockNumber
} from '../methods';
import {
  WEB3_ACCOUNT_CHANGE,
  WEB3_NETWORK_CHANGE,
  WEB3_CHAIN_CHANGE
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
import {
  ethAccounts,
  ethCoinbase,
  ethSendTransaction,
  ethSign,
  ethRequestAccounts,
  netVersion
} from '../cx-web3-methods';

const EventEmitter = require('events');

class MewCxEthereum extends EventEmitter {
  constructor(host) {
    super();
    this.setMaxListeners(0);
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
    this._requestManager = new MEWCXProvider();
    this._id = 0;

    this.httpProvider = {
      send: (method, params = []) => {
        return new Promise((resolve, reject) => {
          if (!method || typeof method !== 'string') {
            return reject(new Error('Method is not a valid string.'));
          }
          if (!(params instanceof Array)) {
            return reject(new Error('Params is not a valid array.'));
          }
          const id = this._id++;
          const jsonrpc = '2.0';
          const payload = { jsonrpc, id, method, params };
          const requestManager = this._requestManager;
          const req = {
            payload,
            requestManager
          };
          const cb = (e, res) => {
            if (e) return reject(e);
            return resolve(res.result);
          };
          this.middleware.run(req, cb).then(() => {
            this._requestManager.provider.send(req, cb);
          });
        });
      },
      sendAsync: payload => {
        return this.send(payload.method, payload.params);
      },
      setMaxListeners: this.setMaxListeners,
      on: this.on,
      emit: this.emit,
      removeListener: () => {
        this.removeListener();
        this.clearListeners();
      },
      enable: () => {
        return this.send('eth_requestAccounts');
      }
    };

    return this.httpProvider;
  }

  setListeners() {
    const id = window.extensionID;
    window.addEventListener(
      WEB3_ACCOUNT_CHANGE.replace('{{id}}', id),
      eventRes => {
        this.emit('accountsChanged', [eventRes.detail.account]);
      }
    );
    window.addEventListener(
      WEB3_NETWORK_CHANGE.replace('{{id}}', id),
      eventRes => {
        this.emit('networkChanged', eventRes.detail.network);
      }
    );
    window.addEventListener(
      WEB3_CHAIN_CHANGE.replace('{{id}}', id),
      eventRes => {
        this.emit('chainChanged', eventRes.detail.chain);
      }
    );
  }

  clearListeners() {
    const id = window.extensionID;
    window.removeEventListener(
      WEB3_ACCOUNT_CHANGE.replace('{{id}}', id),
      function() {}
    );
    window.removeEventListener(
      WEB3_NETWORK_CHANGE.replace('{{id}}', id),
      function() {}
    );
    window.removeEventListener(
      WEB3_CHAIN_CHANGE.replace('{{id}}', id),
      function() {}
    );
  }
  _emitClose(code, reason) {
    this.emit('close', code, reason);
    this.httpProvider.removeAllListeners(); // not too sure about removing all listeners of this instance yet
  }
}

export { MewCxWeb3, MewCxEthereum };
