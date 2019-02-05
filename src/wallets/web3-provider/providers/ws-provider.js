import { WebsocketProvider as Web3WSProvider } from 'web3-providers';
import MiddleWare from '../middleware';
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
    const requestManager = new Web3WSProvider(host, options);
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
          requestManager,
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
          requestManager
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
