/**
 * The Wallet View Apollo Mixin
 */
import { getLatestPrices } from '@/apollo/queries/wallets/wallets.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

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
  }
};
