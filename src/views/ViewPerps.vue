<template>
  <div class="flex flex-col gap-6">
    <!-- Not authenticated -->
    <div
      v-if="!isWalletConnected || isWatchOnly"
      class="text-center py-8 bg-white"
    >
      <p class="text-info text-s-14 mb-4">
        Connect your wallet to view your perps portfolio
      </p>
      <button
        class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
        @click="connectWallet"
      >
        Connect Wallet
      </button>
    </div>
    <div v-else-if="!token" class="text-center py-8">
      <p class="text-info text-s-14 mb-4">
        Sign in to view your perps portfolio
      </p>
      <button
        :disabled="isAuthenticating"
        class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
        @click="login"
      >
        {{ isAuthenticating ? 'Signing in...' : 'Sign in to Perps' }}
      </button>
      <p v-if="authError" class="text-error text-s-12 mt-2">
        {{ authError }}
      </p>
    </div>

    <!-- Authenticated -->
    <template v-else>
      <div
        class="flex items-center justify-between col-span-1 lg:col-span-2 px-2"
      >
        <h1 class="text-s-24 xs:text-s-32 font-bold">
          Perpetuals Portfolio
        </h1>
        <button
          class="text-error text-s-14 font-medium hoverOpacity"
          @click="logout"
        >
          Sign Out
        </button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 -mt-2">
        <perps-portfolio-summary
          @deposit="showDeposit = true"
          @withdraw="showWithdraw = true"
        />
        <perps-portfolio-chart />
      </div>

      <perps-positions-table @open-position="handleOpenPosition" />
    </template>
    <perps-market-list @open-position="handleOpenPosition" />
    <perps-deposit-dialog v-model="showDeposit" />
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
import { storeToRefs } from 'pinia'
import { PERP_INFO_ROUTE_NAME } from '@/router/routeNames'
import PerpsPortfolioSummary from '@/modules/perps/components/PerpsPortfolioSummary.vue'
import PerpsPortfolioChart from '@/modules/perps/components/PerpsPortfolioChart.vue'
import PerpsPositionsTable from '@/modules/perps/components/PerpsPositionsTable.vue'
import PerpsMarketList from '@/modules/perps/components/PerpsMarketList.vue'
import PerpsDepositDialog from '@/modules/perps/components/PerpsDepositDialog.vue'
import PerpsWithdrawDialog from '@/modules/perps/components/PerpsWithdrawDialog.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useAccessStore } from '@/stores/accessStore'
import { usePerpsAuth } from '@/modules/perps/composables/usePerpsAuth'

const router = useRouter()
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const { isWatchOnly } = storeToRefs(walletStore)
const accessStore = useAccessStore()
const { token, isWalletConnected, isAuthenticating, authError, login, logout } =
  usePerpsAuth()
const connectWallet = () => accessStore.openAccessDialog()
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
