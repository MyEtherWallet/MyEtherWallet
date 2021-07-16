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
    this.givenProvider = host;
    const requestManager = new Web3RequestManager(host);
    if (this.givenProvider.request) {
      this.givenProvider.request_ = this.givenProvider.request;
      delete this.givenProvider.request;
    }
    if (this.givenProvider.send) {
      this.givenProvider.send_ = this.givenProvider.send;
      delete this.givenProvider.send;
    }
    this.givenProvider.request = payload => {
      return new Promise((resolve, reject) => {
        const callback = (error, result) => {
          if (error) return reject(error.error);
          return resolve(result.result);
        };
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
          this.givenProvider.request_(payload).then(resolve).catch(reject);
        });
      });
    };
    return this.givenProvider;
  }
}
export default GivenProvider;
