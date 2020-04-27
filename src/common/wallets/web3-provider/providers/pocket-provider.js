import PocketRequestManger from './pocket-request-manager';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethSign,
  ethAccounts,
  ethCoinbase,
  ethGetTransactionCount,
  ethGetTransactionReceipt,
  ethGetBlockByNumber,
  ethGetBlockNumber,
  netVersion
} from '../methods';
class PocketProvider {
  constructor(host, options, store, eventHub) {
    const requestManager = new PocketRequestManger(host);
    this.PocketProvider = {
      send: (payload, callback) => {
        const req = {
          payload,
          store,
          requestManager,
          eventHub
        };
        const middleware = new MiddleWare();
        middleware.use(ethSendTransaction);
        middleware.use(ethSignTransaction);
        middleware.use(ethGetTransactionCount);
        middleware.use(ethGetTransactionReceipt);
        middleware.use(ethSign);
        middleware.use(ethAccounts);
        middleware.use(ethCoinbase);
        middleware.use(ethGetBlockByNumber);
        middleware.use(ethGetBlockNumber);
        middleware.use(netVersion);
        middleware.run(req, callback).then(() => {
          requestManager.provider.send(payload, callback);
        });
      }
    };
    return this.PocketProvider;
  }
}
export default PocketProvider;
