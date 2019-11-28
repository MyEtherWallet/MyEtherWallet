<template>
  <div class="aave-container">
    <div class="header-container">
      <back-button :title="$t('dappsAmbrpay.exit-dapp')" :hide-border="true" />
      <div class="tab-container">
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
    <div class="about-aave-container">
      <div class="row">
        <img src="@/assets/images/icons/dapps/aave_logo.svg" alt="Aave Logo" />
        <button @click="openActionModal">
          {{
            activeDepositTab
              ? $tc('dappsAave.deposit', 1)
              : $t('dappsAave.borrow')
          }}
        </button>
      </div>
      <p>{{ $t('dappsAave.about-aave') }}</p>
    </div>
    <div class="balance-row">
      <balance-display
        :title="
          activeDepositTab
            ? $t('dappsAave.aggregated-balance')
            : $t('dappsAave.you-borrowed')
        "
      />
      <balance-display
        :title="
          activeDepositTab
            ? $t('dappsAave.earnings')
            : $t('dappsAave.your-collateral')
        "
        class="ml-3"
      />
    </div>
    <div v-if="activeBorrowTab" class="loan-container">
      <span class="loan-value">{{ $t('dappsAave.loan-value') }}</span>
      <!-- placeholder -->
      <span class="loan-percent">65.04%</span>
    </div>
    <action-modal ref="actionModal" :deposit-modal="activeDepositTab" />
  </div>
</template>

<script>
import BackButton from '@/layouts/InterfaceLayout/components/BackButton';
import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay';
import ActionModal from '@/dapps/Aave/components/ActionModal';
import LendingPoolAbi from '@/dapps/Aave/abi/LendingPoolAbi.js';
import ActionContainer from '@/dapps/Aave/containers/ActionContainer'

export default {
  components: {
    'back-button': BackButton,
    'balance-display': BalanceDisplay,
    'lending-pool-abi': LendingPoolAbi,
    'action-modal': ActionModal,
    'action-container': ActionContainer
  },
  data() {
    return {
      activeDepositTab: true,
      activeBorrowTab: false
    };
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
    },
    openActionModal() {
      this.$refs.actionModal.$refs.actionModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeContainer.scss';
</style>
