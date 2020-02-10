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
        :composition="activeDepositTab ? compositionDeposit : compositionBorrow"
        :title="
          activeDepositTab
            ? $t('dappsAave.aggregated-balance')
            : $t('dappsAave.you-borrowed')
        "
      />
      <balance-display
        :loading-home="loadingHome"
        :composition="compositionDeposit"
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
    <summary-table
      :reserves="reserves"
      :user-reserves="userSummary.reservesData"
      :health-factor="userSummary.healthFactor"
      :active-deposit-tab="activeDepositTab"
    />
    <action-modal
      ref="actionModal"
      :reserves="reserves"
      :deposit-modal="activeDepositTab"
      :loading-reserves="loadingReserves"
      :reserves-stable="reservesStable"
      :avail-eth="userSummary.availableBorrowsETH"
    />
  </div>
</template>

<script>
import SummaryTable from '@/dapps/Aave/components/SummaryTable';
import BalanceDisplay from '@/dapps/Aave/components/BalanceDisplay';
import ActionModal from '@/dapps/Aave/components/ActionModal';
import BigNumber from 'bignumber.js';

export default {
  components: {
    'balance-display': BalanceDisplay,
    'action-modal': ActionModal,
    'summary-table': SummaryTable
  },
  props: {
    reservesStable: {
      type: Array,
      default: function() {
        return [];
      }
    },
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
  data() {
    return {
      compositionDeposit: [],
      compositionBorrow: []
    };
  },
  watch: {
    loadingHome(newVal) {
      if (newVal === false) {
        this.getCompositionPercentages();
      }
    }
  },
  methods: {
    getCompositionPercentages() {
      const colors = [
        '#566679',
        '#f9d6da',
        '#f5a623',
        '#6f0',
        '#dadd98',
        '#f00',
        '#5a78f0',
        '#5c74eb',
        '#3766aa',
        '#1d89ff',
        '#c9f2ed',
        '#aa0087',
        '#f37240',
        '#00b3db',
        '#a16bff',
        '#3a6ea7'
      ];
      this.userSummary.reservesData.forEach(reserve => {
        if (reserve.currentUnderlyingBalanceETH > 0) {
          const percentage = new BigNumber(reserve.currentUnderlyingBalanceETH)
            .div(this.userSummary.totalCollateralETH)
            .times(100)
            .toFixed(2);
          this.compositionDeposit.push({
            symbol: reserve.reserve.symbol,
            amount: reserve.currentUnderlyingBalanceETH,
            percentage: percentage,
            color: colors.length > 0 ? colors.shift() : '#000'
          });
        } else if (reserve.currentBorrowsETH > 0) {
          const borrowLimitEth = new BigNumber(
            this.userSummary.availableBorrowsETH
          )
            .plus(new BigNumber(this.userSummary.totalBorrowsEth))
            .toFixed();

          const percentage = new BigNumber(reserve.currentBorrowsETH)
            .div(borrowLimitEth)
            .times(100)
            .toFixed(2);

          this.compositionBorrow.push({
            symbol: reserve.reserve.symbol,
            amount: reserve.currentBorrowsETH,
            percentage: percentage,
            color: colors.length > 0 ? colors.shift() : '#000'
          });
          console.error('in here', borrowLimitEth)
        }
        console.error('jljlk', this.compositionDeposit, this.compositionBorrow)
      });
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
