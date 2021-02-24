import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import { EventBus } from '@/core/plugins/eventBus';
import VuexStore from '@/core/store';
import {
  ethSendTransaction,
  ethSign,
  ethSignTransaction,
  ethGetTransactionCount
} from '../methods';
class GivenProvider {
  constructor(host) {
    this.givenProvider = Object.assign({}, host);
    const requestManager = new Web3RequestManager(host);
    if (this.givenProvider.sendAsync) {
      this.givenProvider.send = this.givenProvider.sendAsync;
      delete this.givenProvider.sendAsync;
    }
    this.givenProvider.send_ = this.givenProvider.send;
    delete this.givenProvider.send;
    this.givenProvider.send = (payload, callback) => {
      const req = {
        payload,
        store: VuexStore,
        requestManager,
        eventHub: EventBus
      };
      const middleware = new MiddleWare();
      middleware.use(ethSendTransaction);
      middleware.use(ethSignTransaction);
      middleware.use(ethGetTransactionCount);
      middleware.use(ethSign);
      middleware.run(req, callback).then(() => {
        this.givenProvider.send_(payload, callback);
      });
    };
    return this.givenProvider;
  }
}
export default GivenProvider;
