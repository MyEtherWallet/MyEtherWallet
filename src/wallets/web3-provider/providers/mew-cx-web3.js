import MEWCXProvider from '../providers/mew-cx-request-manager';
import MiddleWare from '../middleware';
import {
  WEB3_NETWORK_CHANGE,
  WEB3_CHAIN_CHANGE,
  WEB3_INJECT_SUCCESS
} from '@/builds/mewcx/cxHelpers/cxEvents.js';
import {
  ethAccounts,
  ethCoinbase,
  ethSendTransaction,
  ethSign,
  ethRequestAccounts
} from '../cx-web3-methods';

const EventEmitter = require('events');

class MewCxEthereum extends EventEmitter {
  constructor(host) {
    super();
    this.host = host;
    this.middleware = new MiddleWare();
    this.middleware.use(ethRequestAccounts);
    this.middleware.use(ethSendTransaction);
    this.middleware.use(ethSign);
    this.middleware.use(ethAccounts);
    this.middleware.use(ethCoinbase);
    this.requestManager = new MEWCXProvider();
    this._id = 0;
    this.setListeners();

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
          const requestManager = this.requestManager;
          const req = {
            payload,
            requestManager
          };
          const cb = (e, res) => {
            if (e) {
              return reject(e);
            }
            return resolve(res);
          };
          this.middleware.run(req, cb).then(() => {
            this.requestManager.provider.send(req.payload, cb);
          });
        });
      },
      sendAsync: (payload, cb) => {
        this.httpProvider
          .send(payload.method, payload.params)
          .then(result => {
            result.id = payload.id ? payload.id : result.id;
            cb(null, result);
          })
          .catch(cb);
      },
      setMaxListeners: this.setMaxListeners,
      on: this.on,
      emit: this.emit,
      removeListener: () => {
        this.removeListener();
        this.clearListeners();
      },
      enable: function() {
        return this.send('eth_requestAccounts');
      }
    };

    return this.httpProvider;
  }

  setListeners() {
    const id = window.extensionID;
    const _self = this;
    window.addEventListener(
      WEB3_NETWORK_CHANGE.replace('{{id}}', id),
      eventRes => {
        _self.httpProvider.emit('networkChanged', eventRes.detail.payload);
      }
    );
    window.addEventListener(
      WEB3_CHAIN_CHANGE.replace('{{id}}', id),
      eventRes => {
        _self.httpProvider.emit('chainChanged', eventRes.detail.payload);
      }
    );

    window.addEventListener(WEB3_INJECT_SUCCESS.replace('{{id}}', id), () => {
      _self.httpProvider.emit('connect');
    });
  }

  clearListeners() {
    const id = window.extensionID;
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

export { MewCxEthereum };
