<template>
  <div class="aave-container">
    <apollo-client
      :address="account.address"
      @reserveData="updateReserveData"
      @userReserveData="updateUserReserveData"
      @usdPriceEth="updateUsdPriceEth"
    />
    <div class="header-container">
      <div v-if="$route.fullPath === '/interface/dapps/aave/action'">
        <div class="action-title">
          {{ actionTitle }} {{ reservesData.length > 0 ? token.name : '' }}
        </div>
        <!-- <i18n
          v-if="activeDepositTab"
          class="action-title"
          tag="div"
          path="dappsAave.deposit-token"
        >
          <span slot="token" class="token">{{
            userReserves.length > 0 ? token.name : ''
          }}</span>
        </i18n>
        <i18n
          v-if="activeBorrowTab"
          class="action-title"
          tag="div"
          path="dappsAave.borrow-token"
        >
          <span slot="token" class="token">{{
            reservesData.length > 0 ? token.name : ''
          }}</span>
        </i18n> -->
      </div>
      <back-button
        v-if="$route.fullPath !== '/interface/dapps/aave/action'"
        :title="$t('dappsAmbrpay.exit-dapp')"
        :hide-border="true"
      />
      <div
        v-if="$route.fullPath !== '/interface/dapps/aave/action'"
        class="tab-container"
      >
        <div
          :class="['action-btn', activeDepositTab ? 'active-tab' : '']"
          @click="toggleTabs('deposit')"
        >
          {{ $tc('dappsAave.deposit', 2) }}
        </div>
        <div
          :class="[
            'action-btn',
            'borrow-btn',
            activeBorrowTab ? 'active-tab' : ''
          ]"
          @click="toggleTabs('borrow')"
        >
          {{ $t('dappsAave.borrowings') }}
        </div>
      </div>
      <div class="health-container">
        <span>{{ $t('dappsAave.health-factor') }}</span>
        <i v-show="loadingHome" class="fa fa-spinner fa-spin health-score" />
        <span v-if="!loadingHome" class="health-score">{{
          userSummary.healthFactor
        }}</span>
        <popover
          :popcontent="$t('dappsAmbrpay.ambrpay-popover')"
          class="dapp-popover"
        ></popover>
      </div>
    </div>
    <router-view
      :aggregated-eth-balance="aggregatedEthBalance"
      :active-deposit-tab="activeDepositTab"
      :active-borrow-tab="activeBorrowTab"
      :borrowed-balance="borrowedBalance"
      :collateral-balance="collateralBalance"
      :ltv="ltv"
      :loading-home="loadingHome"
      :loading-reserves="loadingReserves"
      :reserves="reservesData"
      :current-reserve-balance="currentReserveBalance"
      :health-factor="userSummary.healthFactor"
      :user-summary="userSummary"
      @emitTakeAction="emitTakeAction"
    />
  </div>
</template>

<script>
import ApolloClient from './ApolloClient.vue';
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import { mapState } from 'vuex';
import { Toast } from '@/helpers';
import { formatUserSummaryData, formatReserves } from '@aave/protocol-js';
// import apolloClient from './apolloClient';
// import { EventEmitter } from 'events';

