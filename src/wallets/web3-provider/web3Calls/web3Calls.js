import { AbstractWeb3Module } from 'web3-core';

export default class Web3Calls extends AbstractWeb3Module {
  constructor(
    provider,
    providersModuleFactory,
    methodModuleFactory,
    methodFactory,
    utils,
    formatters,
    options
  ) {
    super(
      provider,
      providersModuleFactory,
      methodModuleFactory,
      methodFactory,
      options
    );

    this.utils = utils;
    this.formatters = formatters;
  }
}
