<template>
  <div class="wallet-main">
    <the-wallet-side-menu />
    <the-wallet-header />
    <v-main>
      <v-container
        class="pa-3 pa-md-5 mb-10 align-center wallet-content-container"
        fluid
      >
        <module-confirmation />
        <router-view />
      </v-container>
    </v-main>
    <the-wallet-footer />
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import { toBN } from 'web3-utils';
import TokenCalls from '@/apollo/queries/tokens/index';
import TheWalletSideMenu from './components-wallet/TheWalletSideMenu';
import TheWalletHeader from './components-wallet/TheWalletHeader';
import TheWalletFooter from './components-wallet/TheWalletFooter';
import ModuleConfirmation from '@/modules/confirmation/ModuleConfirmation';
import {
  getGasBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper.js';
import {
  getEthBalance,
  subscribeToAccountBalance,
  getUSDPrice
} from '@/apollo/queries/wallets/wallets.graphql';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';

const tokens = {
  eth: 'ethereum'
};

export default {
  components: {
    TheWalletSideMenu,
    TheWalletHeader,
    TheWalletFooter,
    ModuleConfirmation
  },
  data() {
    return {
      getEthBalance: '',
      getLatestPrices: '',
      subscribeToAccountBalance: ''
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
        return !this.isEthNetwork;
      },
      result({ data }) {
        this.setAccountBalance(toBN(data.getEthBalance.balance));
      },
      error(error) {
        Toast(error.message, {}, ERROR);
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
            event: 'NEW_ETH_TRANSFER'
          };
        },
        skip() {
          return !this.isEthNetwork;
        },
        result() {
          this.$apollo.queries.getEthBalance.refetch();
        },
        error(error) {
          Toast(error.message, {}, ERROR);
        }
      }
    },
    /**
     * Apollo query to fetch latest Eth price in USD.
     */
    getLatestPrices: {
      query: getUSDPrice,
      skip() {
        return !this.isEthNetwork;
      },
      result({ data }) {
        const ethereumPrice = data.getLatestPrices.filter(item => {
          if (item.id === tokens.eth) return item;
        });

        if (ethereumPrice) {
          const usd = {
            value: ethereumPrice[0].current_price,
            symbol: '$',
            name: 'USD',
            price_change_24h: ethereumPrice[0].price_change_24h
          };
          this.setETHUSDValue(usd);
        }
      },
      error(error) {
        Toast(error.message, {}, ERROR);
      }
    }
  },
  computed: {
    ...mapState('wallet', ['address', 'web3']),
    ...mapState('global', ['online']),
    ...mapGetters('global', ['isEthNetwork', 'network'])
  },
  watch: {
    web3() {
      this.web3.eth.clearSubscriptions();
      this.subscribeToBlockNumber();
      this.getTokens();
      this.getPriceAndBalance();
    }
  },
  mounted() {
    if (this.online) {
      this.getTokens();
      this.getPriceAndBalance();
      this.subscribeToBlockNumber();
    }
  },
  destroyed() {
    this.web3.eth.clearSubscriptions();
  },
  methods: {
    ...mapActions('wallet', [
      'setAccountBalance',
      'setBlockNumber',
      'setTokens'
    ]),
    ...mapActions('global', ['setGasPrice']),
    ...mapActions('external', ['setETHUSDValue']),
    getTokens() {
      if (this.isEthNetwork) {
        const tokensList = new TokenCalls(this.$apollo);
        tokensList.getOwnersERC20Tokens(this.address).then(res => {
          this.setTokens(res);
        });
      } else {
        this.setTokens(this.network.type.tokens);
      }
    },
    getPriceAndBalance() {
      if (!this.isEthNetwork) {
        this.web3.eth.getBalance(this.address).then(res => {
          this.setAccountBalance(toBN(res));
        });
      }
      this.web3.eth.getGasPrice().then(res => {
        this.setGasPrice(getGasBasedOnType(res, gasPriceTypes.ECONOMY));
      });
    },
    subscribeToBlockNumber() {
      this.web3.eth.getBlockNumber().then(res => {
        this.setBlockNumber(res);
      });
      this.web3.eth.subscribe('newBlockHeaders').on('data', res => {
        this.setBlockNumber(res.number);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-shadow {
  box-shadow: 0 0 15px var(--v-boxShadow-base) !important;
}
.wallet-main {
  background-color: var(--v-walletBg-base);
  height: 100%;
}
</style>
