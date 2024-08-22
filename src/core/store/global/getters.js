import nodeList from '@/utils/networks';
import {
  ETH,
  BSC,
  MATIC,
  ROOTSTOCK,
  ETC,
  XDC,
  MOONBEAM,
  MOONRIVER,
  AURORA,
  ARB,
  FTM,
  GNO,
  OP,
  COTI
} from '@/utils/networks/types';
import {
  getGasBasedOnType,
  getPriorityFeeBasedOnType,
  getBaseFeeBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { toBN } from 'web3-utils';
import { isEmpty } from 'lodash';
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
  (state, getters) =>
  (type = 'economy') => {
    if (!getters.isEIP1559SupportedNetwork) {
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
const gasPrice = function (state, getters) {
  if (!getters.isEIP1559SupportedNetwork) {
    return getGasBasedOnType(state.baseGasPrice, state.gasPriceType);
  }
  return getters.gasFeeMarketInfo.maxFeePerGas.toString();
};

const isEthNetwork = function (state, getters) {
  return getters.network.type.name === ETH.name;
};
const isTestNetwork = function (state, getters) {
  return getters.network.type.isTestNetwork;
};

const localContracts = function (state, getters) {
  return state.localContracts[getters.network.type.name]
    ? state.localContracts[getters.network.type.name]
    : [];
};

const hasSwap = function (state, getters, rootState) {
  const name = getters.network.type.name;
  const device = rootState.wallet.instance?.identifier;

  if (device === WALLET_TYPES.COOL_WALLET_S) return false;
  return (
    name === ETH.name ||
    name === BSC.name ||
    name === MATIC.name ||
    name === ROOTSTOCK.name ||
    name === ETC.name ||
    name === XDC.name ||
    name === MOONBEAM.name ||
    name === MOONRIVER.name ||
    name === AURORA.name ||
    name === ARB.name ||
    name === FTM.name ||
    name === GNO.name ||
    name === OP.name ||
    name === COTI.name
  );
};

const swapLink = function (state, getters, rootState) {
  const hasAddress = rootState.wallet.address;
  const link = 'https://ccswap.myetherwallet.com/#/';
  return hasAddress ? `${link}?to=${hasAddress}` : link;
};
const currencyConfig = (state, getters, rootState) => {
  const currency = state.preferredCurrency;
  const { currencyRate } = rootState.external;
  const rate = currencyRate.data ? currencyRate.data.exchange_rate : 1;
  return { currency, rate };
};

const getFiatValue =
  (state, getters) =>
  /**
   * @param {Number|String} value
   * @param {Object} options
   * @param {Boolean} options.doNotLocalize - formats value to currency, no rate
   * @returns - Formatted localized currency
   */
  (value, options = {}) => {
    const config = options.doNotLocalize
      ? { currency: getters.currencyConfig.currency }
      : getters.currencyConfig;
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
