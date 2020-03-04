import Web3WSProvider from './ws-web3-provider';
import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import workerTimer from '@/helpers/webWorkerTimer';
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
  constructor(host, options, store, eventHub) {
    this.wsProvider = new Web3WSProvider(host, options);
    this.oWSProvider = new Web3WSProvider(host, options);
    this.lastMessage = new Date().getTime();
    this.connectionRetries = 0;
    const keepAlive = () => {
      if (
        this.wsProvider.connectionId !==
          store.state.web3.currentProvider.connectionId &&
        this.lastMessage + 1 * 60 * 1000 < new Date().getTime()
      ) {
        this.wsProvider.disconnect();
        this.oWSProvider.disconnect();
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
        if (typeof this.wsProvider.connection.onerror === 'function') {
          this.wsProvider.connection.onerror(new Error('connection not open'));
        }
        callback(new Error('connection not open'));
        return;
      }
      const req = {
        payload,
        store,
        requestManager: new Web3RequestManager(this.oWSProvider),
        eventHub
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
    return this.wsProvider;
  }
}
export default WSProvider;
