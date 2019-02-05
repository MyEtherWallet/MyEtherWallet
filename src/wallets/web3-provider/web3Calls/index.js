import { ProvidersModuleFactory } from 'web3-providers';
import { MethodModuleFactory } from 'web3-core-method';
import { formatters } from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import web3CallsFactory from './factories/web3CallsFactory';

export default (provider, options) => {
  return new web3CallsFactory(Utils, formatters).createNetworkModule(
    provider,
    new ProvidersModuleFactory(),
    new MethodModuleFactory(),
    options
  );
};
