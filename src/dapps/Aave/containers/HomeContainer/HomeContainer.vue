<template>
  <div class="aave-wrapper">
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
        :balance="0"
        :composition-percentage="100"
        :title="
          activeDepositTab
            ? $t('dappsAave.aggregated-balance')
            : $t('dappsAave.you-borrowed')
        "
      />
      <balance-display
        :balance="0"
        :composition-percentage="100"
        :earnings-balance="0"
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
import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay';
import ActionModal from '@/dapps/Aave/components/ActionModal';
import LendingPoolAbi from '@/dapps/Aave/abi/LendingPoolAbi.js';
import ActionContainer from '@/dapps/Aave/containers/ActionContainer';

export default {
  components: {
    'balance-display': BalanceDisplay,
    'lending-pool-abi': LendingPoolAbi,
    'action-modal': ActionModal,
    'action-container': ActionContainer
  },
  props: {
    activeBorrowTab: {
      type: Boolean,
      default: false
    },
    activeDepositTab: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    openActionModal() {
      this.$refs.actionModal.$refs.actionModal.show();
    }
  }
};
</script>

<style lang="scss" scoped>
@import 'HomeContainer.scss';
</style>
