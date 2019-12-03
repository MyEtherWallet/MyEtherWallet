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
        <span class="health-score">2.4725</span>
        <popover
          :popcontent="$t('dappsAmbrpay.ambrpay-popover')"
          class="dapp-popover"
        ></popover>
      </div>
    </div>
    <router-view
      :active-deposit-tab="activeDepositTab"
      :active-borrow-tab="activeBorrowTab"
    />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import LendingPoolAbi from './abi/LendingPoolAbi.js';
import LendingPoolAddressesProviderAbi from './abi/LendingPoolAddressesProviderAbi.js';
import { mapState } from 'vuex';

export default {
  components: {
    'back-button': BackButton
  },
  data() {
    return {
      activeDepositTab: true,
      activeBorrowTab: false
    };
  },
  computed: {
    ...mapState(['web3']),

  },
  mounted() {
    this.lendingPoolContractAddress = '0x9C6C63aA0cD4557d7aE6D9306C06C093A2e35408';
    this.lendingPoolAddressesProviderContract = new this.web3.eth.Contract(
      LendingPoolAddressesProviderAbi,
      this.lendingPoolContractAddress
    );

    this.lendingPool = this.lendingPoolAddressesProviderContract.methods.getLendingPool();
    this.lendingPoolContract = new this.web3.eth.Contract(
      LendingPoolAbi,
      this.lendingPool
    );
    console.error('lendingPoolAddressesProviderContract', this.lendingPoolContract)
  },
  methods: {
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
