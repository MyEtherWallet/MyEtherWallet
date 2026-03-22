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
import { useRouter } from 'vue-router'
import { PERP_INFO_ROUTE_NAME } from '@/router/routeNames'
import PerpsPortfolioSummary from './components/PerpsPortfolioSummary.vue'
import PerpsPositionsTable from './components/PerpsPositionsTable.vue'
import PerpsMarketList from './components/PerpsMarketList.vue'
import PerpsDepositDialog from './components/PerpsDepositDialog.vue'
import PerpsWithdrawDialog from './components/PerpsWithdrawDialog.vue'

const router = useRouter()
const showDeposit = ref(false)
const showWithdraw = ref(false)

function handleOpenPosition(market: string) {
  router.push({
    name: PERP_INFO_ROUTE_NAME,
    params: { market },
  })
}
</script>
