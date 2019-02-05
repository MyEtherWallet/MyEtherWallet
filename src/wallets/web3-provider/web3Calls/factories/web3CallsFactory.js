import Web3Calls from '../web3Calls';
import MethodFactory from './methodFactory';

export default class NetworkModuleFactory {
  constructor(utils, formatters) {
    this.utils = utils;
    this.formatters = formatters;
  }
  createNetworkModule(
    provider,
    providersModuleFactory,
    methodModuleFactory,
    options
  ) {
    return new Web3Calls(
      provider,
      providersModuleFactory,
      methodModuleFactory,
      this.createMethodFactory(methodModuleFactory),
      this.utils,
      this.formatters,
      options
    );
  }
  createMethodFactory(methodModuleFactory) {
    return new MethodFactory(methodModuleFactory, this.utils, this.formatters);
  }
}
