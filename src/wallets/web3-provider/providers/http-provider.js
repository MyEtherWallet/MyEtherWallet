/* eslint-disable */
import { HttpProvider as Web3HttpProvider } from 'web3-providers';
import { errors } from 'web3-core-helpers';
import MiddleWare from '../middleware';
// import {
//   ethSendTransaction,
//   ethSignTransaction,
//   ethSign,
//   ethAccounts,
//   ethCoinbase,
//   ethGetTransactionCount,
//   ethGetTransactionReceipt,
//   netVersion
// } from '../methods';
class HttpProvider {
  constructor(host, options, store, eventHub) {
    this.httpProvider = new Web3HttpProvider(host, options);
    const _this = this.httpProvider;
    const requestManager = new Web3HttpProvider(host, options);
    delete this.httpProvider['sendPayload'];
    this.httpProvider.sendPayload = (payload) => {
      console.log(payload)
      return new Promise((resolve, reject) => {
        const request = _this.providersModuleFactory.createXMLHttpRequest(
          _this.host,
          _this.timeout,
          _this.headers,
          _this.agent
        );

        request.onreadystatechange = () => {
          if (request.readyState !== 0 && request.readyState !== 1) {
            _this.connected = true;
          }

          if (request.readyState === 4 && request.status === 200) {
            try {
              return resolve(JSON.parse(request.responseText));
            } catch (error) {
              reject(new Error(`Invalid JSON as response: ${request.responseText}`));
            }
          }
        };

        request.ontimeout = () => {
          _this.connected = false;

          reject(new Error(`Connection error: Timeout exceeded after ${_this.timeout}ms`));
        };

        try {
          request.send(JSON.stringify(payload));
        } catch (error) {
          if (error.constructor.name === 'NetworkError') {
            _this.connected = false;
          }

          reject(error);
        }
      });
      // const request = _this._prepareRequest();
      // request.onreadystatechange = function() {
      //   if (request.readyState === 4 && request.timeout !== 1) {
      //     let result = request.responseText;
      //     let error = null;
      //     try {
      //       result = JSON.parse(result);
      //     } catch (e) {
      //       error = errors.InvalidResponse(request.responseText);
      //     }

      //     _this.connected = true;
      //     callback(error, result);
      //   }
      // };

      // request.ontimeout = function() {
      //   _this.connected = false;
      //   callback(errors.ConnectionTimeout(_this.timeout));
      // };
      // const req = {
      //   payload,
      //   store,
      //   requestManager,
      //   eventHub
      // };
      // const middleware = new MiddleWare();
      // middleware.use(ethSendTransaction);
      // middleware.use(ethSignTransaction);
      // middleware.use(ethGetTransactionCount);
      // middleware.use(ethGetTransactionReceipt);
      // middleware.use(ethSign);
      // middleware.use(ethAccounts);
      // middleware.use(ethCoinbase);
      // middleware.use(netVersion);
      // middleware.run(req, callback).then(() => {
      //   try {
      //     request.send(JSON.stringify(payload));
      //   } catch (error) {
      //     _this.connected = false;
      //     callback(errors.InvalidConnection(_this.host));
      //   }
      // });
    };
    return this.httpProvider;
  }
}
export default HttpProvider;
