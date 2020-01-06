<template>
  <div class="aave-container">
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
        <span v-if="!loadingHome" class="health-score">{{ healthFactor }}</span>
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
      :reserves="activeDepositTab ? userReserves : reservesData"
      :current-reserve-balance="currentReserveBalance"
      :health-factor="healthFactor"
      @emitTakeAction="emitTakeAction"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import LendingPoolAbi from './abi/LendingPoolAbi.js';
import LendingPoolAddressesProviderAbi from './abi/LendingPoolAddressesProviderAbi.js';
// import ATokenAbi from './abi/AToken.js';
import { mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import * as unit from 'ethjs-unit';
import { Toast } from '@/helpers';
export default {
  components: {
    'back-button': BackButton
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
      userReserves: [],
      reserveAddr: 0,
      currentReserveBalance: '0',
      token: {},
      actionType: ''
    };
  },
  computed: {
    ...mapState(['web3', 'account']),
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
  async mounted() {
    this.lendingPoolContractAddress =
      '0x9C6C63aA0cD4557d7aE6D9306C06C093A2e35408';
    this.lendingPoolAddressesProviderContract = new this.web3.eth.Contract(
      LendingPoolAddressesProviderAbi,
      this.lendingPoolContractAddress
    );
    this.lendingPool = await this.lendingPoolAddressesProviderContract.methods
      .getLendingPool()
      .call();
    this.lendingPoolContract = new this.web3.eth.Contract(
      LendingPoolAbi,
      this.lendingPool
    );

    this.getUserInfo();
    this.getReserves();
  },
  methods: {
    async getUserInfo() {
      try {
        const info = await this.lendingPoolContract.methods
          .getUserAccountData(this.account.address)
          .call();
        this.healthFactor = new BigNumber(
          unit.fromWei(info.healthFactor, 'ether')
        )
          .toFixed(2)
          .toString();
        this.aggregatedEthBalance = new BigNumber(
          unit.fromWei(info.totalLiquidityETH, 'ether')
        )
          .toFixed(2)
          .toString();
        this.borrowedBalance = new BigNumber(
          unit.fromWei(info.totalBorrowsETH, 'ether')
        )
          .toFixed(2)
          .toString();
        this.collateralBalance = new BigNumber(
          unit.fromWei(info.totalCollateralETH, 'ether')
        )
          .toFixed(2)
          .toString();
        this.ltv = info.ltv;
        this.loadingHome = false;
      } catch (err) {
        Toast.responseHandler(err, Toast.ERROR);
      }
    },
    async getReserves() {
      try {
        this.reservesAddr = await this.lendingPoolContract.methods
          .getReserves()
          .call();
        this.getReserveData();
        this.getUserReserveData();
      } catch (err) {
        Toast.responseHandler(err, Toast.ERROR);
      }
    },
    async getUserReserveData() {
      for (let i = 0; i < this.reservesAddr.length; i++) {
        const reserveInfo = await this.lendingPoolContract.methods
          .getUserReserveData(this.reservesAddr[i], this.account.address)
          .call()
          .catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
        reserveInfo.name = 'DAI';
        reserveInfo.address = this.reservesAddr[i];
        // change this when I get real information
        reserveInfo.isCollateral = false;
        this.userReserves.push(reserveInfo);
      }
      this.loadingReserves = false;
      return this.userReserves;
    },
    async getReserveData() {
      for (let i = 0; i < this.reservesAddr.length; i++) {
        const reserveInfo = await this.lendingPoolContract.methods
          .getReserveData(this.reservesAddr[i])
          .call()
          .catch(err => {
            Toast.responseHandler(err, Toast.ERROR);
          });
        reserveInfo.name = 'ETH';
        reserveInfo.address = this.reservesAddr[i];
        reserveInfo.isStable = true;
        this.reservesData.push(reserveInfo);
      }
      // change this when I get real information
      // console.error('this', this.reservesData);
      this.loadingReserves = false;
      // console.error('hello')
      // console.error('hellooooo', this.reservesData[0])
      // this.aTokenContract = new this.web3.eth.Contract(
      //   ATokenAbi,
      //   this.reservesData[0]
      // );

      // const info = await this.aTokenContract.methods.name().call();
      // console.error('info', this.aTokenContract)
      return this.reservesData;
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
=            Toast.responseHandler(err, Toast.ERROR);
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
