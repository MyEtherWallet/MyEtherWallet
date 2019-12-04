<template>
  <div class="aave-container">
    <div class="header-container">
      <div v-if="$route.fullPath === '/interface/dapps/aave/action'">
        <i18n
          v-if="activeDepositTab"
          class="action-title"
          tag="div"
          path="dappsAave.deposit-token"
        >
          <span slot="token" class="token">{{ $t('dappsAave.dai') }}</span>
        </i18n>
        <i18n
          v-if="activeBorrowTab"
          class="action-title"
          tag="div"
          path="dappsAave.borrow-token"
        >
          <span slot="token" class="token">{{ $t('dappsAave.dai') }}</span>
        </i18n>
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
        <!-- placeholder -->
        <span class="health-score">{{ healthFactor }}</span>
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
      :loading="loading"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import LendingPoolAbi from './abi/LendingPoolAbi.js';
import LendingPoolAddressesProviderAbi from './abi/LendingPoolAddressesProviderAbi.js';
import { post, get } from '@/helpers/httpRequests';
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
      healthFactor: 0,
      aggregatedEthBalance: '',
      borrowedBalance: '',
      collateralBalance: '',
      ltv: '',
      loading: true,
      reservesAddr: [],
      reserves: []
    };
  },
  computed: {
    ...mapState(['web3', 'account']),

  },
  async mounted() {
    this.lendingPoolContractAddress = '0x9C6C63aA0cD4557d7aE6D9306C06C093A2e35408';
    this.lendingPoolAddressesProviderContract = new this.web3.eth.Contract(
      LendingPoolAddressesProviderAbi,
      this.lendingPoolContractAddress
    );
    this.lendingPool = await this.lendingPoolAddressesProviderContract.methods.getLendingPool().call();
    this.lendingPoolContract = new this.web3.eth.Contract(
      LendingPoolAbi,
      this.lendingPool
    );
    console.error('lendingPool', this.lendingPool)
    this.getUserInfo();
    this.getReserves();
  },
  methods: {
    async getUserInfo() {
      try {
        let info = await this.lendingPoolContract.methods
          .getUserAccountData(this.account.address)
          .call();
        this.healthFactor = new BigNumber(unit.fromWei(info.healthFactor, 'ether')).toFixed(2);
        this.aggregatedEthBalance = new BigNumber(unit.fromWei(info.totalLiquidityETH, 'ether')).toFixed(2).toString();
        this.borrowedBalance = new BigNumber(unit.fromWei(info.totalBorrowsETH, 'ether')).toFixed(2).toString();
        this.collateralBalance = new BigNumber(unit.fromWei(info.totalCollateralETH, 'ether')).toFixed(2).toString();
        this.ltv = info.ltv;
        this.loading = false;
      } catch(err) {
        Toast.responseHandler(err, Toast.ERROR);
      }
    },
    async getReserves() {
      try {
        this.reservesAddr = await this.lendingPoolContract.methods
          .getReserves()
          .call();
        
        this.getReserveData();
      } catch(err) {
        Toast.responseHandler(err, Toast.ERROR);
      }
    },
    async getReserveData() {
      try {
        this.reserves = await this.lendingPoolContract.methods
          .getReserveData(this.reservesAddr[0])
          .call();

        console.error('this', this.reserves)
      } catch(err) {
        console.error('err', err)
      }
    },
    // getUserInfo() {
    //   get('https://dlp-api-dev.testing.aave.com/data/user/' + this.account.address)
    //     .then(function(resp){
    //       console.error('resp', resp)
    //     })
    //     .catch(function(err){
    //       console.error('eerr', err)
    //     })
    // },
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
