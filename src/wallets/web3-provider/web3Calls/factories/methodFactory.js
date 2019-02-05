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
  constructor(methodModuleFactory, utils, formatters) {
    super(methodModuleFactory, utils, formatters);
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
