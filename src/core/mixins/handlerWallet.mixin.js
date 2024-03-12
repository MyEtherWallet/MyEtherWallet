/**
 * The Wallet View Apollo Mixin
 */
import { mapActions } from 'vuex';
import * as nodes from '@/utils/networks/types/index.js';
import {
  getLatestPrices,
  getCoinGeckoTokenMarketDataByIds
} from '@/apollo/queries/wallets/wallets.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
export default {
  name: 'HandlerWallet',
  data() {
    return {
      getLatestPrices: '',
      tokensData: {},
      networkValuesData: {}
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
          data.getLatestPrices.forEach(async token => {
            this.tokensData.set(token.id, token);
          });
          this.setCoinGeckoTokens(this.tokensData);
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    getCoinGeckoTokenMarketDataByIds: {
      query: getCoinGeckoTokenMarketDataByIds,
      variables: {
        ids: Object.keys(nodes)
          .map(item => nodes[item].coingeckoID)
          .filter(item => !!item)
      },
      pollInterval: 600000,
      result({ data }) {
        this.networkValuesData = new Map();
        if (data && data.getCoinGeckoTokenMarketDataByIds) {
          data.getCoinGeckoTokenMarketDataByIds.forEach(token => {
            this.networkValuesData.set(token.id, token);
          });
          this.setCoinGeckoNetworkIds(this.networkValuesData);
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  },
  methods: {
    ...mapActions('external', ['setCoinGeckoTokens', 'setCoinGeckoNetworkIds'])
  }
};
