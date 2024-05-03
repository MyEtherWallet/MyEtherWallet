import BigNumber from 'bignumber.js';
import { toBN } from 'web3-utils';

import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import getTokenInfo from '@/core/helpers/tokenInfo';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { fromBase } from '../../helpers/unit';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useCustomStore } from '@/core/store/custom';

const setCurrency = async function (val) {
  fetch('https://mainnet.mewwallet.dev/v2/prices/exchange-rates')
    .then(res => res.json())
    .then(rates => {
      const currentRate = rates
        ? rates.find(rate => rate.fiat_currency === val)
        : {};
      this.currencyRate = {
        data: currentRate,
        timestamp: Date.now()
      };
    })
    .catch(e => {
      this.currencyRate = {
        data: {},
        timestamp: Date.now()
      };
      Toast(e.message, {}, ERROR);
    });
};
const setLastPath = function (val) {
  this.lastPath = val;
};
const setCoinGeckoTokens = function (params) {
  this.coinGeckoTokens = params;
};

const setCoinGeckoNetworkIds = function (params) {
  this.coinGeckoNetworkCurrencies = params;
};
const setNetworkTokens = function (params) {
  this.networkTokens = params;
};
const setTokenAndEthBalance = function () {
  const {
    web3,
    setTokens,
    setAccountBalance,
    setLoadingWalletInfo,
    identifier,
    setWeb3Instance
  } = useWalletStore();
  const { updateCustomTokenBalances } = useCustomStore();
  const { network } = useGlobalStore();

  setLoadingWalletInfo(true);
  const { address } = useWalletStore();
  const isTokenBalanceApiSupported = network.type.balanceApi !== '';

  const _formatBalance = (balance, decimals) => {
    let n = new BigNumber(balance);
    if (decimals) {
      n = formatFloatingPointValue(fromBase(n, decimals));
    } else {
      n = formatIntegerValue(n);
    }
    return n;
  };

  const _getBalance = () => {
    web3.eth.getBalance(address).then(res => {
      const token = this.contractToToken(MAIN_TOKEN_ADDRESS);
      const usdBalance = new BigNumber(fromBase(res, token.decimals))
        .times(token.price)
        .toString();
      setTokens([
        Object.assign(
          {
            balance: res,
            balancef: _formatBalance(res, token.decimals).value,
            usdBalance: usdBalance,
            usdBalancef: formatFiatValue(usdBalance).value
          },
          token
        )
      ])
        .then(() => setAccountBalance(toBN(res)))
        .then(() => {
          updateCustomTokenBalances();
          setLoadingWalletInfo(false);
        });
    });
  };

  if (!isTokenBalanceApiSupported) {
    const currentProvider = web3.eth.currentProvider;
    // Prevent the 'Invalid return values' error
    // when accessing new network on MetaMask
    if (
      identifier === WALLET_TYPES.WEB3_WALLET &&
      network.type.chainID !== parseInt(currentProvider.chainId)
    ) {
      return;
    }
    if (identifier !== WALLET_TYPES.WEB3_WALLET && currentProvider.connection) {
      const currentProviderUrl = currentProvider.connection.url;
      if (network.url !== currentProviderUrl) {
        setWeb3Instance(undefined);
      }
    }
    _getBalance();
    return;
  }
  let mainTokenBalance = toBN('0');
  const isQuery = network.type.balanceApi.includes('partners.mewapi')
    ? '?'
    : '&';
  const TOKEN_BALANCE_API = `${network.type.balanceApi}${address}${isQuery}type=internal&platform=web`;
  fetch(TOKEN_BALANCE_API)
    .then(res => res.json())
    .then(res => res.result)
    .then(preTokens => {
      const hasPreTokens = preTokens ? preTokens : [];
      if (hasPreTokens.length === 0) {
        _getBalance();
        return [];
      }
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
        const token = this.contractToToken(t.contract);
        if (!token) {
          promises.push(
            getTokenInfo(t.contract, web3).then(info => {
              if (info) {
                this.networkTokens.set({
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
      return Promise.all(promises).then(() => {
        return hasPreTokens;
      });
    })
    .then(tokens => {
      const formattedList = [];
      tokens.forEach(t => {
        const token = this.contractToToken(t.contract);
        if (t.contract === MAIN_TOKEN_ADDRESS) {
          mainTokenBalance = toBN(t.balance);
        }
        if (token.name && token.hasOwnProperty('decimals')) {
          const base = fromBase(t.balance, token.decimals);
          const usdBalance = new BigNumber(base).times(token.price).toString();
          formattedList.push(
            Object.assign(
              {
                balance: t.balance,
                balancef: _formatBalance(t.balance, token.decimals).value,
                usdBalance: usdBalance,
                usdBalancef: formatFiatValue(usdBalance).value
              },
              t,
              token
            )
          );
        }
      });
      formattedList.sort(function (x, y) {
        return x.contract == MAIN_TOKEN_ADDRESS
          ? -1
          : y.contract == MAIN_TOKEN_ADDRESS
          ? 1
          : 0;
      });
      setTokens(formattedList).then(() =>
        setAccountBalance(mainTokenBalance).then(() => {
          updateCustomTokenBalances().catch(e => Toast(e, {}, ERROR));
          setLoadingWalletInfo(false);
        })
      );
    })
    .catch(e => {
      Toast(e.message, {}, ERROR);
      _getBalance();
      return [];
    });
};

const storeEIP6963Wallet = function (detail) {
  const newArr = this.eip6963Providers;
  const findInArr = newArr.findIndex(item => {
    return (
      detail.info.uuid.toLowerCase() === item.info.uuid.toLowerCase() ||
      detail.info.name.toLowerCase() === item.info.name.toLowerCase()
    );
  });
  if (findInArr > -1) {
    newArr[findInArr] = detail;
  } else {
    newArr.push(detail);
  }
  this.eip6963Providers = newArr;
};
const setSelectedEIP6963Provider = function (provider) {
  this.selectedEIP6963Provider = provider;
};

const setSelectedEIP6963Info = function (info) {
  this.selectedEIP6963Info = info;
};
export default {
  setLastPath,
  setCurrency,
  setCoinGeckoTokens,
  setCoinGeckoNetworkIds,
  setTokenAndEthBalance,
  setNetworkTokens,
  storeEIP6963Wallet,
  setSelectedEIP6963Info,
  setSelectedEIP6963Provider
};
