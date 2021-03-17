<template>
  <div>
    <the-wrapper-dapp
      :has-exit-btn="true"
      :banner-img="BG"
      :banner-text="topBanner"
      :tab-items="tabs"
      :active-tab="activeTab"
    >
      <!-- <div class="d-flex align-center">
      <deposit-overlay :open="openDepositOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openDepositOverlay = true"
      >
        Deposit Overlay
      </div>

      <borrow-overlay :open="openBorrowOverlay" />
      <div
        class="cursor--pointer font-weight-bold mr-4"
        @click="openBorrowOverlay = true"
      >
        Borrow Overlay
      </div>
    </div> -->
      <template #tabContent1>
        <v-sheet color="transparent" max-width="700px" class="mx-auto py-6">
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div class="primary--text font-weight-bold mr-3">
              {{ healthFactor }}
            </div>
            <mew-tooltip text="Health factor" />
          </div>
          <v-row class="mb-1 mt-2">
            <v-col cols="6" class="pa-1">
              <div class="tableHeader pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 class="font-weight-bold">$ {{ totalLiquidity.usd }}</h3>
                <div class="mt-2">{{ totalLiquidity.eth }} ETH</div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  class="mt-2"
                  :balance-obj="compositionPercentage"
                />
              </div>
            </v-col>
            <v-col cols="6" class="pa-1">
              <div class="tableHeader pa-5 border-radius--5px">
                <v-row>
                  <v-col cols="9">
                    <h5 class="mb-2 font-weight-bold">Earnings</h5>
                  </v-col>
                  <v-col cols="3"> blue purp </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
          <v-row class="pl-1 pr-1">
            <mew-table
              :table-headers="depositsTableHeader"
              :table-data="depositsTableData"
            />
          </v-row>

          <div class="d-flex justify-center mt-9">
            <mew-button title="Deposit" btn-size="xlarge"></mew-button>
          </div>
        </v-sheet>
      </template>
      <template #tabContent2>
        <v-sheet color="transparent" max-width="700px" class="mx-auto py-6">
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div class="primary--text font-weight-bold mr-3">2.45345</div>
            <mew-tooltip text="Health factor" />
          </div>

          <v-row>
            <v-col cols="6">
              <div class="tableHeader pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 class="font-weight-bold">$40.00</h3>
                <div class="mt-2">0 ETH</div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                  <div class="d-flex align-center">
                    <div class="blue--text font-weight-bold mr-2">100%</div>
                    <div>Available</div>
                  </div>
                </div>
                <mew-progress-bar class="mt-2" :balance-obj="balance" />
              </div>
            </v-col>
            <v-col cols="6">
              <div class="tableHeader pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 class="font-weight-bold">$40.00</h3>
                <div class="mt-2">0 ETH</div>

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                  <div class="d-flex align-center">
                    <div class="blue--text font-weight-bold mr-2">100%</div>
                    <div>Available</div>
                  </div>
                </div>
                <mew-progress-bar class="mt-2" :balance-obj="balance" />
              </div>
            </v-col>
          </v-row>

          <div
            class="tableHeader pa-5 border-radius--5px d-flex align-center justify-space-between"
          >
            <div class="font-weight-bold">Loan to value</div>
            <div class="font-weight-bold">65.04%</div>
          </div>

          <mew-table
            class="mt-3"
            :table-headers="borrowingsTableHeader"
            :table-data="borrowingsTableData"
          />

          <div class="d-flex justify-center mt-9">
            <mew-button title="Borrow" btn-size="xlarge"></mew-button>
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
  </div>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
// import depositOverlay from './components/AaveDepositOverlay';
// import borrowOverlay from './components/AaveBorrowOverlay';
import handlerAave from './handlers/handlerAave';
import AaveCalls from './apollo/queries/queries';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';

const COLORS = {
  ENJ: '#f5a623',
  ETH: '#ffbb40',
  ZRX: '#f9d6da',
  KNC: '#1d89ff',
  USDT: '#f00',
  MKR: '#00b3db',
  LEND: '#f9d6da',
  AAVE: '#5a78f0',
  DAI: '#5c74eb',
  SUSD: '#3766aa',
  LINK: '#c9f2ed',
  BUSD: '#aa0087',
  REN: '#f37240',
  WBTC: '#00b3db',
  UNI: '#a16bff',
  REP: '#3a6ea7',
  MANA: '#fece00',
  BAT: '#4568bb',
  YFI: '#fff',
  TUSD: '#fff'
};

