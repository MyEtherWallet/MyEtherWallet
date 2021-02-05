<template>
  <mew6-white-sheet :sideinfo="!mobile">
    <div class="px-5 px-lg-7 py-5">
      <div class="d-flex align-center justify-space-between">
        <span class="mew-heading-2">{{ $t('common.swap') }}</span>
        <mew-button
          btn-style="transparent"
          button-size="small"
          :title="$t('common.more') + '...'"
          @click.native="navigateToSwap"
        />
      </div>
    </div>
    <div v-if="!loading" class="pa-3">
      <v-sheet
        v-for="(data, key) in swapData"
        :key="key"
        color="tableHeader"
        class="d-flex align-center justify-space-between border-radius--5px mt-1 py-3 px-4"
      >
        <div class="text-uppercase">
          1 {{ data.fromT.symbol }} / {{ data.rate }} {{ data.toT.symbol }}
        </div>
        <div class="d-flex align-center">
          <img
            width="22"
            :src="
              require('@/assets/images/currencies/' +
                data.fromT.symbol.toLowerCase() +
                '.png')
            "
            alt="currency-icon"
          />
          <img
            width="18"
            class="mx-2"
            src="@/assets/images/icons/icon-swap-arrow-grey.png"
            alt="swap-icon"
          />
          <img
            width="22"
            :src="
              require('@/assets/images/currencies/' +
                data.toT.symbol.toLowerCase() +
                '.png')
            "
            alt="eth-icon"
          />
        </div>
      </v-sheet>
    </div>
    <div
      v-else
      class="pa-3 d-flex flex-column align-center justify-space-around"
    >
      <v-progress-circular indeterminate />
      <h3 ma-3>Loading swap pairs...</h3>
    </div>
  </mew6-white-sheet>
</template>

<script>
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import { mapState, mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
const STATIC_PAIRS = [
  {
    toT: {
      symbol: 'BTC',
      contract_address: '0xbtc'
    },
    fromT: {
      symbol: 'ETH',
      contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDT',
      contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimals: 6
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'KNC',
      contract_address: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
      toT: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'DAI',
      contract_address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'LINK',
      contract_address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    fromT: {
      symbol: 'ETH',
      contract_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      decimals: 18
    },
    toT: {
      symbol: 'USDC',
      contract_address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimals: 6
    },
    fromAmount: '100000000000000000'
  }
];
export default {
  components: {},
  props: {
    mobile: {
      type: Boolean,
      default: false
    },
    navigateToSwap: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      swapHandler: null,
      swapData: null,
      loading: true
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('global', ['network'])
  },
  watch: {
    web3(newVal) {
      this.setSwapHandler(newVal);
    }
  },
  mounted() {
    this.setSwapHandler(this.web3);
  },
  methods: {
    setSwapHandler(val) {
      this.swapHandler = new handlerSwap(val);
      this.fetchRates();
    },
    fetchRates() {
      this.swapData = null;
      this.loading = true;
      this.swapHandler.getQuotesForSet(STATIC_PAIRS).then(res => {
        this.swapData = STATIC_PAIRS.map((itm, idx) => {
          itm['rate'] =
            res[idx][0].amount <= 0
              ? res[idx][0].amount
              : new BigNumber(res[idx][0].amount).toFixed(2);
          return itm;
        });
        this.loading = false;
      });
    }
  }
};
</script>
