<template>
  <div class="aave-container container">
    <div class="header-container">
      <back-button :title="$t('dappsAmbrpay.exit-dapp')" :hide-border="true" />
      <div class="tab-container">
        <div
          :class="['action-btn', depositActiveTab ? 'active-tab' : '']"
          @click="toggleTabs('deposit')"
        >
          {{ $tc('dappsAave.deposit', 2) }}
        </div>
        <div
          :class="[
            'action-btn',
            'borrow-btn',
            borrowActiveTab ? 'active-tab' : ''
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
    <div class="about-aave-container">
      <div class="row">
        <img src="@/assets/images/icons/dapps/aave_logo.svg" alt="Aave Logo" />
        <button>{{ depositActiveTab ? $tc('dappsAave.deposit', 1) : $t('dappsAave.borrow') }}</button>
      </div>
      <p>{{ $t('dappsAave.about-aave') }}</p>
    </div>
    <div class="balance-row">
      <balance-display :title="depositActiveTab ? $t('dappsAave.aggregated-balance') : $t('dappsAave.you-borrowed')"/>
      <balance-display class="ml-3" :title="depositActiveTab ? $t('dappsAave.earnings') : $t('dappsAave.your-collateral')"/>
    </div>
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay';

export default {
  components: {
    'back-button': BackButton,
    'balance-display': BalanceDisplay
  },
  data() {
    return {
      depositActiveTab: true,
      borrowActiveTab: false
    };
  },
  methods: {
    toggleTabs(action) {
      if (
        (action === 'borrow' && this.borrowActiveTab === true) ||
        (action === 'deposit' && this.depositActiveTab === true)
      ) {
        return;
      }
      this.depositActiveTab = !this.depositActiveTab;
      this.borrowActiveTab = !this.borrowActiveTab;
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'Aave.scss';
</style>