export default {
  components: { TheWrapperDapp },
  data() {
    return {
      handler: null,
      caller: null,
      activeTab: 0,
      BG: BG,
      topBanner: {
        title: 'AAVE',
        subtext:
          'Aave is an Open Source Money Market Protocol, allowing you to earn daily interest on your stablecoins. Borrow against various assets and switch interest between variable and stable rates'
      },
      openDepositOverlay: false,
      openBorrowOverlay: false,
      depositsTableHeader: [
        {
          text: 'Activity',
          value: 'activity',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
          filterable: false,
          width: '60%'
        },
        {
          text: 'Tx Hash',
          value: 'txHash',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      depositsTableData: [
        {
          activity: 'Deposited 0.0001 ETH into Vault',
          date: '01/02/2020, 2:16:32 PM',
          txHash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 30.0000 new Dai from Vault',
          date: '01/02/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 2.0 new Dai from Vault',
          date: '01/05/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      borrowingsTableHeader: [
        {
          text: 'Activity',
          value: 'activity',
          sortable: false,
          filterable: false,
          width: '100%'
        },
        {
          text: 'Date',
          value: 'date',
          sortable: false,
          filterable: false,
          width: '60%'
        },
        {
          text: 'Tx Hash',
          value: 'txHash',
          sortable: false,
          filterable: false,
          containsLink: true,
          width: '100%'
        }
      ],
      borrowingsTableData: [
        {
          activity: 'Deposited 0.0001 ETH into Vault',
          date: '01/02/2020, 2:16:32 PM',
          txHash: '0xDECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 30.0000 new Dai from Vault',
          date: '01/02/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        },
        {
          activity: 'Generated 2.0 new Dai from Vault',
          date: '01/05/2020, 1:25:53 PM',
          txHash: '0xAECAF9CD2367cdbb726E904cD6397eDFcAe6068D'
        }
      ],
      tabs: [{ name: 'Deposits' }, { name: 'Borrowings' }],

      balance: {
        total: 20.32,
        data: [
          {
            color: 'titlePrimary',
            amount: 5.3,
            tooltip: 'Send: 5.3',
            percentage: '26.08'
          },
          {
            color: 'warning darken-1',
            amount: 3.2,
            tooltip: 'Fee: 3.2',
            percentage: '15.75'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters('global', ['isEthNetwork']),
    ...mapState('external', ['ETHUSDValue']),
    healthFactor() {
      if (!this.handler) return '-';
      return BigNumber(this.handler.userSummary.healthFactor).gt(0)
        ? this.handler.userSummary.healthFactor
        : `-`;
    },
    totalLiquidity() {
      const eth =
        !this.handler || this.handler.userSummary.totalLiquidityETH === 'NaN'
          ? '0'
          : this.handler.userSummary.totalLiquidityETH;
      const usd =
        !this.handler || this.handler.userSummary.totalLiquidityETH === 'NaN'
          ? '0'
          : BigNumber(this.handler.userSummary.totalLiquidityETH)
              .times(this.ETHUSDValue.value ? this.ETHUSDValue.value : 0)
              .toFixed(2);

      return {
        eth: this.handler ? eth : '0',
        usd: this.handler ? usd : '0'
      };
    },
    compositionPercentage() {
      if (
        this.handler &&
        this.handler.userSummary &&
        Object.keys(this.handler.userSummary).length > 0
      ) {
        const total = this.handler.userSummary.totalLiquidityETH;
        const data = this.handler.userSummary.reservesData.map(item => {
          item['percentage'] = BigNumber(item.currentUnderlyingBalance)
            .times(100)
            .div(total)
            .toFixed();
          item['color'] = COLORS[item.reserve.symbol];
          return item;
        });
        const newObj = {
          total: total,
          data: data
        };

        return newObj;
      }

      return {
        total: 0,
        data: []
      };
    }
  },
  watch: {
    isEthNetwork(newVal) {
      if (newVal) {
        this.setCallerAndHandler();
      } else {
        this.handler = null;
        this.caller = null;
      }
    }
  },
  mounted() {
    this.setCallerAndHandler();
  },
  methods: {
    setCallerAndHandler() {
      this.handler = new handlerAave();
      this.caller = new AaveCalls(this.$apollo);
      this.caller.getUserData(res => {
        this.handler._userDataHandler(res);
      });
      this.caller.getUsdPriceEth(res => {
        this.handler._usdPriceHandler(res);
      });
      this.caller.getReserveData(res => {
        this.handler._reserveDataHandler(res);
      });
    }
  }
};
</script>

<style lang="scss">
// Fix mew-components
.mew-component-fix--aave {
  .mew-banner {
    min-height: 180px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    .exit-container {
      display: none;
    }
    .banner-content {
      > div:nth-child(2) {
        margin-top: 9px;
        max-width: 700px;
        padding: 0 20px !important;
      }
    }
    .mew-subtitle {
      font-size: 36px !important;
    }
  }
  .v-tab {
    letter-spacing: -0.1px;
  }
  .v-tabs-bar {
    height: 70px;
  }
}
</style>
