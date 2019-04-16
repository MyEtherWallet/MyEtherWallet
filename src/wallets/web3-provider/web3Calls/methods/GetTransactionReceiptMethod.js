import { AbstractMethod } from 'web3-core-method';

export default class GetTransactionReceiptMethod extends AbstractMethod {
  constructor(utils, formatters, moduleInstance) {
    super('eth_getTransactionReceipt', 1, utils, formatters, moduleInstance);
  }
  afterExecution(response) {
    return response;
  }
}
