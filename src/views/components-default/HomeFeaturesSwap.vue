<template>
  <mew6-white-sheet
    class="mew-component--features-swap pa-6 pa-md-10"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">Swap with MEW</div>
    <div>
      Swap fiat to ETH, ETH to BTC, and ETH to ERC20 tokens via integrated
      partners 1inch, DEX AG, Changelly, Bity, and Simplex.
    </div>
    <div class="mt-10">
      <v-row v-if="!loading && !error">
        <v-col
          v-for="(data, key) in swapData"
          :key="key"
          cols="12"
          md="6"
          style="padding: 4px !important"
        >
          <v-sheet
            v-if="data.rate"
            color="tableHeader"
            class="
              d-flex
              align-center
              justify-space-between
              border-radius--5px
              py-5
              px-4
              cursor cursor--pointer
            "
            @click="goToSwap(data)"
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
        </v-col>
      </v-row>
      <mew-button
        title="Swap"
        btn-size="xlarge"
        class="mx-auto mt-12 d-block"
        @click.native="
          $router.push({ name: ROUTES_HOME.ACCESS_WALLET.NAME, params: {} })
        "
      />
    </div>
  </mew6-white-sheet>
</template>

<script>
import handlerSwap from '@/modules/swap/handlers/handlerSwap';
import { mapState, mapGetters } from 'vuex';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ROUTES_HOME } from '@/core/configs/configRoutes';

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
    fromAmount: '100000000000000000'
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
    fromAmount: '100000000000000000'
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
    fromAmount: '100000000000000000'
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
    fromAmount: '100000000000000000'
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
    fromAmount: '100000000000000000'
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
    fromAmount: '100000000000000000'
  }
];
export default {
  name: 'HomeFeaturesSwap',
  components: {},
  data() {
    return {
      swapHandler: null,
      swapData: null,
      loading: true,
      error: false,
      ROUTES_HOME: ROUTES_HOME
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
      try {
        this.swapData = null;
        this.loading = true;
        this.swapHandler.getQuotesForSet(STATIC_PAIRS).then(res => {
          this.swapData = STATIC_PAIRS.map((itm, idx) => {
            itm['rate'] =
              res[idx].length === 0
                ? false
                : formatFloatingPointValue(res[idx][0].amount).value;
            return itm;
          });
          this.loading = false;
        });
      } catch (e) {
        this.loading = false;
        this.error = true;
        Toast(e.message, {}, ERROR);
      }
    },
    goToSwap(data) {
      const obj = {
        fromToken: data.fromT.contract,
        toToken: data.toT.contract,
        amount: '1'
      };

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

<style lang="scss" scoped></style>
