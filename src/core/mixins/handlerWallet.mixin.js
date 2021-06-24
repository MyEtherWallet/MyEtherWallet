/**
 * The Wallet View Apollo Mixin
 */
import { getLatestPrices } from '@/apollo/queries/wallets/wallets.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
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
            this.tokensData.set(token.id, token);
          });
          this.setCoinGeckoTokens(this.tokensData);
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  }
};
