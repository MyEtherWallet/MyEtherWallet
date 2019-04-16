import {
  AbstractMethodFactory,
  GetGasPriceMethod,
  EstimateGasMethod,
  SendRawTransactionMethod,
  VersionMethod,
  GetTransactionCountMethod
} from 'web3-core-method';
import GetTransactionReceiptMethod from '../methods/GetTransactionReceiptMethod';
export default class MethodFactory extends AbstractMethodFactory {
  constructor(utils, formatters) {
    super(utils, formatters);
    this.methods = {
      getId: VersionMethod,
      getGasPrice: GetGasPriceMethod,
      estimateGas: EstimateGasMethod,
      sendSignedTransaction: SendRawTransactionMethod,
      getTransactionCount: GetTransactionCountMethod,
      getTransactionReceipt: GetTransactionReceiptMethod
    };
  }
}
