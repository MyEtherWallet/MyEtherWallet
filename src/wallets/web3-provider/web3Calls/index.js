import { formatters } from 'web3-core-helpers';
import * as Utils from 'web3-utils';
import Web3Calls from './web3Calls2';
import MethodFactory from './factories/methodFactory';

// eslint-disable-next-line no-unused-vars
export default (provider, net = null, options = {}) => {
  return new Web3Calls(
    provider,
    new MethodFactory(Utils, formatters),
    Utils,
    formatters,
    options,
    null
  );
};
