import Method from 'web3-core-method';
import utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';
class Web3Calls {
  constructor(requestManager) {
    const ethereumCalls = [
      new Method({
        name: 'getId',
        call: 'net_version',
        params: 0,
        outputFormatter: utils.hexToNumber
      }),
      new Method({
        name: 'getGasPrice',
        call: 'eth_gasPrice',
        params: 0
      }),
      new Method({
        name: 'estimateGas',
        call: 'eth_estimateGas',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.hexToNumber
      }),
      new Method({
        name: 'sendSignedTransaction',
        call: 'eth_sendRawTransaction',
        params: 1,
        inputFormatter: [null]
      }),
      new Method({
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [null]
      }),
      new Method({
        name: 'getTransactionCount',
        call: 'eth_getTransactionCount',
        params: 2,
        inputFormatter: [
          function(address) {
            if (utils.isAddress(address.toLowerCase())) {
              return address;
            }
            throw new Error(
              'Address ' +
                address +
                ' is not a valid address to get the "transactionCount".'
            );
          },
          function() {
            return 'latest';
          }
        ]
      })
    ];
    this.ethereumCalls = {};
    ethereumCalls.forEach(call => {
      call.attachToObject(this.ethereumCalls);
      call.setRequestManager(requestManager);
    });
    return this.ethereumCalls;
  }
}
export default Web3Calls;
