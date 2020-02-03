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
        :loading-home="loadingHome"
        :balance-eth="
          activeDepositTab
            ? userSummary.totalLiquidityETH
            : userSummary.totalBorrowsETH
        "
        :balance-usd="
          activeDepositTab
            ? userSummary.totalLiquidityUSD
            : userSummary.totalBorrowsUSD
        "
        :composition-percentage="100"
        :title="
          activeDepositTab
            ? $t('dappsAave.aggregated-balance')
            : $t('dappsAave.you-borrowed')
        "
      />
      <balance-display
        :loading-home="loadingHome"
        :composition-percentage="100"
        :balance-eth="activeDepositTab ? '0' : userSummary.totalCollateralETH"
        :balance-usd="activeDepositTab ? '0' : userSummary.totalCollateralUSD"
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
      <i v-show="loadingHome" class="fa fa-spinner fa-spin" />
      <span v-if="!loadingHome" class="loan-percent"
        >{{ userSummary.currentLiquidationThreshold }}%</span
      >
    </div>
    <!-- have to change the value once we get real data -->
    <summary-table
      :user-reserves="userSummary.reservesData"
      :health-factor="userSummary.healthFactor"
      :active-deposit-tab="activeDepositTab"
    />
    <action-modal
      ref="actionModal"
      :reserves="reserves"
      :deposit-modal="activeDepositTab"
      :loading-reserves="loadingReserves"
    />
  </div>
</template>

<script>
import SummaryTable from '@/dapps/Aave/components/SummaryTable';
import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay';
import ActionModal from '@/dapps/Aave/components/ActionModal';
// import LendingPoolAbi from '@/dapps/Aave/abi/LendingPoolAbi.js';
// import ActionContainer from '@/dapps/Aave/containers/ActionContainer';

export default {
  components: {
    'balance-display': BalanceDisplay,
    // 'lending-pool-abi': LendingPoolAbi,
    'action-modal': ActionModal,
    // 'action-container': ActionContainer,
    'summary-table': SummaryTable
  },
  props: {
    userSummary: {
      type: Object,
      default: () => {
        return {};
      }
    },
    activeBorrowTab: {
      type: Boolean,
      default: false
    },
    activeDepositTab: {
      type: Boolean,
      default: true
    },
    loadingHome: {
      type: Boolean,
      default: true
    },
    loadingReserves: {
      type: Boolean,
      default: true
    },
    reserves: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  mounted() {
    console.error('hello', this.userSummary)
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
