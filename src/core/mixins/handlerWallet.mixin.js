/**
 * The Wallet View Apollo Mixin
 */
import { getLatestPrices } from '@/apollo/queries/wallets/wallets.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import BigNumber from 'bignumber.js';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';

const tokens = {
  eth: 'ethereum'
};

export default {
  name: 'HandlerWallet',
  data() {
    return {
      getLatestPrices: '',
      tokensData: {}
    };
  },
  apollo: {
    /**
     * Apollo query to fetch latest tokens
     * also set the state for eth price
     */
    getLatestPrices: {
      query: getLatestPrices,
      pollInterval: 600000,
      result({ data }) {
        this.tokensData = new Map();
        if (data && data.getLatestPrices) {
          data.getLatestPrices.forEach(token => {
            const isEth = token.id === tokens.eth;
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
              token.contract ? token.contract.toLowerCase() : token.id,
              token
            );
          });
          this.setCoinGeckoTokens(this.tokensData);
          this.$apollo.queries.getOwnersERC20Tokens?.refetch();
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
    /**
    //  * Apollo query to fetch owners erc20 tokens and set the state
    //  */
    // getOwnersERC20Tokens: {
    //   query: getOwnersERC20Tokens,
    //   variables() {
    //     return {
    //       hash: this.address
    //     };
    //   },
    //   skip() {
    //     return (
    //       this.address === null || !this.isEthNetwork || this.address === ''
    //     );
    //   },
    //   result({ data }) {
    //     if (data && data.getOwnersERC20Tokens) {
    //       const formattedList = [];
    //       const ownedTokens = data.getOwnersERC20Tokens.owners;
    //       ownedTokens.forEach(token => {
    //         let foundToken;
    //         if (this.tokensData && this.tokensData.get) {
    //           foundToken = this.tokensData.get(
    //             token.tokenInfo.contract.toLowerCase()
    //           );
    //         }
    //         const denominator = new BigNumber(10).pow(token.tokenInfo.decimals);
    //         const usdBalance = foundToken
    //           ? new BigNumber(token.balance)
    //               .div(denominator)
    //               .times(foundToken.current_price)
    //               .toString()
    //           : null;
    //         const price = foundToken ? foundToken.current_price : null;
    //         // need to eventually change image to check tokens network rather than just use eth network (if theres no image from coingecko)
    //         formattedList.push({
    //           name: token.tokenInfo.symbol,
    //           symbol: token.tokenInfo.symbol,
    //           subtext: token.tokenInfo.name,
    //           value: token.tokenInfo.name,
    //           balance: token.balance,
    //           contract: token.tokenInfo.contract,
    //           img: foundToken ? foundToken.image : ethImg,
    //           decimals: token.tokenInfo.decimals,
    //           market_cap: foundToken ? foundToken.market_cap : null,
    //           price_change_percentage_24h: foundToken
    //             ? foundToken.price_change_percentage_24h
    //             : null,
    //           totalBalanceRaw: usdBalance,
    //           totalBalance: formatFiatValue(usdBalance).value,
    //           priceRaw: price,
    //           price: formatFiatValue(price).value,
    //           tokenBalance: this._getTokenBalance(
    //             token.balance,
    //             token.tokenInfo.decimals
    //           ).value
    //         });
    //       });
    //       this.setTokens(formattedList);
    //     }
    //   },
    //   error(error) {
    //     Toast(error.message, {}, ERROR);
    //   }
    // }
  },
  methods: {
    /**
     * Get token balance
     */
    _getTokenBalance(balance, decimals) {
      let n = new BigNumber(balance);
      if (decimals) {
        n = n.div(new BigNumber(10).pow(decimals));
        n = formatFloatingPointValue(n);
      }
      return n;
    }
  }
};
