import { AbstractMethod } from 'web3-core-method';

export default class GetTransactionReceiptMethod extends AbstractMethod {
  constructor(utils, formatters) {
    super('eth_getTransactionReceipt', 1, utils, formatters);
  }
  afterExecution(response) {
    return response;
  }
}
