<template>
  <white-sheet :sideinfo="!mobile">
    <div class="px-5 px-lg-7 pt-5">
      <div class="d-flex align-center justify-space-between">
        <span class="mew-heading-2">{{ $t('common.swap') }}</span>
        <mew-button
          btn-style="transparent"
          button-size="small"
          :title="$t('common.more') + '...'"
          @click.native="toSwap"
        />
      </div>
    </div>
    <div v-if="!loading && !error && hasSwapRates" class="px-3 py-1">
      <div v-for="(data, key) in swapRates" :key="key" class="mb-4">
        <v-btn
          v-if="data.rate"
          color="buttonGrayLight"
          block
          x-large
          depressed
          class="d-flex align-center justify-space-between border-radius--10px mt-2 py-3 px-4 cursor bs-button"
          @click="goToSwap(data)"
        >
          <div class="text-uppercase">
            1 {{ data.fromT.symbol }} / {{ data.rate }} {{ data.toT.symbol }}
          </div>
          <div class="d-flex align-center">
            <mew-token-container
              size="small"
              class="pa-1"
              :img="ethIcon"
            ></mew-token-container>
            <img
              width="18"
              class="mx-2"
              src="@/assets/images/icons/icon-swap-arrow-grey.png"
              alt="swap-icon"
            />
            <mew-token-container
              size="small"
              :img="
                require('@/assets/images/currencies/' +
                  data.toT.symbol.toLowerCase() +
                  '.png')
              "
            ></mew-token-container>
          </div>
        </v-btn>
      </div>
    </div>
    <div
      v-if="loading"
      class="pa-3 pb-4 d-flex flex-column align-center justify-space-around"
    >
      <v-progress-circular indeterminate />
      <h3 class="ma-3">Loading swap pairs...</h3>
    </div>
    <div
      v-if="showTokenIssue"
      class="pa-3 pb-4 d-flex flex-column align-center justify-space-around"
    >
      <v-progress-circular indeterminate />
      <h3 class="ma-3">Having issues loading tokens.</h3>
      <h5 class="mb-2 cursor--pointer greenPrimary--text" @click="fetchRates">
        Try again?
      </h5>
    </div>
  </white-sheet>
</template>

<script>
import ethIcon from '@/assets/images/networks/eth.svg';
import { mapState, mapGetters, mapActions } from 'vuex';
import { toWei } from 'web3-utils';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import { DASHBOARD } from '../analytics-opt-in/handlers/configs/events';
import handlerSwap from '@/modules/swap/handlers/handlerSwap';

const STATIC_PAIRS = [
  {
    toT: {
      symbol: 'BTC',
      contract: '0xbtc'
    },
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    fromAmount: toWei('1')
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDT',
      contract: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimals: 6
    },
    fromAmount: toWei('1')
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'KNC',
      contract: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      toT: 18
    },
    fromAmount: toWei('1')
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'DAI',
      contract: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18
    },
    fromAmount: toWei('1')
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'LINK',
      contract: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18
    },
    fromAmount: toWei('1')
  },
  {
    fromT: {
      symbol: 'ETH',
      contract: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDC',
      contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6
    },
    fromAmount: toWei('1')
  }
];
export default {
  name: 'ModuleSwapRates',
  mixins: [handlerAnalytics],
  props: {
    mobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ethIcon: ethIcon,
      swapHandler: null,
      loading: true,
      error: false
    };
  },
  computed: {
    ...mapState('wallet', ['web3', 'swapRates']),
    ...mapGetters('global', ['isEthNetwork', 'network']),
    showTokenIssue() {
      return (this.error || !this.hasSwapRates) && !this.loading;
    },
    hasSwapRates() {
      if (this.swapRates) {
        return this.swapRates.some(item => {
          return item.rate;
        });
      }
      return false;
    }
  },
  watch: {
    web3(newVal) {
      this.setSwapHandler(newVal, this.network.type.name);
    }
  },
  mounted() {
    this.setSwapHandler(this.web3, this.network.type.name);
  },
  methods: {
    ...mapActions('wallet', ['setSwapRates']),
    setSwapHandler(val) {
      if (!this.isEthNetwork) return;
      this.swapHandler = new handlerSwap(val, this.network.type.name);
      this.loading = this.swapRates.length === 0;
      if (this.swapRates.length !== 0) return;
      this.fetchRates();
    },
    fetchRates() {
      try {
        this.loading = true;
        this.swapHandler.getQuotesForSet(STATIC_PAIRS).then(res => {
          this.setSwapRates(
            STATIC_PAIRS.map((itm, idx) => {
              itm['rate'] =
                res[idx] &&
                res[idx].length !== 0 &&
                res[idx][0] &&
                res[idx][0]?.amount
                  ? formatFloatingPointValue(res[idx][0]?.amount).value
                  : false;
              return itm;
            })
          );
          this.loading = false;
        });
      } catch (e) {
        this.loading = false;
        this.error = true;
        Toast(e.message, {}, ERROR);
      }
    },
    toSwap() {
      this.trackDashboardAmplitude(DASHBOARD.SWAP_PAIRS);
      this.navigateToSwap();
    },
    goToSwap(data) {
      const obj = {
        fromToken: data.fromT.contract,
        toToken: data.toT.contract,
        amount: '1'
      };
      this.trackDashboardAmplitude(DASHBOARD.SWAP_PAIRS, {
        TokenPair: `${data.fromT.symbol} to ${data.toT.symbol}`
      });
      this.navigateToSwap(obj);
    },
    navigateToSwap(query) {
      const obj = { name: 'Swap' };
      if (query) {
        obj['query'] = query;
      }
      if (this.$route.name === 'Swap') {
        // this will allow vue to update query param
        // within the swap page when user clicks on the pairs again
        this.$router.replace(obj);
      } else {
        this.$router.push(obj);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cursor {
  cursor: pointer;
}
</style>
