import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethGetTransactionCount,
  ethSign,
  ethAccounts,
  ethCoinbase,
  netVersion
} from '../methods';
import EtherscanProxy from '../etherscan-proxy';
class EtherscanProvider {
  constructor(host, options, store, eventHub) {
    this.host = host;
    this.apikey = options.apikey || 'DSH5B24BQYKD1AD8KUCDY3SAQSS6ZAU175';
    this.store = store;
    this.eventHub = eventHub;
    this.proxy = new EtherscanProxy(this.host, this.apikey);
  }
  send(payload, callback) {
    const req = {
      payload,
      store: this.store,
      requestManager: new Web3RequestManager(
        new EtherscanProvider(
          this.host,
          { apikey: this.apikey },
          this.store,
          this.eventHub
        )
      ),
      eventHub: this.eventHub
    };
    const middleware = new MiddleWare();
    middleware.use(ethSendTransaction);
    middleware.use(ethSignTransaction);
    middleware.use(ethSign);
    middleware.use(ethAccounts);
    middleware.use(ethGetTransactionCount);
    middleware.use(ethCoinbase);
    middleware.use(netVersion);
    middleware.use(async ({ payload }, res) => {
      this.proxy
        .request(payload)
        .then(body => {
          res(null, body);
        })
        .catch(err => {
          if (typeof err !== Error && err.error)
            err = new Error(err.error.message);
          res(err);
        });
    });
    middleware.run(req, callback).then(() => {
      callback(new Error('Etherscan doesnt support this function'));
    });
  }
  disconnect() {}
}
export default EtherscanProvider;
