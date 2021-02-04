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
    <div class="pa-3">
      <v-sheet
        v-for="(data, key) in swapData"
        :key="key"
        color="tableHeader"
        class="d-flex align-center justify-space-between border-radius--5px mt-1 py-3 px-4"
      >
        <div class="text-uppercase">
          {{ data.rate }} {{ data.currency }} / ETH
        </div>
        <div class="d-flex align-center">
          <img
            width="22"
            :src="
              require('@/assets/images/currencies/' + data.currency + '.png')
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
            src="@/assets/images/currencies/eth.png"
            alt="eth-icon"
          />
        </div>
      </v-sheet>
    </div>
  </mew6-white-sheet>
</template>

<script>
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import { mapState, mapGetters } from 'vuex';
const STATIC_PAIRS = [
  {
    toT: {
      symbol: 'ETH',
      decimals: 18
    },
    fromT: {
      symbol: 'BTC'
    },
    fromAmount: '100000000000000000'
  },
  {
    toT: {
      symbol: 'ETH',
      decimals: 18
    },
    fromT: {
      symbol: 'EUR'
    },
    fromAmount: '100000000000000000'
  },
  {
    toT: {
      symbol: 'ETH',
      decimals: 18
    },
    fromT: {
      symbol: 'KNC',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    toT: {
      symbol: 'ETH',
      decimals: 18
    },
    fromT: {
      symbol: 'DAI',
      decimals: 18
    },
    fromAmount: '100000000000000000'
  },
  {
    toT: {
      symbol: 'ETH',
      decimals: 18
    },
    fromT: {
      symbol: 'MKR',
      decimals: 18
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
      swapData: [
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        },
        {
          rate: '0.002',
          currency: 'btc'
        }
      ],
      swapHandler: null,
      newData: null,
      loading: false
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
      this.newData = null;
      this.loading = true;
      this.swapHandler.getQuotesForSet(STATIC_PAIRS).then(res => {
        console.log(res);
      });
    }
  }
};
</script>
