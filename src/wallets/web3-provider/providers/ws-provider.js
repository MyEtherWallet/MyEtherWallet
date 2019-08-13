import Web3WSProvider from 'web3-providers-ws';
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
        this.oWSProvider.connection.readyState ===
        this.oWSProvider.connection.OPEN
      )
        this.wsProvider.connection.send(
          '{"jsonrpc":"2.0","method":"net_version","params":[],"id":0}'
        );
      if (
        this.wsProvider.connection.readyState ===
        this.wsProvider.connection.OPEN
      )
        this.oWSProvider.connection.send(
          '{"jsonrpc":"2.0","method":"net_version","params":[],"id":1}'
        );
      if (
        !Object.is(this.wsProvider, store.state.web3.currentProvider) &&
        this.lastMessage + 10 * 60 * 1000 < new Date().getTime() //wait extra 10 minutes
      ) {
        this.wsProvider.disconnect();
        this.oWSProvider.disconnect();
        workerTimer.clearInterval(this.keepAliveTimer);
      }
    };
    this.keepAliveTimer = workerTimer.setInterval(keepAlive, 5000);
    delete this.wsProvider['sendPayload'];
    this.wsProvider.sendPayload = payload => {
      return new Promise((resolve, reject) => {
        const callback = (err, res) => {
          if (err) return reject(new Error(err));
          return resolve(res);
        };
        const req = {
          payload,
          store,
          requestManager: this.oWSProvider,
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
          this.oWSProvider
            .sendPayload(payload)
            .then(resolve)
            .catch(reject);
        });
      });
    };
    return this.wsProvider;
  }
}
export default WSProvider;
