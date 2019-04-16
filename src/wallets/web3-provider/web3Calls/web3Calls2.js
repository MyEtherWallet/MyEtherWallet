import { AbstractWeb3Module } from 'web3-core';
export default class web3Calls extends AbstractWeb3Module {
  constructor(provider, methodFactory, utils, formatters, options, nodeNet) {
    super(provider, options, methodFactory, nodeNet);
    this.utils = utils;
    this.formatters = formatters;
  }
}
