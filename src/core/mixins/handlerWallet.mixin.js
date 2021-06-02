/**
 * The Wallet View Apollo Mixin
 */
import utils from 'web3-utils';
import {
  getEthBalance,
  subscribeToAccountBalance,
  getLatestPrices
} from '@/apollo/queries/wallets/wallets.graphql';
import { getOwnersERC20Tokens } from '@/apollo/queries/tokens/tokens.graphql';
import { Toast, ERROR, SENTRY } from '@/modules/toast/handler/handlerToast';
import { AddressEventType } from '@/apollo/global/globalTypes.js';
import BigNumber from 'bignumber.js';
import ethImg from '@/assets/images/networks/eth.svg';
import numberFormatHelper from '@/core/helpers/numberFormatHelper';

const tokens = {
  eth: 'ethereum'
};

export default {
  name: 'HandlerWallet',
  data() {
    return {
      getEthBalance: '',
      getLatestPrices: '',
      subscribeToAccountBalance: '',
      tokensData: {}
    };
  },
  apollo: {
    /**
     * Apollo query to get eth balance
     */
    getEthBalance: {
      query: getEthBalance,
      variables() {
        return {
          hash: this.address
        };
      },
      skip() {
        return (
          !this.isEthNetwork || this.address === null || this.address === ''
        );
      },
      result({ data }) {
        this.setAccountBalance(utils.toBN(data.getEthBalance.balance));
      },
      error(error) {
        Toast(error.message, {}, SENTRY);
      }
    },
    /**
     * Apollo subscription for eth balance
     */
    $subscribe: {
      subscribeToAccountBalance: {
        query: subscribeToAccountBalance,
        variables() {
          return {
            owner: this.address,
            event: AddressEventType.NEW_ETH_TRANSFER
          };
        },
        skip() {
          return (
            !this.isEthNetwork || this.address === '' || this.address === null
          );
        },
        result() {
          this.$apollo.queries.getEthBalance?.refetch();
        },
        error(error) {
          Toast(error.message, {}, SENTRY);
        }
      }
    },
    /**
     * Apollo query to fetch latest tokens
     * also set eth price for state
     */
    getLatestPrices: {
      query: getLatestPrices,
      skip() {
        return !this.isEthNetwork;
      },
      pollInterval: 600000,
      result({ data }) {
        this.tokensData = new Map();
        if (data && data.getLatestPrices) {
          data.getLatestPrices.forEach(token => {
            const isEth = token.id === tokens.eth;
            if (isEth || token.contract) {
              if (isEth) {
                const usd = {
                  value: token.current_price,
                  symbol: '$',
                  name: 'USD',
                  price_change_percentage_24h: token.price_change_percentage_24h
                };
                this.setETHUSDValue(usd);
              }
              this.tokensData.set(
                token.contract ? token.contract.toLowerCase() : tokens.eth,
                token
              );
              this.$apollo.queries.getOwnersERC20Tokens?.refetch();
            }
          });
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    /**
     * Apollo query to fetch owners erc20 tokens and set it to state
     */
    getOwnersERC20Tokens: {
      query: getOwnersERC20Tokens,
      variables() {
        return {
          hash: this.address
        };
      },
      skip() {
        return (
          this.address === null || !this.isEthNetwork || this.address === ''
        );
      },
      result({ data }) {
        if (data && data.getOwnersERC20Tokens) {
          const formattedList = [];
          const ownedTokens = data.getOwnersERC20Tokens.owners;
          ownedTokens.forEach(token => {
            let foundToken;
            if (this.tokensData && this.tokensData.get) {
              foundToken = this.tokensData.get(
                token.tokenInfo.contract.toLowerCase()
              );
            }
            const denominator = new BigNumber(10).pow(token.tokenInfo.decimals);
            const usdBalance = foundToken
              ? new BigNumber(token.balance)
                  .div(denominator)
                  .times(foundToken.current_price)
                  .toString()
              : null;
            const price = foundToken ? foundToken.current_price : null;
            // need to eventually change image to check tokens network rather than just use eth network (if theres no image from coingecko)
            formattedList.push({
              name: token.tokenInfo.symbol,
              symbol: token.tokenInfo.symbol,
              subtext: token.tokenInfo.name,
              value: token.tokenInfo.name,
              balance: token.balance,
              contract: token.tokenInfo.contract,
              img: foundToken ? foundToken.image : ethImg,
              decimals: token.tokenInfo.decimals,
              market_cap: foundToken ? foundToken.market_cap : null,
              price_change_percentage_24h: foundToken
                ? foundToken.price_change_percentage_24h
                : null,
              usdBalance: usdBalance,
              price: price,
              tokenBalance: this._getTokenBalance(
                token.balance,
                token.tokenInfo.decimals
              )
            });
          });
          this.setTokens(formattedList);
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  },
  methods: {
    /**
     * Get token balance
     */
    _getTokenBalance(balance, decimals) {
      let n = new BigNumber(balance);
      if (decimals) {
        n = n.div(new BigNumber(10).pow(decimals));
        n = numberFormatHelper.formatFloatingPointValue(n);
      }
      return n;
    }
  }
};
