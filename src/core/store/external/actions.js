import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import BigNumber from 'bignumber.js';
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { toBN } from 'web3-utils';
import getTokenInfo from '@/core/helpers/tokenInfo';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';

const setCurrency = async function ({ commit }, val) {
  fetch('https://mainnet.mewwallet.dev/v2/prices/exchange-rates')
    .then(res => res.json())
    .then(rates => {
      const currentRate = rates
        ? rates.find(rate => rate.fiat_currency === val)
        : {};
      commit('SET_CURRENCY_RATE', {
        data: currentRate,
        timestamp: Date.now()
      });
    })
    .catch(e => {
      commit('SET_CURRENCY_RATE', {
        data: {},
        timestamp: Date.now()
      });
      Toast(e.message, {}, ERROR);
    });
};
const setLastPath = function ({ commit }, val) {
  commit('SET_LAST_PATH', val);
};
const setCoinGeckoTokens = function ({ commit }, params) {
  commit('SET_COIN_GECKO_TOKENS', params);
};
const setNetworkTokens = function ({ commit }, params) {
  commit('SET_NETWORK_TOKENS', params);
};
const setTokenAndEthBalance = function ({
  rootGetters,
  getters,
  dispatch,
  commit,
  rootState
}) {
  commit('wallet/SET_LOADING_WALLET_INFO', true, { root: true });
  const network = rootGetters['global/network'];
  const isTokenBalanceApiSupported = network.type.balanceApi !== '';
  const address = rootState.wallet.address;

  const _getTokenBalance = (balance, decimals) => {
    let n = new BigNumber(balance);
    if (decimals) {
      n = n.div(new BigNumber(10).pow(decimals));
      n = formatFloatingPointValue(n);
    } else {
      n = formatIntegerValue(n);
    }
    return n;
  };
  if (!isTokenBalanceApiSupported) {
    const currentProvider = rootState.wallet.web3.eth.currentProvider;
    // Prevent the 'Invalid return values' error
    // when accessing new network on MetaMask
    if (
      rootState.wallet.identifier === WALLET_TYPES.WEB3_WALLET &&
      network.type.chainID !== parseInt(currentProvider.chainId)
    ) {
      return;
    }
    if (
      rootState.wallet.identifier !== WALLET_TYPES.WEB3_WALLET &&
      currentProvider.connection
    ) {
      const currentProviderUrl = currentProvider.connection.url;
      if (network.url !== currentProviderUrl) {
        dispatch('wallet/setWeb3Instance', undefined, { root: true });
      }
    }
    rootState.wallet.web3.eth.getBalance(address).then(res => {
      const token = getters.contractToToken(MAIN_TOKEN_ADDRESS);
      const denominator = new BigNumber(10).pow(token.decimals);
      const usdBalance = new BigNumber(res)
        .div(denominator)
        .times(token.price)
        .toString();
      dispatch(
        'wallet/setTokens',
        [
          Object.assign(
            {
              balance: res,
              balancef: _getTokenBalance(res, token.decimals).value,
              usdBalance: usdBalance,
              usdBalancef: formatFiatValue(usdBalance).value
            },
            token
          )
        ],
        { root: true }
      )
        .then(() =>
          dispatch('wallet/setAccountBalance', toBN(res), { root: true })
        )
        .then(() => {
          // dispatch can't be blank
          dispatch('custom/updateCustomTokenBalances', false, { root: true });
          commit('wallet/SET_LOADING_WALLET_INFO', false, { root: true });
        });
    });
    return;
  }
  let mainTokenBalance = toBN('0');
  const TOKEN_BALANCE_API = network.type.balanceApi + address;
  fetch(TOKEN_BALANCE_API)
    .then(res => res.json())
    .then(res => res.result)
    .then(preTokens => {
      const hasPreTokens = preTokens ? preTokens : [];
      const includedUserBalance = hasPreTokens.filter(item => {
        if (
          item.contract.toLowerCase() ===
          '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
        )
          return item;
      });
      if (!hasPreTokens.length || !includedUserBalance.length) {
        hasPreTokens.push({
          contract: MAIN_TOKEN_ADDRESS,
          balance: '0x0'
        });
      }
      const promises = [];

      hasPreTokens.forEach(t => {
        if (!t.contract) return;
        const token = getters.contractToToken(t.contract);
        if (!token) {
          promises.push(
            getTokenInfo(t.contract, rootState.wallet.web3).then(info => {
              if (info) {
                rootState.external.networkTokens.set({
                  name: info.name,
                  symbol: info.symbol,
                  decimals: info.decimals,
                  address: t.contract
                });
              }
            })
          );
        }
      });
      return Promise.all(promises).then(() => hasPreTokens);
    })
    .then(tokens => {
      const formattedList = [];
      tokens.forEach(t => {
        const token = getters.contractToToken(t.contract);
        if (!token) return;
        if (t.contract === MAIN_TOKEN_ADDRESS) {
          mainTokenBalance = toBN(t.balance);
        }
        const denominator = new BigNumber(10).pow(token.decimals);
        const usdBalance = new BigNumber(t.balance)
          .div(denominator)
          .times(token.price)
          .toString();
        formattedList.push(
          Object.assign(
            {
              balance: t.balance,
              balancef: _getTokenBalance(t.balance, token.decimals).value,
              usdBalance: usdBalance,
              usdBalancef: formatFiatValue(usdBalance).value
            },
            token
          )
        );
      });
      formattedList.sort(function (x, y) {
        return x.contract == MAIN_TOKEN_ADDRESS
          ? -1
          : y.contract == MAIN_TOKEN_ADDRESS
          ? 1
          : 0;
      });
      dispatch('wallet/setTokens', formattedList, { root: true }).then(() =>
        dispatch('wallet/setAccountBalance', mainTokenBalance, {
          root: true
        }).then(() => {
          // dispatch can't be blank
          dispatch('custom/updateCustomTokenBalances', false, {
            root: true
          }).catch(e => Toast(e, {}, ERROR));
          commit('wallet/SET_LOADING_WALLET_INFO', false, { root: true });
        })
      );
    })
    .catch(e => Toast(e.message, {}, ERROR));
};
export default {
  setLastPath,
  setCurrency,
  setCoinGeckoTokens,
  setTokenAndEthBalance,
  setNetworkTokens
};