export default {
  components: {
    'back-button': BackButton,
    'apollo-client': ApolloClient
  },
  props: {
    tokensWithBalance: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      activeDepositTab: true,
      activeBorrowTab: false,
      lendingPoolContract: {},
      healthFactor: '',
      aggregatedEthBalance: '',
      borrowedBalance: '',
      collateralBalance: '',
      ltv: '',
      loadingHome: true,
      loadingReserves: true,
      reservesAddr: [],
      reservesData: [],
      rawReserveData: [],
      userReserves: [],
      reserveAddr: 0,
      currentReserveBalance: '0',
      token: {},
      actionType: '',
      userReserveData: [],
      usdPriceEth: '',
      userSummary: {}
    };
  },
  computed: {
    ...mapState('main', ['web3', 'account']),
    actionTitle() {
      if (!this.actionType) {
        return this.activeDepositTab
          ? this.$tc('dappsAave.deposit', 1)
          : this.$t('dappsAave.borrow');
      }
      return this.actionType === 'Withdraw'
        ? this.$t('dappsAave.withdraw')
        : this.$t('dappsAave.repay');
    }
  },

  watch: {
    '$route.params.token'(newVal) {
      this.token = newVal;
      if (this.token && this.activeBorrowTab) {
        const userReserve = this.userReserves.find(reserve => {
          return reserve.address === this.token.address;
        });
        this.currentReserveBalance = userReserve.currentBorrowBalance;
      }
    },
    '$route.params.actionType'(newVal) {
      this.actionType = newVal;
    }
  },
  methods: {
    updateReserveData(data) {
      this.rawReserveData = data;
      this.reservesData = formatReserves(data);
      this.loadingReserves = false;
      this.getFormatUserSummaryData();
    },
    updateUserReserveData(data) {
      this.userReserveData = data;
      this.getFormatUserSummaryData();
      // console.error('user', data);
    },
    updateUsdPriceEth(data) {
      this.usdPriceEth = data;
      this.getFormatUserSummaryData();
      // console.error('dataaaaaaa', data);
    },
    getFormatUserSummaryData() {
      if (
        this.reservesData.length > 0 &&
        this.userReserveData.length > 0 &&
        this.usdPriceEth
      ) {
        this.userSummary = formatUserSummaryData(
          this.rawReserveData,
          this.userReserveData,
          this.account.address,
          this.usdPriceEth,
          Date.now()
        );
        console.error('user', this.userSummary)
        // remove all of this
        this.borrowedBalance = this.userSummary.totalBorrowsETH;
        this.ltv = this.userSummary.currentLiquidationThreshold;
        this.aggregatedEthBalance = this.userSummary.totalLiquidityETH;
        this.borrowedBalance = this.userSummary.totalBorrowsETH;
        this.collateralBalance = this.userSummary.totalCollateralETH;
        // remove up to here
        this.mergeTheReserves();
        this.loadingHome = false;
      }
    },
    mergeTheReserves() {
      if (this.userSummary.reservesData.length > 0) {
        this.userSummary.reservesData.forEach(reserve => {
          const foundReserve = this.reservesData.find(
            elem => elem.name === reserve.reserve.name
          );
          foundReserve.user = reserve;
        });
      }
      this.getReserveBalances();
    },
    getReserveBalances() {
      if (this.reservesData.length > 0) {
        this.reservesData.forEach(reserve => {
          const foundReserve = this.tokensWithBalance.find(
            elem => elem.symbol === reserve.symbol
          );
          if (foundReserve) {
            reserve.tokenBalance = foundReserve.balance;
          }
        });
      }
    },
    emitTakeAction(param) {
      this.activeDepositTab ? this.deposit(param) : this.borrow(param);
    },
    async deposit(param) {
      try {
        const depositInfo = await this.lendingPoolContract.methods
          .deposit(param.address, param.amount, param.referral)
          .encodeABI();

        const data = {
          from: this.account.address,
          to: this.lendingPoolContract._address,
          data: depositInfo
        };

        this.web3.eth
          .sendTransaction(data)
          .then(resp => {
            Toast.responseHandler(resp, Toast.SUCCESS);
          })
          .catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
      } catch (err) {
        Toast.responseHandler(err, Toast.ERROR);
      }
    },
    async borrow(param) {
      try {
        const borrowInfo = await this.lendingPoolContract.methods
          .borrow(param.address, param.amount, param.rate, param.referral)
          .encodeABI();

        const data = {
          from: this.account.address,
          to: this.lendingPoolContract._address,
          data: borrowInfo
        };

        this.web3.eth
          .sendTransaction(data)
          .then(resp => {
            Toast.responseHandler(resp, Toast.SUCCESS);
          })
          .catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
      } catch (err) {
        Toast.responseHandler(err, Toast.ERROR);
      }
    },
    toggleTabs(action) {
      if (
        (action === 'borrow' && this.activeBorrowTab === true) ||
        (action === 'deposit' && this.activeDepositTab === true)
      ) {
        return;
      }
      this.activeDepositTab = !this.activeDepositTab;
      this.activeBorrowTab = !this.activeBorrowTab;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Aave.scss';
</style>
