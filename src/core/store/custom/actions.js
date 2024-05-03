import localStore from 'store';
import BigNumber from 'bignumber.js';
import Vue from 'vue';

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
import { isAddress } from 'web3-utils';

const initStore = () => {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.custom)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.custom);
    if (savedStore.stateVersion === Configs.VERSION.custom) {
      this.$patch(Object.assign(this.$state, savedStore));
    }
  }
};

const setCustomToken = function (token) {
  const { network } = useGlobalStore();
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
  const { network } = useGlobalStore();
  const currentCustomTokens = this.tokens[network.type.name].filter(
    currentTokens => {
      const found = token.find(item => {
        if (item.address === currentTokens.contract) {
          return item;
        }
      });
      if (found && this.hiddenTokens.length > 0) {
        const newHiddenTokens = this.hiddenTokens.filter(item => {
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
  const { network } = useGlobalStore();

  let customTokensByNetwork = this.tokens[network.type.name];
  customTokensByNetwork = [];
  Vue.set(this.tokens, network.type.name, customTokensByNetwork);
};

const setHiddenToken = function (token) {
  const { network } = useGlobalStore();

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
  const { network } = useGlobalStore();

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
  if (this.hasCustom) {
    this.customTokens.forEach(item => {
      const newToken = Object.assign({}, item);
      if (!isAddress(item.contract)) return;
      const newContract = new web3.eth.Contract(
        abi,
        item.contract.toLowerCase()
      );
      newContract.methods
        .balanceOf(address)
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
