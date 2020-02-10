<template>
  <div class="aave-container">
    <apollo-client
      ref="apolloClient"
      :address="account.address"
      @reserveData="updateReserveData"
      @userReserveData="updateUserReserveData"
      @usdPriceEth="updateUsdPriceEth"
    />
    <div class="header-container">
      <div v-if="$route.fullPath === '/interface/dapps/aave/action'">
        <div class="action-title">
          {{ actionTitle }} {{ reservesData.length > 0 ? token.symbol : '' }}
        </div>
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
      :active-deposit-tab="activeDepositTab"
      :active-borrow-tab="activeBorrowTab"
      :loading-home="loadingHome"
      :loading-reserves="loadingReserves"
      :reserves="reservesData"
      :reserves-stable="reservesStable"
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
import {
  formatUserSummaryData,
  formatReserves,
  calculateHealthFactorFromBalances
} from '@aave/protocol-js';

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
      loadingHome: true,
      loadingReserves: true,
      reservesData: [],
      rawReserveData: [],
      reservesStable: [],
      actionType: '',
      userReserveData: [],
      token: {},
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
    },
    updateUsdPriceEth(data) {
      this.usdPriceEth = data;
      this.getFormatUserSummaryData();
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
          this.account.address.toLowerCase(),
          this.usdPriceEth,
          Date.now()
        );
        // this.userSummary.calculateHealthFactorFromBalances()
        console.error('user', this.userSummary);
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
      const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
      if (this.reservesData.length > 0) {
        this.reservesData.forEach(reserve => {
          reserve.tokenBalance = 0;
          reserve.user = !reserve.user ? {} : reserve.user;

          const foundReserve = this.tokensWithBalance.find(
            elem => elem.symbol === reserve.symbol
          );
          if (foundReserve) {
            reserve.tokenBalance = foundReserve.balance;
          }

          if (stableCoins.findIndex(coin => coin === reserve.symbol) >= 0) {
            this.reservesStable.push(reserve);
          }
        });
      }
    },
    emitTakeAction(param) {
      this.activeDepositTab ? this.deposit(param) : this.borrow(param);
    },
    async deposit(param) {
      this.$refs.apolloClient.deposit(param);
      console.error("param", param)
      // try {
      //   const depositInfo = await this.lendingPoolContract.methods
      //     .deposit(param.address, param.amount, param.referral)
      //     .encodeABI();

      //   const data = {
      //     from: this.account.address,
      //     to: this.lendingPoolContract._address,
      //     data: depositInfo
      //   };

      //   this.web3.eth
      //     .sendTransaction(data)
      //     .then(resp => {
      //       Toast.responseHandler(resp, Toast.SUCCESS);
      //     })
      //     .catch(err => {
      //       Toast.responseHandler(err, Toast.ERROR);
      //     });
      // } catch (err) {
      //   Toast.responseHandler(err, Toast.ERROR);
      // }
    },
    async borrow(param) {
      console.error('param', param)
      this.$refs.apolloClient.borrow(param);
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
