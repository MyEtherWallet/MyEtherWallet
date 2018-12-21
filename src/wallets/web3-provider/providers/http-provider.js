import Web3HttpProvider from 'web3-providers-http';
import { errors } from 'web3-core-helpers';
import { Manager as Web3RequestManager } from 'web3-core-requestmanager';
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
    const _this = this.httpProvider;
    const requestManager = new Web3RequestManager(
      new Web3HttpProvider(host, options)
    );
    delete this.httpProvider['send'];
    this.httpProvider.send = (payload, callback) => {
      const request = _this._prepareRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.timeout !== 1) {
          let result = request.responseText;
          let error = null;
          try {
            result = JSON.parse(result);
          } catch (e) {
            error = errors.InvalidResponse(request.responseText);
          }

          _this.connected = true;
          callback(error, result);
        }
      };

      request.ontimeout = function() {
        _this.connected = false;
        callback(errors.ConnectionTimeout(_this.timeout));
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
      middleware.use(ethGetTransactionCount);
      middleware.use(ethGetTransactionReceipt);
      middleware.use(ethSign);
      middleware.use(ethAccounts);
      middleware.use(ethCoinbase);
      middleware.use(netVersion);
      middleware.run(req, callback).then(() => {
        try {
          request.send(JSON.stringify(payload));
        } catch (error) {
          _this.connected = false;
          callback(errors.InvalidConnection(_this.host));
        }
      });
    };
    return this.httpProvider;
  }
}
export default HttpProvider;
