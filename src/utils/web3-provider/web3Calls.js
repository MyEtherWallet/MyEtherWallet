import Method from 'web3-core-method';
import utils from 'web3-utils';
import { formatters } from 'web3-core-helpers';

const outputBigNumberFormatter = function (number) {
  return utils.toBN(number).toString(10);
};
class Web3Calls {
  constructor(requestManager) {
    const ethereumCalls = [
      new Method({
        name: 'getId',
        call: 'net_version',
        params: 0,
        outputFormatter: utils.hexToNumber,
        requestManager
      }),
      new Method({
        name: 'getGasPrice',
        call: 'eth_gasPrice',
        params: 0,
        requestManager
      }),
      new Method({
        name: 'getBlockNumber',
        call: 'eth_blockNumber',
        params: 0,
        requestManager
      }),
      new Method({
        name: 'getMaxPriorityFeePerGas',
        call: 'eth_maxPriorityFeePerGas',
        params: 0,
        requestManager
      }),
      new Method({
        name: 'getBlockByNumber',
        call: 'eth_getBlockByNumber',
        params: 2,
        // copied from https://github.com/web3/web3.js/blob/1.x/packages/web3-core-helpers/src/formatters.js
        outputFormatter: function (block, hexFormat) {
          if (!hexFormat) {
            // transform to number
            block.gasLimit = utils.hexToNumber(block.gasLimit);
            block.gasUsed = utils.hexToNumber(block.gasUsed);
            block.size = utils.hexToNumber(block.size);
            block.timestamp = utils.hexToNumber(block.timestamp);
            if (block.number !== null)
              block.number = utils.hexToNumber(block.number);
          }

          if (block.difficulty)
            block.difficulty = outputBigNumberFormatter(block.difficulty);
          if (block.totalDifficulty)
            block.totalDifficulty = outputBigNumberFormatter(
              block.totalDifficulty
            );

          if (Array.isArray(block.transactions)) {
            block.transactions.forEach(function (item) {
              if (!(typeof item === 'string'))
                return formatters.outputTransactionFormatter(item, hexFormat);
            });
          }

          if (block.miner)
            block.miner = utils.toChecksumAddress(
              block.miner.replace('xdc', '0x')
            );

          if (block.baseFeePerGas)
            block.baseFeePerGas = utils.hexToNumber(block.baseFeePerGas);

          return block;
        },
        requestManager
      }),
      new Method({
        name: 'estimateGas',
        call: 'eth_estimateGas',
        params: 1,
        inputFormatter: [formatters.inputCallFormatter],
        outputFormatter: utils.hexToNumber,
        requestManager
      }),
      new Method({
        name: 'sendSignedTransaction',
        call: 'eth_sendRawTransaction',
        params: 1,
        inputFormatter: [null],
        requestManager
      }),
      new Method({
        name: 'getTransactionReceipt',
        call: 'eth_getTransactionReceipt',
        params: 1,
        inputFormatter: [null],
        requestManager
      }),
      new Method({
        name: 'getTransactionCount',
        call: 'eth_getTransactionCount',
        params: 2,
        inputFormatter: [
          function (address) {
            if (utils.isAddress(address.toLowerCase())) {
              return address;
            }
            throw new Error(
              'Address ' +
                address +
                ' is not a valid address to get the "transactionCount".'
            );
          },
          function () {
            return 'latest';
          }
        ],
        requestManager
      })
    ];
    this.ethereumCalls = {};
    ethereumCalls.forEach(call => {
      call.attachToObject(this.ethereumCalls);
    });
    return this.ethereumCalls;
  }
}
export default Web3Calls;
