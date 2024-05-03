import { toBN } from 'web3-utils';
import { isEmpty } from 'lodash';

import { useWalletStore } from '../wallet';
import { useExternalStore } from '../external';

import nodeList from '@/utils/networks';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import {
  getGasBasedOnType,
  getPriorityFeeBasedOnType,
  getBaseFeeBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

const Networks = function () {
  return nodeList;
};
const network = function (state) {
  let network = nodeList['ETH'][0];
  if (!nodeList[state.currentNetwork.type.name]) {
    throw new Error('Current network is not in nodeList.');
  }
  const iteratableArr = nodeList[state.currentNetwork.type.name];
  network = Object.assign({}, state.currentNetwork);
  network.type = !isEmpty(nodeList[state.currentNetwork.type.name])
    ? nodeList[state.currentNetwork.type.name][0].type
    : ETH;
  for (let index = 0; index < iteratableArr.length; index++) {
    if (state.currentNetwork.service === iteratableArr[index].service) {
      network = iteratableArr[index];
      break;
    }
  }
  return network;
};
const gasPriceByType =
  state =>
  (type = 'economy') => {
    if (!this.isEIP1559SupportedNetwork) {
      return getGasBasedOnType(state.baseGasPrice, type);
    }
    const priorityFee = getPriorityFeeBasedOnType(
      toBN(state.eip1559.maxPriorityFeePerGas),
      type
    );
    const baseFee = getBaseFeeBasedOnType(
      toBN(state.eip1559.baseFeePerGas),
      type
    );
    return baseFee.add(priorityFee).toString();
  };
const gasPrice = function (state) {
  if (!this.isEIP1559SupportedNetwork) {
    return getGasBasedOnType(state.baseGasPrice, state.gasPriceType);
  }
  return this.gasFeeMarketInfo.maxFeePerGas.toString();
};

const isEthNetwork = function () {
  return this.network.type.name === ETH.name;
};
const isTestNetwork = function () {
  return this.network.type.isTestNetwork;
};

const localContracts = function () {
  return this.localContracts[this.network.type.name]
    ? this.localContracts[this.network.type.name]
    : [];
};

const hasSwap = function () {
  const { instance } = useWalletStore();
  const name = this.network.type.name;
  const device = instance?.identifier;

  if (device === WALLET_TYPES.COOL_WALLET_S) return false;
  return name === ETH.name || name === BSC.name || name === MATIC.name;
};

const swapLink = function () {
  const { address } = useWalletStore();
  const link = 'https://ccswap.myetherwallet.com/#/';
  return address ? `${link}?to=${address}` : link;
};
const currencyConfig = state => {
  const { currencyRate } = useExternalStore();
  const currency = state.preferredCurrency;
  const rate = currencyRate.data ? currencyRate.data.exchange_rate : 1;
  return { currency, rate };
};

const getFiatValue =
  () =>
  /**
   * @param {Number|String} value
   * @param {Object} options
   * @param {Boolean} options.doNotLocalize - formats value to currency, no rate
   * @returns - Formatted localized currency
   */
  (value, options = {}) => {
    const config = options.doNotLocalize
      ? { currency: this.currencyConfig.currency }
      : this.currencyConfig;
    return formatFiatValue(value, config).value;
  };

const isEIP1559SupportedNetwork = function (state) {
  return state.eip1559.baseFeePerGas !== '0';
};
const gasFeeMarketInfo = function (state) {
  const priorityFee = getPriorityFeeBasedOnType(
    toBN(state.eip1559.maxPriorityFeePerGas),
    state.gasPriceType
  );
  const maxPriorityFeePerGas = getPriorityFeeBasedOnType(
    toBN(state.eip1559.maxPriorityFeePerGas),
    gasPriceTypes.FAST
  );
  const baseFee = getBaseFeeBasedOnType(
    toBN(state.eip1559.baseFeePerGas),
    state.gasPriceType
  );
  return {
    baseFeePerGas: baseFee,
    maxFeePerGas: baseFee.add(priorityFee),
    priorityFeePerGas: priorityFee,
    maxPriorityFeePerGas
  };
};
export default {
  Networks,
  network,
  gasPrice,
  isEthNetwork,
  localContracts,
  currencyConfig,
  getFiatValue,
  isTestNetwork,
  hasSwap,
  swapLink,
  isEIP1559SupportedNetwork,
  gasFeeMarketInfo,
  gasPriceByType
};
