<template>
  <div class="flex flex-col gap-6">
    <div v-if="!isSupportedNetwork" class="text-center py-8 bg-white">
      <p class="text-info text-s-14 mb-4">
        Perps is only available on Ethereum
      </p>
      <select-chain-for-app :passed-chains="ethOnlyChains">
        <template #network-button="{ openNetworkDialog }">
          <button
            class="bg-black text-white rounded-full px-6 py-2.5 text-s-14 font-medium hoverOpacity"
            @click="openNetworkDialog(true)"
          >
            Switch to Ethereum
          </button>
        </template>
      </select-chain-for-app>
    </div>
    <!-- Not authenticated -->
    <perps-main-banner v-if="!token" />

    <!-- Authenticated -->
    <template v-else>
      <div
        class="flex items-center justify-between col-span-1 lg:col-span-2 px-2"
      >
        <h1 class="text-s-24 xs:text-s-32 font-bold">Perpetuals Portfolio</h1>
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
          @access="connectWallet"
          :watch-only="isWatchOnly"
        />
        <perps-portfolio-chart />
      </div>

      <perps-positions-table
        @open-position="handleOpenPosition"
        @open-side-menu="handleOpenSideWithType"
        @view-market="handleViewMarket"
      />
    </template>
    <perps-market-list
      @open-position="handleOpenPosition"
      @view-market="handleViewMarket"
      @open-side-menu="handleOpenSideWithType"
    />
    <perps-deposit-dialog v-model="showDeposit" />
    <perps-withdraw-dialog
      :visible="showWithdraw"
      @close="showWithdraw = false"
    />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { PERP_INFO_ROUTE_NAME } from '@/router/routeNames'
import PerpsPortfolioSummary from '@/modules/perps/components/PerpsPortfolioSummary.vue'
import PerpsPortfolioChart from '@/modules/perps/components/PerpsPortfolioChart.vue'
import PerpsPositionsTable from '@/modules/perps/components/PerpsPositionsTable.vue'
import PerpsMarketList from '@/modules/perps/components/PerpsMarketList.vue'
import PerpsDepositDialog from '@/modules/perps/components/PerpsDepositDialog.vue'
import PerpsWithdrawDialog from '@/modules/perps/components/PerpsWithdrawDialog.vue'
import SelectChainForApp from '@/components/select_chain/SelectChainForApp.vue'
import PerpsMainBanner from '@/modules/perps/components/PerpsMainBanner.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { usePerpsAuth } from '@/modules/perps/composables/usePerpsAuth'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useGlobalStore } from '@/stores/globalStore'
import { useAccessStore } from '@/stores/accessStore'
import { useEthOnlyChains } from '@/composables/useEthOnlyChains'

const router = useRouter()
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const { isWatchOnly, wallet } = storeToRefs(walletStore)
const { token, isAuthenticating, login, logout } = usePerpsAuth()
const { isDesktopAndUp } = useAppBreakpoints()
const { ethOnlyChains } = useEthOnlyChains()

watch(
  () => wallet.value,
  (newVal, oldVal) => {
    if (
      newVal &&
      oldVal &&
      !isWatchOnly.value &&
      !isAuthenticating.value &&
      !token.value
    ) {
      login()
    }
  },
  {
    deep: true,
  },
)

const connectWallet = () => useAccessStore().openAccessDialog()

const globalStore = useGlobalStore()
const { selectedNetwork } = storeToRefs(globalStore)

const isSupportedNetwork = computed(() => selectedNetwork.value === 'ETHEREUM')
const showDeposit = ref(false)
const showWithdraw = ref(false)

function handleOpenSideWithType(
  market: string,
  type: 'add' | 'close' | undefined,
) {
  walletMenu.setWalletPanel('perps')
  walletMenu.setIsOpenSideMenu(true)
  walletMenu.setSelectedTradeTokenSymbol(market)
  walletMenu.setSelectedTradeManageMode(type ?? 'add')
}

function handleOpenPosition(market: string, side?: 'buy' | 'sell') {
  walletMenu.setWalletPanel('perps')
  walletMenu.setIsOpenSideMenu(true)
  walletMenu.setSelectedTradeTokenSymbol(market)
  walletMenu.setSelectedTradeOrderSide(side ?? null)

  // Mobile/tablet: drawer covers the chart, so skip the route push to avoid
  // landing the user on the chart page when they close the drawer.
  if (isDesktopAndUp.value) {
    router.push({
      name: PERP_INFO_ROUTE_NAME,
      params: { market },
    })
  }
}
function handleViewMarket(market: string) {
  router.push({
    name: PERP_INFO_ROUTE_NAME,
    params: { market },
  })
}
</script>
