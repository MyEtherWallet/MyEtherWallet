<template>
  <div class="mew-component--aave">
    <the-wrapper-dapp
      :has-exit-btn="true"
      :banner-img="BG"
      :banner-text="topBanner"
      :tab-items="tabs"
      :active-tab="activeTab"
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
              class="primary--text font-weight-bold mr-3"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip text="Health factor" />
          </div>
          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="superPrimary pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 v-if="!isLoadingData" class="">
                  $ {{ totalLiquidity.usd }}
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
                  :balance-obj="compositionPercentage"
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
                class="
                  superPrimary
                  pa-5
                  border-radius--5px
                  height-100
                  d-flex
                  flex-column
                "
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
                :table-header="depositsTableHeader"
                :is-loading-data="isLoadingData"
                :reserves-data="reservesData"
                :user-reserves-data="userSummary.reservesData"
                :has-search="false"
                :has-toggle="false"
                @selectedDeposit="openDepositOverlayWithToken"
                @withdrawToken="openWithdrawOverlay"
                @collateralChange="openCollateralOverlay"
              />
            </v-col>
          </v-row>

          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Deposit"
              btn-size="xlarge"
              @click.native="openDepositOverlay"
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
              class="primary--text font-weight-bold mr-3"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip text="Health factor" />
          </div>

          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="progressBar pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">You Borrowed</h5>
                <h3 v-if="!isLoadingData">$ {{ totalBorrow.usd }}</h3>
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
                  :balance-obj="borrowingsPercentage"
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
              <div class="progressBar pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Your Collateral</h5>
                <h3 v-if="!isLoadingData">$ {{ totalCollateral.usd }}</h3>
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
                  :balance-obj="collateralPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  width="30px"
                  type="text"
                />
              </div>
            </v-col>

            <v-col cols="12" class="pt-md-2">
              <div class="progressBar pa-5 loan-value-container">
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
                :table-header="borrowTableHeader"
                :is-loading-data="isLoadingData"
                :reserves-data="reservesData"
                :user-reserves-data="userSummary.reservesData"
                :has-search="false"
                :has-toggle="false"
                @selectedBorrow="openBorrowOverlayWithToken"
                @repayBorrowing="openRepayOverlay"
                @changeAprType="openAprTypeOverlay"
              />
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Borrow"
              btn-size="xlarge"
              @click.native="openBorrowOverlay"
            />
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <aave-deposit-overlay
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :user-summary="userSummary"
      :open="showDepositOverlay"
      :close="closeDepositOverlay"
      :pre-selected-token="requestToken"
      :handler="handler"
      @onConfirm="callDeposit"
    />
    <aave-borrow-overlay
      :pre-selected-token="requestToken"
      :open="showBorrowOverlay"
      :close="closeBorrowOverlay"
      :is-loading-data="isLoadingData"
      :reserves-data="reservesData"
      :user-summary="userSummary"
      @onConfirm="callBorrow"
    />
    <aave-collateral-overlay
      :pre-selected-token="requestToken"
      :handler="handler"
      :open="showCollateralOverlay"
      :close="closeCollateralOverlay"
      @onConfirm="callSwitchCollateral"
    />
    <aave-withdraw-overlay
      :pre-selected-token="requestToken"
      :handler="handler"
      :open="showWithdrawOverlay"
      :close="closeWithdrawOverlay"
      @onConfirm="callWithdraw"
    />
    <aave-repay-overlay
      :pre-selected-token="requestToken"
      :handler="handler"
      :open="showRepayOverlay"
      :close="closeRepayOverlay"
      @onConfirm="callRepay"
    />
    <aave-set-apr-overlay
      :pre-selected-token="requestToken"
      :handler="handler"
      :open="showAprTypeOverlay"
      :close="closeAprTypeOverlay"
      @onConfirm="callSwitchInterest"
    />
  </div>
</template>

