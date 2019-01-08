import EtherScanRequestManger from './etherscan-request-manager';
import MiddleWare from '../middleware';
import {
  ethSendTransaction,
  ethSignTransaction,
  ethGetTransactionCount,
  ethSign,
  ethAccounts,
  ethCoinbase,
  netVersion,
  ethGetTransactionReceipt
} from '../methods';
import EtherscanProxy from '../etherscan-proxy';
class EtherscanProvider {
  constructor(host, options, store, eventHub) {
    this.host = host;
    this.apikey = options.apikey || 'DSH5B24BQYKD1AD8KUCDY3SAQSS6ZAU175';
    this.store = store;
    this.eventHub = eventHub;
    this.proxy = new EtherscanProxy(this.host, this.apikey);
    this.requestManager_ = new EtherScanRequestManger(host, options);
  }
  send(payload, callback) {
    const req = {
      payload,
      store: this.store,
      requestManager: this.requestManager_,
      eventHub: this.eventHub
    };
    const middleware = new MiddleWare();
    middleware.use(ethSendTransaction);
    middleware.use(ethSignTransaction);
    middleware.use(ethGetTransactionReceipt);
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
