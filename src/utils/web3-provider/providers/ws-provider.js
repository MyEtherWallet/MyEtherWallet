import Web3WSProvider from './ws-web3-provider';
import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import workerTimer from '@/core/helpers/webWorkerTimer.js';
import { EventBus } from '@/core/plugins/eventBus';
import VuexStore from '@/core/store';
import { Toast, SENTRY } from '@/modules/toast/handler/handlerToast';
import { v4 as uuidv4 } from 'uuid';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  ethAccounts,
  ethCoinbase,
  ethGetTransactionCount,
  netVersion
} from '../methods';
const MAX_RETRIES = 10;
class WSProvider {
  constructor(host, options) {
    this.wsProvider = new Web3WSProvider(host, options);
    this.oWSProvider = new Web3WSProvider(host, options);
    this.lastMessage = new Date().getTime();
    this.connectionRetries = 0;
    const keepAlive = () => {
      if (
        this.wsProvider.connection.readyState == this.wsProvider.connection.OPEN
      ) {
        this.wsProvider.connection.send('');
      }
      if (
        this.oWSProvider.connection.readyState ==
        this.oWSProvider.connection.OPEN
      ) {
        this.oWSProvider.connection.send('');
      }
      if (
        this.wsProvider.connectionId !==
        VuexStore.state.wallet.web3.currentProvider.connectionId
      ) {
        if (this.wsProvider) {
          this.wsProvider.disconnect();
        }
        if (this.oWSProvider) {
          this.oWSProvider.disconnect();
        }
        workerTimer.clearInterval(this.keepAliveTimer);
      }
    };
    this.wsProvider.connectionId = `${new Date().getTime()}${Math.floor(
      Math.random() * 1000
    )}`;
    this.keepAliveTimer = workerTimer.setInterval(keepAlive, 5000);
    delete this.wsProvider['send'];
    this.wsProvider.send = (payload, callback) => {
      this.lastMessage = new Date().getTime();
      if (
        this.wsProvider.connection.readyState ===
        this.wsProvider.connection.CONNECTING
      ) {
        setTimeout(() => {
          this.wsProvider.send(payload, callback);
        }, 100);
        return;
      }
      if (this.connectionRetries < MAX_RETRIES) {
        if (
          this.wsProvider.connection.readyState !==
          this.wsProvider.connection.OPEN
        ) {
          this.connectionRetries++;
          const tempConn = new Web3WSProvider(host, options);
          delete tempConn['send'];
          Object.assign(this.wsProvider, tempConn);
          setTimeout(() => {
            this.wsProvider.send(payload, callback);
          }, 1000);
          return;
        }
        if (
          this.oWSProvider.connection.readyState !==
            this.oWSProvider.connection.OPEN &&
          this.oWSProvider.connection.readyState !==
            this.oWSProvider.connection.CONNECTING
        ) {
          this.connectionRetries++;
          this.oWSProvider.connection = new Web3WSProvider(
            host,
            options
          ).connection;
        }
      }
      if (
        this.wsProvider.connection.readyState !==
        this.wsProvider.connection.OPEN
      ) {
        Toast('connection not open', {}, SENTRY);
        return;
      }
      const req = {
        payload,
        store: VuexStore,
        requestManager: new Web3RequestManager(this.oWSProvider),
        eventHub: EventBus
      };
      const middleware = new MiddleWare();
      middleware.use(ethSendTransaction);
      middleware.use(ethSignTransaction);
      middleware.use(ethSign);
      middleware.use(ethAccounts);
      middleware.use(ethGetTransactionCount);
      middleware.use(ethCoinbase);
      middleware.use(netVersion);
      middleware.run(req, callback).then(() => {
        this.wsProvider.connection.send(JSON.stringify(payload));
        this.wsProvider._addResponseCallback(payload, callback);
      });
    };
    this.wsProvider.request = payload => {
      return new Promise((resolve, reject) => {
        this.wsProvider.send(
          {
            jsonrpc: '2.0',
            id: uuidv4(),
            method: payload.method,
            params: payload.params
          },
          (err, res) => {
            if (err) return reject(err);
            else if (res.error) return reject(res.error);
            resolve(res.result);
          }
        );
      });
    };
    return this.wsProvider;
  }
}
export default WSProvider;
