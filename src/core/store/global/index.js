import { ref, computed } from 'vue';
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

const currNetwork = defaultNetwork
  ? Object.assign({}, defaultNetwork)
  : Object.assign({}, nodeList['ETH'][0]);
// const globalModule = {
//   getters: {

//   }
// };

export const useGlobalStore = defineStore('global', () => {
  // state
  const localStore = ref(true);
  const stateVersion = ref('1.0.9');
  const Errors = ref({});
  const online = ref(true);
  const linkQuery = ref({});
  const locale = ref('en_US');
  const gasLimitWarning = ref(100);
  const baseGasPrice = ref(toWei('41', 'gwei'));
  const gasPriceType = ref(gasPriceTypes.ECONOMY);
  const currentNetwork = ref(
    Object.assign({}, currNetwork, {
      name: currNetwork.type.name
    })
  );
  const validNetwork = ref(true);
  const preferredCurrency = ref('USD');
  const localContractsHolder = ref({});
  const eip1559 = ref({
    baseFeePerGas: '0',
    maxPriorityFeePerGas: '0'
  });
  const testing = ref(false);
  const darkMode = ref(false);

  // actions
  const setOnlineStatus = val => {
    const store = useWalletStore();
    if (val) store.setWeb3Instance();
    online.value = val;
  };
  const setLocale = val => {
    locale.value = val;
  };
  const setPreferredCurrency = val => {
    preferredCurrency.value = val;
  };
  const updateGasPrice = () => {
    const { web3 } = useWalletStore();
    const { gasPriceMultiplier } = network.value.type;
    if (!isEIP1559SupportedNetwork.value) {
      return web3.eth.getGasPrice().then(res => {
        const modifiedGasPrice = toBNSafe(res).muln(gasPriceMultiplier);
        return setGasPrice(modifiedGasPrice.toString());
      });
    }
    return web3.eth.getGasPrice().then(gasPrice => {
      const modGas = toBNSafe(gasPrice).muln(gasPriceMultiplier);
      const priorityFee = toBNSafe(modGas).sub(
        toBNSafe(eip1559.value.baseFeePerGas)
      );
      return setMaxPriorityFeePerGas(priorityFee);
    });
  };
  const setGasPrice = gasPrice => {
    baseGasPrice.value = gasPrice;
  };
  const setGasPriceType = type => {
    gasPriceType.value = type;
  };
  const setNetwork = async ({ network, walletType }) => {
    const { selectedEIP6963Provider } = useExternalStore();
    const { resetPrefetch } = useSwapStore();
    const chainID = network?.type?.chainID;
    const matched = await matchNetwork(
      chainID,
      walletType,
      selectedEIP6963Provider.value
    );
    if (matched) {
      const _netObj = Object.assign({}, network);
      _netObj.type = {
        name: network.type.name
      };
      currentNetwork.value = _netObj;
      resetPrefetch();
      return;
    }
    throw new Error('Network not found');
  };
  const setValidNetwork = valid => {
    validNetwork.value = valid;
  };
  const addLocalContract = localContract => {
    if (!localContractsHolder[currentNetwork.value.type.name])
      localContractsHolder[currentNetwork.value.type.name] = [];
    localContractsHolder[currentNetwork.value.type.name].push(localContract);
  };
  const setImportedState = stateObj => {
    stateObj['localStore'] = true;
    Object.keys(stateObj).forEach(item => {
      $state[item] = stateObj[item];
    });
  };
  const setMaxPriorityFeePerGas = valBN => {
    eip1559.value.maxPriorityFeePerGas = valBN.toString();
  };
  const setBaseFeePerGas = valBN => {
    eip1559.value.baseFeePerGas = valBN.toString();
  };
  const setDarkMode = val => {
    darkMode.value = val;
  };

  // getters
  const Networks = computed(() => {
    return nodeList;
  });
  const network = computed(() => {
    let locNetwork = nodeList['ETH'][0];
    if (!nodeList[currentNetwork.value.type.name]) {
      throw new Error('Current network is not in nodeList.');
    }
    const iteratableArr = nodeList[currentNetwork.value.type.name];
    locNetwork = Object.assign({}, currentNetwork.value);
    locNetwork.type = !isEmpty(nodeList[currentNetwork.value.type.name])
      ? nodeList[currentNetwork.value.type.name][0].type
      : ETH;
    for (let index = 0; index < iteratableArr.length; index++) {
      if (currentNetwork.value.service === iteratableArr[index].service) {
        locNetwork = iteratableArr[index];
        break;
      }
    }
    return locNetwork;
  });
  const gasPriceByType = computed(() => {
    return (type = 'economy') => {
      if (!isEIP1559SupportedNetwork.value) {
        return getGasBasedOnType(baseGasPrice.value, type);
      }
      const priorityFee = getPriorityFeeBasedOnType(
        toBN(eip1559.value.maxPriorityFeePerGas),
        type
      );
      const baseFee = getBaseFeeBasedOnType(
        toBN(eip1559.value.baseFeePerGas),
        type
      );
      return baseFee.add(priorityFee).toString();
    };
  });
  const gasPrice = computed(() => {
    if (!isEIP1559SupportedNetwork.value) {
      return getGasBasedOnType(baseGasPrice.value, gasPriceType.value);
    }
    return gasFeeMarketInfo.value.maxFeePerGas.toString();
  });
  const isEthNetwork = computed(() => {
    return network.value.type.name === ETH.name;
  });
  const isTestNetwork = computed(() => {
    return network.value.type.isTestNetwork;
  });
  const localContracts = computed(() => {
    return localContractsHolder[network.value.type.name]
      ? localContractsHolder[network.value.type.name]
      : [];
  });
  const hasSwap = computed(() => {
    const { instance } = useWalletStore();
    const name = network.value.type.name;
    const device = instance.value?.identifier;

    if (device === WALLET_TYPES.COOL_WALLET_S) return false;
    return name === ETH.name || name === BSC.name || name === MATIC.name;
  });
  const swapLink = computed(() => {
    const { address } = useWalletStore();
    const link = 'https://ccswap.myetherwallet.com/#/';
    return address.value ? `${link}?to=${address.value}` : link;
  });
  const currencyConfig = computed(() => {
    const { currencyRate } = useExternalStore();
    const currency = preferredCurrency.value;
    const rate = currencyRate.value.data
      ? currencyRate.value.data.exchange_rate
      : 1;
    return { currency, rate };
  });
  const getFiatValue = computed(() => {
    /**
     * @param {Number|String} value
     * @param {Object} options
     * @param {Boolean} options.doNotLocalize - formats value to currency, no rate
     * @returns - Formatted localized currency
     */
    return (value, options = {}) => {
      const config = options.doNotLocalize
        ? { currency: currencyConfig.value.currency }
        : currencyConfig.value;
      return formatFiatValue(value, config).value;
    };
  });
  const isEIP1559SupportedNetwork = computed(() => {
    return eip1559.value.baseFeePerGas !== '0';
  });
  const gasFeeMarketInfo = computed(() => {
    const priorityFee = getPriorityFeeBasedOnType(
      toBN(eip1559.value.maxPriorityFeePerGas),
      gasPriceType.value
    );
    const maxPriorityFeePerGas = getPriorityFeeBasedOnType(
      toBN(eip1559.value.maxPriorityFeePerGas),
      gasPriceTypes.FAST
    );
    const baseFee = getBaseFeeBasedOnType(
      toBN(eip1559.value.baseFeePerGas),
      gasPriceType.value
    );
    return {
      baseFeePerGas: baseFee,
      maxFeePerGas: baseFee.add(priorityFee),
      priorityFeePerGas: priorityFee,
      maxPriorityFeePerGas
    };
  });

  return {
    localStore,
    stateVersion,
    Errors,
    online,
    linkQuery,
    locale,
    gasLimitWarning,
    baseGasPrice,
    gasPriceType,
    currentNetwork,
    validNetwork,
    preferredCurrency,
    localContractsHolder,
    eip1559,
    testing,
    darkMode,
    setOnlineStatus,
    setLocale,
    setPreferredCurrency,
    updateGasPrice,
    setGasPrice,
    setGasPriceType,
    setNetwork,
    setValidNetwork,
    addLocalContract,
    setImportedState,
    setMaxPriorityFeePerGas,
    setBaseFeePerGas,
    setDarkMode,
    Networks,
    network,
    gasPriceByType,
    gasPrice,
    isEthNetwork,
    isTestNetwork,
    localContracts,
    hasSwap,
    swapLink,
    currencyConfig,
    getFiatValue,
    isEIP1559SupportedNetwork,
    gasFeeMarketInfo
  };
});
// implement later
// store.subscribe((mutation, state) => {
//   const modules = Object.keys(state);
//   modules.forEach(m => {
//     if (mutation.type.startsWith(m) && state[m].localStore) {
//       LocalStore.set(Configs.LOCAL_STORAGE_KEYS[m], state[m]);
//     }
//   });
// });
