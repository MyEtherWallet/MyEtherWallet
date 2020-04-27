import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSign,
  ethSignTransaction,
  ethGetTransactionCount,
  ethGetTransactionReceipt
} from '../methods';
class GivenProvider {
  constructor(host, options, store, eventHub) {
    this.givenProvider = Object.assign({}, host);
    const requestManager = new Web3RequestManager(host);
    options = options ? options : null;
    if (this.givenProvider.sendAsync) {
      this.givenProvider.send = this.givenProvider.sendAsync;
      delete this.givenProvider.sendAsync;
    }
    this.givenProvider.send_ = this.givenProvider.send;
    delete this.givenProvider.send;
    this.givenProvider.send = (payload, callback) => {
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
      middleware.run(req, callback).then(() => {
        this.givenProvider.send_(payload, callback);
      });
    };
    return this.givenProvider;
  }
}
export default GivenProvider;
