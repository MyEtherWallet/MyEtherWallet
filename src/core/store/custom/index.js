import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import store from 'store';
import BigNumber from 'bignumber.js';
import Vue from 'vue';
import { isAddress } from 'web3-utils';

import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';

import Configs from '../configs';
import { fromBase } from '@/core/helpers/unit';
import {
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import abi from '@/modules/balance/handlers/abiERC20.js';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';

export const useCustomStore = defineStore('custom', () => {
  const localStore = ref(true);
  const tokens = ref({});
  const paths = ref([]);
  const stateVersion = ref('1.0.4');
  const addressBook = ref([]);
  const hiddenTokensHolder = ref({});

  // actions
  const initStore = () => {
    if (store.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
      const savedStore = store.get(Configs.LOCAL_STORAGE_KEYS.custom);
      if (savedStore.stateVersion === Configs.VERSION.custom) {
        $patch(Object.assign($state, savedStore));
      }
    }
  };
  const setCustomToken = token => {
    const { network } = useGlobalStore();
    let customTokensByNetwork = tokens.value[network.value.type.name];
    if (!tokens.value[network.value.type.name]) {
      customTokensByNetwork = [];
    }
    const found = customTokensByNetwork.findIndex(
      t => t.contract.toLowerCase() === token.contract.toLowerCase()
    );
    if (found !== -1) {
      customTokensByNetwork[found] = token;
    } else {
      customTokensByNetwork.unshift(token);
    }
    Vue.set(tokens, network.value.type.name, customTokensByNetwork);
  };
  const deleteToken = token => {
    const { network } = useGlobalStore();
    const currentCustomTokens = tokens.value[network.value.type.name].filter(
      currentTokens => {
        const found = token.find(item => {
          if (item.address === currentTokens.contract) {
            return item;
          }
        });
        if (found && hiddenTokens.value.length > 0) {
          const newHiddenTokens = hiddenTokens.value.filter(item => {
            return found.address !== item.address;
          });
          Vue.set(hiddenTokens.value, network.value.type.name, newHiddenTokens);
        }
        if (!found) {
          return currentTokens;
        }
      }
    );
    Vue.set(tokens, network.value.type.name, currentCustomTokens);
  };
  const deleteAll = () => {
    const { network } = useGlobalStore();

    let customTokensByNetwork = tokens.value[network.value.type.name];
    customTokensByNetwork = [];
    Vue.set(tokens.value, network.value.type.name, customTokensByNetwork);
  };
  const setHiddenToken = token => {
    const { network } = useGlobalStore();

    let hiddenTokensByNetwork = hiddenTokens.value[network.value.type.name];
    if (!hiddenTokens[network.value.type.name]) {
      hiddenTokensByNetwork = [];
    }
    const found = hiddenTokensByNetwork.findIndex(
      t => t.address.toLowerCase() === token.address.toLowerCase()
    );
    if (found !== -1) {
      hiddenTokensByNetwork[found] = token;
    } else {
      hiddenTokensByNetwork.unshift(token);
    }
    Vue.set(hiddenTokens, network.value.type.name, hiddenTokensByNetwork);
  };
  const deleteHiddenToken = token => {
    const { network } = useGlobalStore();

    const currentHiddenTokens = hiddenTokens.value[
      network.value.type.name
    ].filter(currentTokens => {
      const found = token.find(item => {
        if (item.address === currentTokens.address) {
          return item;
        }
      });
      if (!found) {
        return currentTokens;
      }
    });
    Vue.set(hiddenTokens.value, network.value.type.name, currentHiddenTokens);
  };
  const setAddressBook = val => {
    addressBook.value = val;
  };
  const addCustomPath = path => {
    paths.value.push(path);
  };
  const deleteCustomPath = path => {
    paths.value = paths.value.filter(p => p.value !== path.value);
  };
  const deleteAllCustomPaths = () => {
    paths.value = [];
  };
  const updateCustomTokenBalances = () => {
    const { web3, address } = useWalletStore();
    const _getTokenBalance = (balance, decimals) => {
      let n = new BigNumber(balance);
      if (decimals) {
        n = fromBase(balance, decimals);
        n = formatFloatingPointValue(n);
      } else {
        n = formatIntegerValue(n);
      }
      return n;
    };
    if (hasCustom.value) {
      customTokens.value.forEach(item => {
        const newToken = Object.assign({}, item);
        if (!isAddress(item.contract)) return;
        const newContract = new web3.value.eth.Contract(
          abi,
          item.contract.toLowerCase()
        );
        newContract.methods
          .balanceOf(address.value)
          .call()
          .then(res => {
            newToken.balancef = _getTokenBalance(res, item.decimals).value;
            newToken.balance = res;
            setCustomToken(newToken);
          })
          .catch(e => Toast(e.message, {}, ERROR));
      });
    }
  };

  // getters
  const customTokens = computed(() => {
    const { network } = useGlobalStore();
    return tokens.value[network.value.type.name] || [];
  });

  const hasCustom = computed(() => {
    return customTokens.value.length > 0;
  });

  const hiddenTokens = computed(() => {
    const { network } = useGlobalStore();
    return hiddenTokensHolder.value[network.value.type.name] || [];
  });

  const hasHidden = computed(() => {
    return hiddenTokens.value.length > 0;
  });

  return {
    localStore,
    tokens,
    paths,
    stateVersion,
    addressBook,
    hiddenTokensHolder,
    initStore,
    setCustomToken,
    deleteToken,
    deleteAll,
    setHiddenToken,
    deleteHiddenToken,
    setAddressBook,
    addCustomPath,
    deleteCustomPath,
    deleteAllCustomPaths,
    updateCustomTokenBalances,
    customTokens,
    hasCustom,
    hiddenTokens,
    hasHidden
  };
});
