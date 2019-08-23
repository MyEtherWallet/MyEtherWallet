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
const _ = require('underscore');

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
      send: (recMethod, recParams = []) => {
        console.log(recMethod, recParams, 'send?');
        // console.log('sent something', recMethod, recParams);
        if (typeof recParams == 'function') {
          this.sendAsync(recMethod, (err, res) => {
            recParams(err, res);
          });
        } else {
          return new Promise((resolve, reject) => {
            // if (!method || typeof method !== 'string') {
            //   return reject(new Error('Method is not a valid string.'));
            // }
            // if (!(params instanceof Array)) {
            //   return reject(new Error('Params is not a valid array.'));
            // }
            const id = this._id++;
            const jsonrpc =
              typeof recMethod === 'string' ? '2.0' : recMethod.jsonrpc;
            const method =
              typeof method === 'string' ? recMethod : recMethod.method;
            const params =
              typeof method === 'string' ? recParams : recMethod.params;
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
              return resolve(res.result);
            };
            this.middleware.run(req, cb).then(() => {
              this.requestManager.provider.send(req.payload, cb);
            });
          });
        }
      },
      sendAsync: function(payload, cb) {
        console.log(
          'why must we suffer...',
          payload,
          this.send,
          this.httpProvider.send
        );
        if (typeof cb !== 'function') {
          // console.log('getting here?', payload);
          this.send(payload)
            .then(result => {
              console.log('or getting hereeeeee?', result);
              // result.id = payload.id ? payload.id : result.id;
              cb(null, result);
            })
            .catch(cb);
        } else {
          console.log(
            'or getting here11111?',
            payload,
            this.send,
            this.httpProvider.send
          );
          this.send(payload.method, payload.params)
            .then(result => {
              console.log('or getting hereeee2222?', result);
              result.id = payload.id ? payload.id : result.id;
              cb(null, result);
            })
            .catch(cb);
        }
      },
      setMaxListeners: this.setMaxListeners,
      on: this.on,
      emit: this.emit,
      removeListener: () => {
        this.removeListener();
        this.clearListeners();
      },
      enable: function() {
        console.log('reeeee', this.send);
        return this.send('eth_requestAccounts', []).then(res => {
          return res.result;
        });
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
