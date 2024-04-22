import localStore from 'store';
import BigNumber from 'bignumber.js';
import Vue from 'vue';

import {
  global as useGlobalStore,
  custom as useCustomStore,
  wallet as useWalletStore
} from '@/core/store/index.js';

import Configs from '../configs';
import { fromBase } from '@/core/helpers/unit';
import {
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import abi from '@/modules/balance/handlers/abiERC20.js';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isAddress } from '@/core/helpers/addressUtils.js';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.custom);
    if (savedStore.stateVersion === Configs.VERSION.custom) {
      this.$state = Object.assign(this.$state, savedStore);
    }
  }
};

const setCustomToken = function (token) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  let customTokensByNetwork = this.tokens[network.type.name];
  if (!this.tokens[network.type.name]) {
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
  Vue.set(this.tokens, network.type.name, customTokensByNetwork);
};

const deleteToken = function (token) {
  const globalStore = useGlobalStore();
  const customStore = useCustomStore();
  const network = globalStore.network;
  const currentCustomTokens = this.tokens[network.type.name].filter(
    currentTokens => {
      const found = token.find(item => {
        if (item.address === currentTokens.contract) {
          return item;
        }
      });
      // Check if token is in hiddenTokens
      const hiddenTokens = customStore.hiddenTokens;
      if (found && hiddenTokens.length > 0) {
        const newHiddenTokens = hiddenTokens.filter(item => {
          return found.address !== item.address;
        });
        Vue.set(this.hiddenTokens, network.type.name, newHiddenTokens);
      }
      if (!found) {
        return currentTokens;
      }
    }
  );
  Vue.set(this.tokens, network.type.name, currentCustomTokens);
};

const deleteAll = function () {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  let customTokensByNetwork = this.tokens[network.type.name];
  customTokensByNetwork = [];
  Vue.set(this.tokens, network.type.name, customTokensByNetwork);
};

const setHiddenToken = function (token) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  let hiddenTokensByNetwork = this.hiddenTokens[network.type.name];
  if (!this.hiddenTokens[network.type.name]) {
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
  Vue.set(this.hiddenTokens, network.type.name, hiddenTokensByNetwork);
};

const deleteHiddenToken = function (token) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  const currentHiddenTokens = this.hiddenTokens[network.type.name].filter(
    currentTokens => {
      const found = token.find(item => {
        if (item.address === currentTokens.address) {
          return item;
        }
      });
      if (!found) {
        return currentTokens;
      }
    }
  );
  Vue.set(this.hiddenTokens, network.type.name, currentHiddenTokens);
};

const setAddressBook = function (val) {
  this.addressBook = val;
};

const addCustomPath = function (path) {
  this.paths.push(path);
};

const deleteCustomPath = function (path) {
  this.paths = this.paths.filter(p => p.value !== path.value);
};
const deleteAllCustomPaths = function () {
  this.paths = [];
};

const updateCustomTokenBalances = function () {
  const walletStore = useWalletStore();
  const web3 = walletStore.web3;
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
  if (this.hasCustom) {
    this.customTokens.forEach(item => {
      const newToken = Object.assign({}, item);
      if (!isAddress(item.contract)) return;
      const newContract = new web3.eth.Contract(
        abi,
        item.contract.toLowerCase()
      );
      newContract.methods
        .balanceOf(walletStore.address)
        .call()
        .then(res => {
          newToken.balancef = _getTokenBalance(res, item.decimals).value;
          newToken.balance = res;
          this.setCustomToken(newToken);
        })
        .catch(e => Toast(e.message, {}, ERROR));
    });
  }
};

export default {
  initStore,
  setAddressBook,
  setCustomToken,
  deleteAll,
  deleteToken,
  addCustomPath,
  deleteCustomPath,
  deleteAllCustomPaths,
  updateCustomTokenBalances,
  setHiddenToken,
  deleteHiddenToken
};
