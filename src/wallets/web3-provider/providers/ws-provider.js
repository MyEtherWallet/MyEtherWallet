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
class WSProvider {
  constructor(host, options, store, eventHub) {
    this.wsProvider = new Web3WSProvider(host, options);
    this.oWSProvider = new Web3WSProvider(host, options);
    this.lastMessage = new Date().getTime();
    const keepAlive = () => {
      if (
        !Object.is(this.wsProvider, store.state.web3.currentProvider) &&
        this.lastMessage + 5 * 60 * 1000 < new Date().getTime() //wait extra 10 minutes
      ) {
        this.wsProvider.disconnect();
        this.oWSProvider.disconnect();
        workerTimer.clearInterval(this.keepAliveTimer);
      }
    };
    this.keepAliveTimer = workerTimer.setInterval(keepAlive, 5000);
    const _this = this.wsProvider;
    delete this.wsProvider['send'];
    this.wsProvider.send = (payload, callback) => {
      this.lastMessage = new Date().getTime();
      if (_this.connection.readyState === _this.connection.CONNECTING) {
        setTimeout(() => {
          this.wsProvider.send(payload, callback);
        }, 10);
        return;
      }
      if (_this.connection.readyState !== _this.connection.OPEN) {
        if (typeof _this.connection.onerror === 'function') {
          _this.connection.onerror(new Error('connection not open'));
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
        _this.connection.send(JSON.stringify(payload));
        _this._addResponseCallback(payload, callback);
      });
    };
    return this.wsProvider;
  }
}
export default WSProvider;
