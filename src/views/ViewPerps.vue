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
import PerpsPortfolioSummary from '@/modules/perps/components/PerpsPortfolioSummary.vue'
import PerpsPositionsTable from '@/modules/perps/components/PerpsPositionsTable.vue'
import PerpsMarketList from '@/modules/perps/components/PerpsMarketList.vue'
import PerpsDepositDialog from '@/modules/perps/components/PerpsDepositDialog.vue'
import PerpsWithdrawDialog from '@/modules/perps/components/PerpsWithdrawDialog.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'

const router = useRouter()
const walletMenu = useWalletMenuStore()
const showDeposit = ref(false)
const showWithdraw = ref(false)

function handleOpenPosition(market: string, side?: 'buy' | 'sell') {
  walletMenu.setWalletPanel('perps')
  walletMenu.setIsOpenSideMenu(true)
  walletMenu.setSelectedTradeTokenSymbol(market)
  walletMenu.setSelectedTradeOrderSide(side ?? null)

  router.push({
    name: PERP_INFO_ROUTE_NAME,
    params: { market },
  })
}
</script>
