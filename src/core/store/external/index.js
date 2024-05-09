import { defineStore } from 'pinia';

import BigNumber from 'bignumber.js';
import { toBN } from 'web3-utils';

import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatIntegerValue,
  formatPercentageValue
} from '@/core/helpers/numberFormatHelper';
import getTokenInfo from '@/core/helpers/tokenInfo';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { fromBase } from '../../helpers/unit';
import { useGlobalStore } from '@/core/store/global';
import { useWalletStore } from '@/core/store/wallet';
import { useCustomStore } from '@/core/store/custom';

import platformList from '@/_generated/platformlist.json';

const external = {
  state: () => ({
    localStore: false,
    path: '',
    currencyRate: {},
    coinGeckoTokens: new Map(), //map of {coingeckoId: coingeckotokeninfo}
    coinGeckoNetworkCurrencies: new Map(), //map of {coingeckoId: coingeckotokeninfo}
    networkTokens: new Map(), //map of {contract: token}
    eip6963Providers: [],
    selectedEIP6963Provider: null,
    selectedEIP6963Info: null
  }),
  actions: {
    async setCurrency(val) {
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
    },
    setLastPath(val) {
      this.lastPath = val;
    },
    setCoinGeckoTokens(params) {
      this.coinGeckoTokens = params;
    },
    setCoinGeckoNetworkIds(params) {
      this.coinGeckoNetworkCurrencies = params;
    },
    setNetworkTokens(params) {
      this.networkTokens = params;
    },
    setTokenAndEthBalance() {
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
          ]);
          setAccountBalance(toBN(res));
          updateCustomTokenBalances();
          setLoadingWalletInfo(false);
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
        if (
          identifier !== WALLET_TYPES.WEB3_WALLET &&
          currentProvider.connection
        ) {
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
              const usdBalance = new BigNumber(base)
                .times(token.price)
                .toString();
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
          setTokens(formattedList);
          setAccountBalance(mainTokenBalance);
          updateCustomTokenBalances().catch(e => Toast(e, {}, ERROR));
          setLoadingWalletInfo(false);
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
          _getBalance();
          return [];
        });
    },

    storeEIP6963Wallet(detail) {
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
    },
    setSelectedEIP6963Provider(provider) {
      this.selectedEIP6963Provider = provider;
    },

    setSelectedEIP6963Info(info) {
      this.selectedEIP6963Info = info;
    }
  },
  getters: {
    /**
     * Get Eth Fiat value
     */
    fiatValue() {
      const tokenUSDValue = this.networkTokenUSDMarket.value;
      return new BigNumber(tokenUSDValue);
    },

    /**
     * Get Eth Balance Fiat value
     */
    balanceFiatValue() {
      const { balanceInETH } = useWalletStore();
      return new BigNumber(balanceInETH).times(this.fiatValue);
    },

    totalTokenFiatValue() {
      const { tokensList } = useWalletStore();
      if (!tokensList.length) return new BigNumber(0);
      const totalValue = tokensList.reduce((total, currentVal) => {
        const balance =
          !currentVal.isHidden &&
          currentVal.usdBalance !== null &&
          (currentVal.price_change_percentage_24h !== null ||
            currentVal.market_cap !== 0)
            ? currentVal.usdBalance
            : 0;
        return new BigNumber(total).plus(balance);
      }, 0);
      return totalValue;
    },

    /**
     * Get main currency market info
     */
    networkTokenUSDMarket(state) {
      const { network } = useGlobalStore();
      const cgid = network.type.coingeckoID;
      if (cgid) {
        const token = state.coinGeckoTokens.get(cgid);
        if (token)
          return {
            value: token.current_price,
            symbol: '$',
            name: 'USD',
            price_change_percentage_24h: token.price_change_percentage_24h
          };
      }
      return {
        value: 0,
        symbol: '$',
        name: 'USD',
        price_change_percentage_24h: 0
      };
    },
    getCoinGeckoTokenById(state) {
      return cgid => {
        const cgToken = state.coinGeckoTokens.get(cgid);
        const networkCurrencyTokens =
          state.coinGeckoNetworkCurrencies.get(cgid);
        return {
          name: networkCurrencyTokens
            ? networkCurrencyTokens.symbol.toUpperCase()
            : cgToken
            ? cgToken.symbol.toUpperCase()
            : '',
          symbol: networkCurrencyTokens
            ? networkCurrencyTokens.symbol.toUpperCase()
            : cgToken
            ? cgToken.symbol.toUpperCase()
            : '',
          subtext: networkCurrencyTokens
            ? networkCurrencyTokens.name
            : cgToken
            ? cgToken.name
            : '',
          value: networkCurrencyTokens
            ? networkCurrencyTokens.name
            : cgToken
            ? cgToken.name
            : '',
          img: networkCurrencyTokens
            ? `https://img.mewapi.io/?image=${networkCurrencyTokens.image}`
            : cgToken
            ? `https://img.mewapi.io/?image=${cgToken.image}`
            : '',
          market_cap: networkCurrencyTokens
            ? networkCurrencyTokens.market_cap
            : cgToken
            ? cgToken.market_cap
            : '0',
          market_capf: networkCurrencyTokens
            ? formatIntegerValue(networkCurrencyTokens.market_cap).value
            : cgToken
            ? formatIntegerValue(cgToken.market_cap).value
            : '0',
          price_change_percentage_24h: networkCurrencyTokens
            ? networkCurrencyTokens.price_change_percentage_24h
            : cgToken
            ? cgToken.price_change_percentage_24h
            : '0',
          price_change_percentage_24hf: networkCurrencyTokens
            ? formatPercentageValue(
                networkCurrencyTokens.price_change_percentage_24h
              ).value
            : cgToken && cgToken.price_change_percentage_24h
            ? formatPercentageValue(cgToken.price_change_percentage_24h).value
            : '0',
          price: networkCurrencyTokens
            ? networkCurrencyTokens.current_price
            : cgToken
            ? cgToken.current_price
            : '0',
          pricef: networkCurrencyTokens
            ? formatFiatValue(networkCurrencyTokens.current_price).value
            : cgToken
            ? formatFiatValue(cgToken.current_price).value
            : '0'
        };
      };
    },
    /**
     * Get Token info including market data if exists
     */
    contractToToken(state) {
      return contractAddress => {
        const { network } = useGlobalStore();
        if (!contractAddress) {
          return null;
        }
        contractAddress = contractAddress.toLowerCase();
        let tokenId = platformList[contractAddress];
        let cgToken;
        if (contractAddress === MAIN_TOKEN_ADDRESS) {
          tokenId = network.type.coingeckoID;
          cgToken = this.getCoinGeckoTokenById(tokenId);
          const networkType = network.type;
          return Object.assign(cgToken, {
            name: networkType.currencyName,
            symbol: networkType.currencyName,
            subtext: networkType.name_long,
            value: networkType.name_long,
            contract: MAIN_TOKEN_ADDRESS,
            img: cgToken.img !== '' ? cgToken.img : networkType.icon,
            decimals: 18
          });
        }
        cgToken = this.getCoinGeckoTokenById(tokenId);
        const networkToken = state.networkTokens.get(contractAddress);
        const name = networkToken ? networkToken.name : cgToken.name;
        const symbol = networkToken ? networkToken.symbol : cgToken.symbol;
        const img = cgToken.img
          ? cgToken.img
          : networkToken
          ? networkToken.icon
          : '';
        const address = networkToken ? networkToken.address : contractAddress;
        const networkTokenObj = {
          name: name,
          symbol: symbol,
          subtext: name,
          value: name,
          contract: address,
          img: img
        };

        if (networkToken && networkToken.hasOwnProperty('decimals')) {
          networkTokenObj['decimals'] = networkToken.decimals;
        }

        return Object.assign(cgToken, networkTokenObj);
      };
    }
  }
};

export const useExternalStore = defineStore('external', external);
