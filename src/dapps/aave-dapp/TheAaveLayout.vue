<template>
  <div class="mew-component--aave">
    <the-wrapper-dapp
      :is-new-header="true"
      :dapp-img="headerImg"
      :banner-text="topBanner"
      :tab-items="tabs"
      :active-tab="activeTab"
      external-contents
      :on-tab="tabChanged"
      :valid-networks="validNetworks"
    >
      <template #tabContent1>
        <v-sheet
          color="transparent"
          max-width="724px"
          class="mx-auto py-6 px-2 px-md-3"
        >
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div
              v-if="!isLoadingData"
              class="font-weight-bold mr-3"
              :class="healthFactorColor"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip :text="healthFactorTooltip" />
          </div>
          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="bgWalletBlockDark pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 v-if="!isLoadingData" class="">
                  {{ totalLiquidity.usd }}
                </h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalLiquidity.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :data="compositionPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  type="text"
                  class="mt-2"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div
                class="bgWalletBlockDark pa-5 border-radius--5px height-100 d-flex flex-column"
              >
                <div class="d-flex aling-center">
                  <h5 class="font-weight-bold mr-auto">Earnings</h5>
                  <div class="d-flex align-center">
                    <div class="d-flex align-center mr-3">
                      <div class="circle pink mr-1" />
                      APR
                    </div>
                    <div class="d-flex align-center">
                      <div class="circle lightblue mr-1" />
                      Total
                    </div>
                  </div>
                </div>

                <div class="ma-auto text-center pa-5">No data to show yet</div>
              </div>
            </v-col>
            <v-col cols="12" class="pt-md-2">
              <aave-table
                ref="depositsTable"
                :title="aaveTableTitle.balance_deposit"
                :has-search="false"
                :has-toggle="false"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Deposit"
              btn-size="xlarge"
              @click.native="toggleDepositOverlay(true)"
            />
          </div>
        </v-sheet>
      </template>
      <template #tabContent2>
        <v-sheet
          color="transparent"
          max-width="724px"
          class="mx-auto py-6 px-2 px-md-3"
        >
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div
              v-if="!isLoadingData"
              class="font-weight-bold mr-3"
              :class="healthFactorColor"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip :text="healthFactorTooltip" />
          </div>

          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="bgWalletBlockDark pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">You Borrowed</h5>
                <h3 v-if="!isLoadingData">{{ totalBorrow.usd }}</h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalBorrow.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :data="borrowingsPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  type="text"
                  class="mt-2 mb-0"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="bgWalletBlockDark pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Your Collateral</h5>
                <h3 v-if="!isLoadingData">{{ totalCollateral.usd }}</h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalCollateral.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :data="collateralPercentage"
                />
                <v-skeleton-loader
                  v-else
                  class="mt-2"
                  height="12px"
                  type="text"
                />
              </div>
            </v-col>

            <v-col cols="12" class="pt-md-2">
              <div class="bgWalletBlockDark pa-5 loan-value-container">
                <v-row align="center">
                  <v-col cols="9">
                    <span class="mew-heading-3">Loan to Value</span>
                  </v-col>
                  <v-col cols="3">
                    <div class="d-flex justify-end align-center">
                      <span v-if="!isLoadingData" class="mew-heading-3">{{
                        loanValue
                      }}</span>
                      <v-skeleton-loader
                        v-else
                        height="19px"
                        width
                        type="text"
                        class="mt-2 mb-0"
                      />
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="12" class="pt-md-2">
              <aave-table
                ref="borrowsTable"
                :title="aaveTableTitle.balance_borrow"
                :has-search="false"
                :has-toggle="false"
              />
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Borrow"
              btn-size="xlarge"
              @click.native="toggleBorrowOverlay(true)"
            />
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <aave-deposit-overlay
      :open="showDepositOverlay"
      :close="toggleDepositOverlay"
      :pre-selected-token="tokenSelected"
    />
    <aave-borrow-overlay
      :pre-selected-token="tokenSelected"
      :open="showBorrowOverlay"
      :close="toggleBorrowOverlay"
    />
    <aave-collateral-overlay
      :open="showCollateralOverlay"
      :close="closeCollateralOverlay"
      :pre-selected-token="tokenSelected"
      @onConfirm="setCollateral"
      @onClose="resetCollateralToggle"
    />
    <aave-withdraw-overlay
      :open="showWithdrawOverlay"
      :close="closeWithdrawOverlay"
      :pre-selected-token="tokenSelected"
    />
    <aave-repay-overlay
      :open="showRepayOverlay"
      :close="closeRepayOverlay"
      :pre-selected-token="tokenSelected"
    />
    <aave-set-apr-overlay
      :open="showAprTypeOverlay"
      :close="closeAprTypeOverlay"
      :pre-selected-token="tokenSelected"
      @onConfirm="setBorrowRate"
      @onClose="resetAprToggle"
    />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { SUPPORTED_NETWORKS } from './handlers/supportedNetworks';
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import AaveBorrowOverlay from './components/overlays/AaveBorrowOverlay';
import AaveDepositOverlay from './components/overlays/AaveDepositOverlay';
import AaveCollateralOverlay from './components/overlays/AaveCollateralOverlay';
import AaveRepayOverlay from './components/overlays/AaveRepayOverlay';
import AaveWithdrawOverlay from './components/overlays/AaveWithdrawOverlay';
import AaveSetAprOverlay from './components/overlays/AaveSetAprOverlay';
import { AAVE_TABLE_TITLE } from '@/dapps/aave-dapp/handlers/helpers';
import AaveTable from './components/AaveTable';
import handlerAave from './handlers/handlerAave.mixin';
import {
  formatPercentageValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { EventBus } from '@/core/plugins/eventBus';
const COLORS = {
  ENJ: 'bluePrimary',
  ETH: 'greenPrimary',
  ZRX: 'greenMedium',
  KNC: 'textDark',
  USDT: 'redPrimary',
  MKR: 'redPrimary',
  LEND: 'redPrimary',
  AAVE: 'textLight',
  DAI: 'textLight',
  SUSD: 'greyPrimary',
  LINK: 'greyMedium',
  BUSD: 'greyMedium',
  REN: 'greenPrimary',
  WBTC: 'greyMedium',
  UNI: 'redMedium',
  REP: 'greyLight',
  MANA: 'greyLight',
  BAT: 'greyLight',
  YFI: 'white',
  TUSD: 'black'
};

export default {
  name: 'AaveLayout',
  components: {
    TheWrapperDapp,
    AaveBorrowOverlay,
    AaveDepositOverlay,
    AaveTable,
    AaveCollateralOverlay,
    AaveRepayOverlay,
    AaveWithdrawOverlay,
    AaveSetAprOverlay
  },
  mixins: [handlerAave],
  data() {
    return {
      validNetworks: SUPPORTED_NETWORKS,
      headerImg: require('@/assets/images/icons/dapps/icon-dapp-aave.svg'),
      showDepositOverlay: false,
      tokenSelected: {},
      showBorrowOverlay: false,
      showWithdrawOverlay: false,
      showCollateralOverlay: false,
      showRepayOverlay: false,
      showAprTypeOverlay: false,
      activeTab: 0,
      topBanner: {
        title: 'AAVE',
        subtext:
          'Aave is an Open Source Money Market Protocol, allowing you to earn daily interest on your stablecoins. Borrow against various assets and switch interest between variable and stable rates'
      },
      tabs: [{ name: 'Deposits' }, { name: 'Borrowings' }],
      aaveTableTitle: AAVE_TABLE_TITLE
    };
  },
  computed: {
    ...mapState('wallet', ['web3']),
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['isEthNetwork', 'getFiatValue']),
    ...mapGetters('external', ['fiatValue']),
    loanValue() {
      return formatPercentageValue(
        BigNumber(this.userSummary.currentLoanToValue).times(100)
      ).value;
    },
    healthFactor() {
      return BigNumber(this.userSummary.healthFactor).gt(0)
        ? formatFloatingPointValue(this.userSummary.healthFactor).value
        : `-`;
    },
    healthFactorTooltip() {
      return 'The health factor is the numeric representation of the safety of your deposited assets against the borrowed assets and its underlying value. The higher the value is, the safer the state of your funds are against a liquidation scenario.';
    },
    totalLiquidity() {
      return {
        eth: formatFloatingPointValue(
          this.userSummary.totalLiquidityMarketReferenceCurrency || '0'
        ).value,
        usd: this.getFiatValue(
          this.formatUSDValue(this.userSummary.totalLiquidityUSD || '0')
        )
      };
    },
    totalCollateral() {
      return {
        eth: formatFloatingPointValue(
          this.userSummary.totalCollateralMarketReferenceCurrency || '0'
        ).value,
        usd: this.getFiatValue(
          this.formatUSDValue(this.userSummary.totalCollateralUSD || '0')
        )
      };
    },
    totalBorrow() {
      return {
        eth: formatFloatingPointValue(
          this.userSummary.totalBorrowsMarketReferenceCurrency || '0'
        ).value,
        usd: this.getFiatValue(
          this.formatUSDValue(this.userSummary.totalBorrowsUSD || '0')
        )
      };
    },
    compositionPercentage() {
      if (this.userSummary && Object.keys(this.userSummary).length > 0) {
        const total = this.userSummary.totalLiquidityMarketReferenceCurrency;
        return this.userSummary.userReservesData
          .filter(item => {
            return item.underlyingBalance > 0.00001;
          })
          .map(item => {
            return {
              percentage: BigNumber(
                item.underlyingBalanceMarketReferenceCurrency
              )
                .div(total)
                .times(100)
                .toFixed(),
              color: COLORS[item.reserve.symbol],
              tooltip:
                formatFloatingPointValue(item.underlyingBalance).value +
                ' ' +
                item.reserve.symbol
            };
          });
      }
      return [];
    },
    collateralPercentage() {
      if (this.userSummary && Object.keys(this.userSummary).length > 0) {
        return this.userSummary.userReservesData
          .filter(item => {
            return (
              item.usageAsCollateralEnabledOnUser &&
              item.underlyingBalanceMarketReferenceCurrency > 0
            );
          })
          .map(item => {
            return {
              percentage: BigNumber(
                item.underlyingBalanceMarketReferenceCurrency
              )
                .times(100)
                .div(this.userSummary.totalCollateralMarketReferenceCurrency)
                .toFixed(),
              color: COLORS[item.reserve.symbol],
              tooltip:
                formatFloatingPointValue(item.underlyingBalance).value +
                ' ' +
                item.reserve.symbol
            };
          });
      }
      return [];
    },
    borrowingsPercentage() {
      if (this.userSummary && Object.keys(this.userSummary).length > 0) {
        let totalAvailablePercentage = 100;
        const data = this.userSummary.userReservesData
          .filter(item => {
            return item.totalBorrowsMarketReferenceCurrency > 0.001;
          })
          .map(item => {
            const percentage = BigNumber(
              item.totalBorrowsMarketReferenceCurrency
            )
              .times(100)
              .div(this.userSummary.totalBorrowsMarketReferenceCurrency)
              .toFixed();
            totalAvailablePercentage = totalAvailablePercentage - percentage;
            return {
              percentage: percentage,
              color: COLORS[item.reserve.symbol],
              tooltip:
                formatFloatingPointValue(
                  item.totalBorrowsMarketReferenceCurrency
                ).value +
                ' ' +
                item.reserve.symbol
            };
          });
        if (totalAvailablePercentage > 0) {
          data.push({
            percentage: totalAvailablePercentage,
            color: '#c7c7c7',
            tooltip:
              formatFloatingPointValue(
                this.userSummary.availableBorrowsMarketReferenceCurrency
              ).value + ' Available to Borrow'
          });
        }
        return data;
      }

      return [];
    },
    healthFactorColor() {
      if (this.healthFactor < 2 && this.healthFactor >= 1.2)
        return 'orangePrimary--text';
      else if (this.healthFactor < 1.2) return 'redPrimary--text';

      return 'greenPrimary--text';
    }
  },
  watch: {
    showDepositOverlay(newVal) {
      if (!newVal) this.tokenSelected = {};
    },
    showBorrowOverlay(newVal) {
      if (!newVal) this.tokenSelected = {};
    },
    activeTab() {
      this.tokenSelected = {};
    }
  },
  mounted() {
    EventBus.$on('selectedBorrow', this.openBorrowOverlayWithToken);
    EventBus.$on('repayBorrowing', this.openRepayOverlay);
    EventBus.$on('changeAprType', this.openAprTypeOverlay);
    EventBus.$on('selectedDeposit', this.openDepositOverlayWithToken);
    EventBus.$on('withdrawToken', this.openWithdrawOverlay);
    EventBus.$on('collateralChange', this.openCollateralOverlay);
  },
  beforeDestroy() {
    EventBus.$off('selectedBorrow');
    EventBus.$off('repayBorrowing');
    EventBus.$off('changeAprType');
    EventBus.$off('selectedDeposit');
    EventBus.$off('withdrawToken');
    EventBus.$off('collateralChange');
  },
  methods: {
    tabChanged(tab) {
      this.activeTab = tab;
    },
    toggleDepositOverlay(boolean) {
      if (!boolean) {
        this.tokenSelected = {};
      }
      this.showDepositOverlay = boolean;
    },
    toggleBorrowOverlay(boolean) {
      if (!boolean) {
        this.tokenSelected = {};
      }
      this.showBorrowOverlay = boolean;
    },
    openDepositOverlayWithToken(token) {
      this.tokenSelected = token;
      this.showDepositOverlay = true;
    },
    openBorrowOverlayWithToken(token) {
      this.tokenSelected = token;
      this.showBorrowOverlay = true;
    },
    openWithdrawOverlay(token) {
      this.tokenSelected = token;
      this.showWithdrawOverlay = true;
    },
    closeWithdrawOverlay() {
      this.tokenSelected = {};
      this.showWithdrawOverlay = false;
    },
    openCollateralOverlay(token) {
      this.tokenSelected = token;
      this.showCollateralOverlay = true;
    },
    closeCollateralOverlay() {
      this.tokenSelected = {};
      this.showCollateralOverlay = false;
    },
    resetCollateralToggle({ reserve, useAsCollateral }) {
      const tableData =
        this.$refs.depositsTable.$children[0].$options.propsData.tableData;
      tableData.forEach(item => {
        if (item.token === reserve) item.toggle.value = useAsCollateral;
      });
      this.tokenSelected = {};
      this.showCollateralOverlay = false;
    },
    openRepayOverlay(token) {
      this.tokenSelected = token;
      this.showRepayOverlay = true;
    },
    closeRepayOverlay() {
      this.tokenSelected = {};
      this.showRepayOverlay = false;
    },
    openAprTypeOverlay(token) {
      this.tokenSelected = token;
      this.showAprTypeOverlay = true;
    },
    resetAprToggle({ reserve, value }) {
      const tableData =
        this.$refs.borrowsTable.$children[0].$options.propsData.tableData;
      tableData.forEach(item => {
        if (item.token === reserve) item.toggle.value = value;
      });
      this.tokenSelected = {};
      this.showCollateralOverlay = false;
    },
    closeAprTypeOverlay() {
      this.tokenSelected = {};
      this.showAprTypeOverlay = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.loan-value-container {
  border-radius: 5px;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.pink {
  background-color: #d989c6;
}
.lightblue {
  background-color: #6ad0d9;
}

.height-100 {
  height: 100%;
}
</style>
