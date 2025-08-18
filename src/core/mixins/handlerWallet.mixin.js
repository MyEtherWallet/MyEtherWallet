/**
 * The Wallet View Apollo Mixin
 */
import { mapActions, mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters('global', ['network']),
    ids() {
      const arrayOfIds = Object.keys(nodes)
        .map(item => nodes[item].coingeckoID)
        .filter(item => !!item);
      // fetch rif token for rsk network
      if (this.network.type.name === nodes.ROOTSTOCK.name) {
        arrayOfIds.push('rif-token');
      }
      return arrayOfIds;
    }
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
          this.setTokenAndEthBalance();
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    },
    getCoinGeckoTokenMarketDataByIds: {
      query: getCoinGeckoTokenMarketDataByIds,
      variables() {
        return { ids: this.ids };
      },
      pollInterval: 600000,
      result({ data }) {
        this.networkValuesData = new Map();
        if (data && data.getCoinGeckoTokenMarketDataByIds) {
          data.getCoinGeckoTokenMarketDataByIds.forEach(token => {
            this.networkValuesData.set(token?.id, token);
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
    ...mapActions('external', [
      'setCoinGeckoTokens',
      'setCoinGeckoNetworkIds',
      'setTokenAndEthBalance'
    ])
  }
};
