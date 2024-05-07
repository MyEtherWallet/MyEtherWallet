import { defineStore } from 'pinia';

import { toWei, toBN } from 'web3-utils';
import { isEmpty } from 'lodash';

import { ETH, BSC, MATIC } from '@/utils/networks/types';
import {
  getGasBasedOnType,
  getPriorityFeeBasedOnType,
  getBaseFeeBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

import nodeList from '@/utils/networks';
const defaultNetwork = nodeList['ETH'].find(item => {
  return item.service === 'myetherwallet.com-ws';
});

import matchNetwork from '@/core/helpers/matchNetwork';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { useSwapStore } from '../swap';
import { useWalletStore } from '../wallet';
import { useExternalStore } from '../external';

const currentNetwork = defaultNetwork
  ? Object.assign({}, defaultNetwork)
  : Object.assign({}, nodeList['ETH'][0]);
const globalModule = {
  state: () => ({
    localStore: true,
    Errors: {},
    online: true,
    linkQuery: {},
    locale: 'en_US',
    stateVersion: '1.0.9',
    gasLimitWarning: 100,
    baseGasPrice: toWei('41', 'gwei'),
    gasPriceType: gasPriceTypes.ECONOMY,
    currentNetwork: Object.assign({}, currentNetwork, {
      name: currentNetwork.type.name
    }),
    validNetwork: true,
    preferredCurrency: 'USD',
    localContractsHolder: {},
    eip1559: {
      baseFeePerGas: '0',
      maxPriorityFeePerGas: '0'
    },
    testing: false,
    darkMode: false
  }),
  actions: {
    setOnlineStatus(val) {
      const store = useWalletStore();
      if (val) store.setWeb3Instance();
      this.online = val;
    },
    setLocale(val) {
      this.locale = val;
    },
    setPreferredCurrency(val) {
      this.preferredCurrency = val;
    },
    updateGasPrice() {
      const { web3 } = useWalletStore();
      const { gasPriceMultiplier } = this.network.type;
      if (!this.isEIP1559SupportedNetwork) {
        return web3.eth.getGasPrice().then(res => {
          const modifiedGasPrice = toBNSafe(res).muln(gasPriceMultiplier);
          return this.setGasPrice(modifiedGasPrice.toString());
        });
      }
      return web3.eth.getGasPrice().then(gasPrice => {
        const modGas = toBNSafe(gasPrice).muln(gasPriceMultiplier);
        const priorityFee = toBNSafe(modGas).sub(
          toBNSafe(this.eip1559.baseFeePerGas)
        );
        return this.setMaxPriorityFeePerGas(priorityFee);
      });
    },
    setGasPrice(gasPrice) {
      this.baseGasPrice = gasPrice;
    },
    setGasPriceType(type) {
      this.gasPriceType = type;
    },
    async setNetwork({ network, walletType }) {
      const { selectedEIP6963Provider } = useExternalStore();
      const { resetPrefetch } = useSwapStore();
      const chainID = network?.type?.chainID;
      const matched = await matchNetwork(
        chainID,
        walletType,
        selectedEIP6963Provider
      );
      if (matched) {
        const _netObj = Object.assign({}, network);
        _netObj.type = {
          name: network.type.name
        };
        this.currentNetwork = _netObj;
        resetPrefetch();
        return;
      }
      throw new Error('Network not found');
    },
    setValidNetwork(valid) {
      this.validNetwork = valid;
    },
    addLocalContract(localContract) {
      if (!this.localContractsHolder[this.currentNetwork.type.name])
        this.localContractsHolder[this.currentNetwork.type.name] = [];
      this.localContractsHolder[this.currentNetwork.type.name].push(
        localContract
      );
    },
    setImportedState(stateObj) {
      stateObj['localStore'] = true;
      Object.keys(stateObj).forEach(item => {
        this.$state[item] = stateObj[item];
      });
    },
    setMaxPriorityFeePerGas(valBN) {
      this.eip1559.maxPriorityFeePerGas = valBN.toString();
    },
    setBaseFeePerGas(valBN) {
      this.eip1559.baseFeePerGas = valBN.toString();
    },
    setDarkMode(val) {
      this.darkMode = val;
    }
  },
  getters: {
    Networks() {
      return nodeList;
    },
    network(state) {
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
    },
    gasPriceByType(state) {
      return (type = 'economy') => {
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
    },
    gasPrice(state) {
      if (!this.isEIP1559SupportedNetwork) {
        return getGasBasedOnType(state.baseGasPrice, state.gasPriceType);
      }
      return this.gasFeeMarketInfo.maxFeePerGas.toString();
    },

    isEthNetwork() {
      return this.network.type.name === ETH.name;
    },
    isTestNetwork() {
      return this.network.type.isTestNetwork;
    },

    localContracts() {
      return this.localContractsHolder[this.network.type.name]
        ? this.localContractsHolder[this.network.type.name]
        : [];
    },

    hasSwap() {
      const { instance } = useWalletStore();
      const name = this.network.type.name;
      const device = instance?.identifier;

      if (device === WALLET_TYPES.COOL_WALLET_S) return false;
      return name === ETH.name || name === BSC.name || name === MATIC.name;
    },

    swapLink() {
      const { address } = useWalletStore();
      const link = 'https://ccswap.myetherwallet.com/#/';
      return address ? `${link}?to=${address}` : link;
    },
    currencyConfig(state) {
      const { currencyRate } = useExternalStore();
      const currency = state.preferredCurrency;
      const rate = currencyRate.data ? currencyRate.data.exchange_rate : 1;
      return { currency, rate };
    },
    getFiatValue() {
      /**
       * @param {Number|String} value
       * @param {Object} options
       * @param {Boolean} options.doNotLocalize - formats value to currency, no rate
       * @returns - Formatted localized currency
       */
      return (value, options = {}) => {
        const config = options.doNotLocalize
          ? { currency: this.currencyConfig.currency }
          : this.currencyConfig;
        return formatFiatValue(value, config).value;
      };
    },
    isEIP1559SupportedNetwork(state) {
      return state.eip1559.baseFeePerGas !== '0';
    },
    gasFeeMarketInfo(state) {
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
    }
  }
};

export const useGlobalStore = defineStore('global', globalModule);
// implement later
// store.subscribe((mutation, state) => {
//   const modules = Object.keys(state);
//   modules.forEach(m => {
//     if (mutation.type.startsWith(m) && state[m].localStore) {
//       LocalStore.set(Configs.LOCAL_STORAGE_KEYS[m], state[m]);
//     }
//   });
// });
