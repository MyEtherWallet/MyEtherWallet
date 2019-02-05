import { HttpProvider as Web3HttpProvider } from 'web3-providers';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  ethAccounts,
  ethCoinbase,
  ethGetTransactionCount,
  ethGetTransactionReceipt,
  netVersion
} from '../methods';
class HttpProvider {
  constructor(host, options, store, eventHub) {
    this.httpProvider = new Web3HttpProvider(host, options);
    const requestManager = new Web3HttpProvider(host, options);
    delete this.httpProvider['sendPayload'];
    this.httpProvider.sendPayload = payload => {
      console.log(payload);
      return new Promise((resolve, reject) => {
        const req = {
          payload,
          store,
          requestManager,
          eventHub
        };
        const callback = (err, res) => {
          if (err) return reject(new Error(err));
          return resolve(res);
        };
        const middleware = new MiddleWare();
        middleware.use(ethSendTransaction);
        middleware.use(ethSignTransaction);
        middleware.use(ethGetTransactionCount);
        middleware.use(ethGetTransactionReceipt);
        middleware.use(ethSign);
        middleware.use(ethAccounts);
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
    return this.httpProvider;
  }
}
export default HttpProvider;