<script>
import TheWrapperDapp from '@/core/components/TheWrapperDapp';
import AaveBorrowOverlay from './components/AaveBorrowOverlay';
import AaveDepositOverlay from './components/AaveDepositOverlay';
import AaveCollateralOverlay from './components/AaveCollateralOverlay';
import AaveRepayOverlay from './components/AaveRepayOverlay';
import AaveWithdrawOverlay from './components/AaveWithdrawOverlay';
import AaveSetAprOverlay from './components/AaveSetAprOverlay';
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
import handlerAave from './handlers/handlerAave';
// import AaveCalls from './apollo/queries/queries';
import { mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { AAVE_TABLE_HEADER } from '@/dapps/aave-dapp/handlers/helpers';
import AaveTable from './components/AaveTable';
import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import handlerAaveApollo from './handlers/handlerAaveApollo.mixin';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
const COLORS = {
  ENJ: 'expandHeader',
  ETH: 'primary',
  ZRX: 'secondary',
  KNC: 'basic',
  USDT: 'warning base',
  MKR: 'warning darken1',
  LEND: 'warning darken2',
  AAVE: 'textSecondary',
  DAI: 'tagLabel',
  SUSD: 'inputLabel',
  LINK: 'inputBorder',
  BUSD: 'searchText',
  REN: 'primaryHover',
  WBTC: 'basicOutlineActive',
  UNI: 'errorOutline',
  REP: 'superPrimary base',
  MANA: 'superPrimary darken1',
  BAT: 'overlayBg',
  YFI: 'white',
  TUSD: 'black'
};

export default {
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
  mixins: [handlerAaveApollo],
  data() {
    return {
      handler: null,
      caller: null,
      showDepositOverlay: false,
      requestToken: {},
      showBorrowOverlay: false,
      showWithdrawOverlay: false,
      showCollateralOverlay: false,
      showRepayOverlay: false,
      showAprTypeOverlay: false,
      activeTab: 0,
      BG: BG,
      topBanner: {
        title: 'AAVE',
        subtext:
          'Aave is an Open Source Money Market Protocol, allowing you to earn daily interest on your stablecoins. Borrow against various assets and switch interest between variable and stable rates'
      },
      depositsTableHeader: AAVE_TABLE_HEADER.BALANCE_DEPOSIT,
      borrowTableHeader: AAVE_TABLE_HEADER.BALANCE_BORROW,
      tabs: [{ name: 'Deposits' }, { name: 'Borrowings' }]
    };
  },
  computed: {
    ...mapState('wallet', ['address', 'coinGeckoTokens']),
    ...mapGetters('wallet', ['tokensList', 'balanceInETH']),
    ...mapGetters('global', ['isEthNetwork']),
    ...mapGetters('external', ['fiatValue']),
    isLoadingData() {
      return Object.keys(this.userSummary).length <= 0;
    },
    loanValue() {
      return `${BigNumber(this.userSummary.currentLiquidationThreshold)
        .times(100)
        .toFixed()}%`;
    },
    healthFactor() {
      return BigNumber(this.userSummary.healthFactor).gt(0)
        ? BigNumber(this.userSummary.healthFactor).toFixed(3)
        : `-`;
    },
    totalLiquidity() {
      return {
        eth: formatFloatingPointValue(this.userSummary.totalLiquidityETH || '0')
          .value,
        usd: formatFiatValue(this.userSummary.totalLiquidityUSD || '0').value
      };
    },
    totalCollateral() {
      return {
        eth: formatFloatingPointValue(
          this.userSummary.totalCollateralETH || '0'
        ).value,
        usd: formatFiatValue(this.userSummary.totalCollateralUSD || '0').value
      };
    },
    totalBorrow() {
      return {
        eth: formatFloatingPointValue(this.userSummary.totalBorrowsETH || '0')
          .value,
        usd: formatFiatValue(this.userSummary.totalBorrowsUSD || '0').value
      };
    },
    compositionPercentage() {
      if (this.userSummary && Object.keys(this.userSummary).length > 0) {
        const total = this.userSummary.totalLiquidityETH;
        const data = this.userSummary.reservesData.map(item => {
          return {
            percentage: BigNumber(item.currentUnderlyingBalanceETH)
              .div(total)
              .times(100)
              .toFixed(),
            color: COLORS[item.reserve.symbol],
            title: item.reserve.symbol,
            tooltip: item.currentUnderlyingBalance + ' ' + item.reserve.symbol,
            amount: item.currentUnderlyingBalanceETH
          };
        });
        return {
          total: total,
          data: data
        };
      }

      return {
        total: 0,
        data: []
      };
    },
    collateralPercentage() {
      if (this.userSummary && Object.keys(this.userSummary).length > 0) {
        const total = this.userSummary.totalCollateralETH;
        const data = this.userSummary.reservesData.filter(item => {
          if (
            item.usageAsCollateralEnabledOnUser &&
            item.currentUnderlyingBalanceETH > 0
          ) {
            item['percentage'] = BigNumber(item.currentUnderlyingBalance)
              .times(100)
              .div(total)
              .toFixed();
            item['color'] = COLORS[item.reserve.symbol];
            return item;
          }
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
    },
    borrowingsPercentage() {
      if (this.userSummary && Object.keys(this.userSummary).length > 0) {
        const borrowLimit = BigNumber(this.userSummary.availableBorrowsETH)
          .plus(this.userSummary.borrowLimitBorrowsETH)
          .toFixed(4);
        const percentageLeft = BigNumber(this.userSummary.availableBorrowsETH)
          .times(100)
          .div(borrowLimit)
          .toFixed();
        const data = this.userSummary.reservesData.filter(item => {
          if (item.currentBorrowsETH > 0) {
            item['percentage'] = BigNumber(item.currentBorrowsETH)
              .times(100)
              .div(borrowLimit)
              .toFixed();
            item['color'] = COLORS[item.reserve.symbol];
            return item;
          }
        });
        if (borrowLimit > 0 && percentageLeft > 0) {
          data.push({
            symbol: 'Available',
            amount: '',
            percentage: percentageLeft,
            color: '#c7c7c7'
          });
        }
        const newObj = {
          total: borrowLimit,
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
        this.handler = new handlerAave();
      } else {
        this.handler = null;
        this.caller = null;
      }
    }
  },
  mounted() {
    this.handler = new handlerAave();
  },
  methods: {
    callDeposit(e) {
      this.handler
        .deposit(e)
        .then(() => {
          Toast('Success! Your deposit will be displayed shortly', {}, SUCCESS);
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    callSwitchCollateral(e) {
      this.handler
        .switchCollateral(e)
        .then(() => {
          Toast(
            'Success! Your collateral is being switched and will display shortly',
            {},
            SUCCESS
          );
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    callBorrow(e) {
      this.handler
        .borrow(e)
        .then(() => {
          Toast(
            'Success! Your borrowed token will be displayed shortly',
            {},
            SUCCESS
          );
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    callWithdraw(e) {
      this.handler
        .withdraw(e)
        .then(() => {
          Toast(
            'Success! Your borrowed token will be displayed shortly',
            {},
            SUCCESS
          );
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    callRepay(e) {
      this.handler
        .repay(e)
        .then(() => {
          Toast(
            'Success! Your borrowed token will be displayed shortly',
            {},
            SUCCESS
          );
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    callSwitchInterest(e) {
      this.handler
        .switchRate(e)
        .then(() => {
          Toast(
            'Success! Your borrowed token will be displayed shortly',
            {},
            SUCCESS
          );
        })
        .catch(e => {
          Toast(e.message, {}, ERROR);
        });
    },
    openDepositOverlayWithToken(token) {
      this.requestToken = token;
      this.showDepositOverlay = true;
    },
    openBorrowOverlayWithToken(token) {
      this.requestToken = token;
      this.showBorrowOverlay = true;
    },
    openDepositOverlay() {
      this.showDepositOverlay = true;
    },
    closeDepositOverlay() {
      this.requestToken = {};
      this.showDepositOverlay = false;
    },
    openBorrowOverlay() {
      this.showBorrowOverlay = true;
    },
    closeBorrowOverlay() {
      this.requestToken = {};
      this.showBorrowOverlay = false;
    },
    openWithdrawOverlay(token) {
      this.requestToken = token;
      this.showWithdrawOverlay = true;
    },
    closeWithdrawOverlay() {
      this.requestToken = {};
      this.showWithdrawOverlay = false;
    },
    openCollateralOverlay(token) {
      this.requestToken = token;
      this.showCollateralOverlay = true;
    },
    closeCollateralOverlay() {
      this.requestToken = {};
      this.showCollateralOverlay = false;
    },
    openRepayOverlay(token) {
      this.requestToken = token;
      this.showRepayOverlay = true;
    },
    closeRepayOverlay() {
      this.requestToken = {};
      this.showRepayOverlay = false;
    },
    openAprTypeOverlay(token) {
      this.requestToken = token;
      this.showAprTypeOverlay = true;
    },
    closeAprTypeOverlay() {
      this.requestToken = {};
      this.showAprTypeOverlay = false;
    }
  }
};
</script>

<style lang="scss">
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
