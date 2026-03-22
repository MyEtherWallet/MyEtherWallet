<template>
  <div class="flex flex-col gap-6">
    <perps-portfolio-summary
      @deposit="showDeposit = true"
      @withdraw="showWithdraw = true"
    />
    <perps-positions-table @open-position="handleOpenPosition" />
    <perps-market-list @open-position="handleOpenPosition" />
    <perps-deposit-dialog :visible="showDeposit" @close="showDeposit = false" />
    <perps-withdraw-dialog
      :visible="showWithdraw"
      @close="showWithdraw = false"
    />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PerpsPortfolioSummary from './components/PerpsPortfolioSummary.vue'
import PerpsPositionsTable from './components/PerpsPositionsTable.vue'
import PerpsMarketList from './components/PerpsMarketList.vue'
import PerpsDepositDialog from './components/PerpsDepositDialog.vue'
import PerpsWithdrawDialog from './components/PerpsWithdrawDialog.vue'

const showDeposit = ref(false)
const showWithdraw = ref(false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleOpenPosition(_market: string) {
  // TODO: open position flow for the selected market
}
</script>
