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
class CustomRequestManager extends Web3RequestManager {
  constructor(host) {
    super(host);
  }
  request(payload) {
    return this.provider.request_(payload);
  }
  send({ method, params }, callback) {
    this.provider
      .request_({ method, params })
      .then(res => {
        callback(null, res);
      })
      .catch(err => callback(err));
  }
}
class GivenProvider {
  constructor(host) {
    this.givenProvider = host;
    const requestManager = new CustomRequestManager(host);
    if (this.givenProvider.request && !this.givenProvider.request_) {
      this.givenProvider.request_ = this.givenProvider.request;
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
export { CustomRequestManager };
export default GivenProvider;
