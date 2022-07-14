import localStore from 'store';
import Configs from '../configs';
import nodeList from '@/utils/networks';
import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { toHex } from 'web3-utils';
import { WEB3_WALLET } from '@/modules/access-wallet/common/walletTypes';

const defaultNetwork = nodeList['ETH'].find(item => {
  return item.service === 'myetherwallet.com-ws';
});
const INIT_STORE = function (state) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.global)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.global);
    if (savedStore.stateVersion === Configs.VERSION.global) {
      if (!nodeList[savedStore.currentNetwork.type.name]) {
        savedStore['currentNetwork'] = defaultNetwork;
        savedStore.currentNetwork.type = {
          name: 'ETH'
        };
      }
      Object.assign(state, savedStore);
    }
  }
};
const SET_ONLINE_STATUS = async function (state, status) {
  state.online = status;
};

const SET_PROMO_OVER = async function (state) {
  state.promoOver = true;
};

const SET_LOCALE = function (state, { locale }) {
  state.locale = locale;
};

const SET_PREFERRED_CURRENCY = function (state, currency) {
  state.preferredCurrency = currency;
};

const SET_GAS_PRICE = function (state, val) {
  state.baseGasPrice = val;
};

/**
 * Attempts to switch metamask network to current mew network.
 * Informs user of pending or unknown networks.
 */

const MATCH_NETWORK = async (chainID, walletType) => {
  const { ethereum } = window;
  if (walletType === WEB3_WALLET) {
    const data = { chainId: toHex(chainID) };
    try {
      if (chainID) {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [data]
        });
        return true;
      }
      return false;
    } catch (er) {
      const { message } = er;
      let toastMsg = ' ';
      let toastLink = {};
      if (message) {
        if (message.includes('pending')) {
          toastMsg =
            'There is a pending request to MetaMask, make your selection before continuing';
        } else if (message.includes('adding')) {
          toastLink = {
            title:
              "It seems like you don't have this network set up in MetaMask. Please go here to add the network.",
            url: 'https://chainlist.org/'
          };
        } else if (message.includes('rejected')) return;
        else if (message.includes("hasn't been added")) {
          toastLink = {
            title:
              "It seems like you don't have this network set up in your wallet. Please go here to add the network.",
            url: 'https://chainlist.org/'
          };
        } else {
          toastMsg = 'There was a problem processing your request to MetaMask';
        }
        Toast(toastMsg, toastLink, ERROR, 5000);
      }
      return false;
    }
  }
  return true;
};

const SET_NETWORK = async function (state, networkObj, walletType) {
  const _netObj = Object.assign({}, networkObj);
  _netObj.type = {
    name: networkObj.type.name
  };
  const matched = await MATCH_NETWORK(networkObj.type.chainID, walletType);
  if (matched) {
    state.currentNetwork = _netObj;
  }
};
const SET_GAS_PRICE_TYPE = function (state, type) {
  state.gasPriceType = type;
};
const SET_IMPORTED_STATE = function (currentState, newState) {
  Object.keys(newState).forEach(item => {
    currentState[item] = newState[item];
  });
};

const ADD_LOCAL_CONTRACT = function (state, contract) {
  if (!state.localContracts[state.currentNetwork.type.name])
    state.localContracts[state.currentNetwork.type.name] = [];
  state.localContracts[state.currentNetwork.type.name].push(contract);
};
const SET_BASE_FEE_PER_GAS = function (state, baseFeePerGasBN) {
  state.eip1559.baseFeePerGas = baseFeePerGasBN.toString();
};
const SET_MAX_PRIORITY_FEE_PER_GAS = function (state, maxPriorityFeePerGasBN) {
  state.eip1559.maxPriorityFeePerGas = maxPriorityFeePerGasBN.toString();
};
const SET_TRACKING_CONSENT = function (state, val) {
  if (this._vm.$matomo) {
    this._vm.$matomo.setConsentGiven();
    this._vm.$matomo.trackEvent('consent', val ? 'true' : 'false');
    if (!val) this._vm.$matomo.forgetConsentGiven();
  }
  state.consentToTrack = val;
};

const NEVER_SHOW_TRACKING = function (state) {
  state.displayedTrackingPopup = true;
};

const NEVER_SHOW_BANNER = function (state) {
  state.showedBanner = true;
};

const NEVER_SHOW_WALLET_PROMO = function (state) {
  state.showWalletPromo = false;
};

export default {
  SET_ONLINE_STATUS,
  SET_LOCALE,
  SET_PREFERRED_CURRENCY,
  SET_GAS_PRICE,
  SET_NETWORK,
  MATCH_NETWORK,
  INIT_STORE,
  SET_GAS_PRICE_TYPE,
  SET_IMPORTED_STATE,
  ADD_LOCAL_CONTRACT,
  SET_BASE_FEE_PER_GAS,
  SET_MAX_PRIORITY_FEE_PER_GAS,
  SET_TRACKING_CONSENT,
  NEVER_SHOW_TRACKING,
  NEVER_SHOW_BANNER,
  NEVER_SHOW_WALLET_PROMO,
  SET_PROMO_OVER
};
