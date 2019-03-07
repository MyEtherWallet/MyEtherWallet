import AbstractCallMethod from '../AbstractCallMethod';

export default class GetTransactionReceiptMethod extends AbstractCallMethod {
  constructor(utils, formatters) {
    super('eth_getTransactionReceipt', 1, utils, formatters);
  }
  afterExecution(response) {
    return response;
  }
}
