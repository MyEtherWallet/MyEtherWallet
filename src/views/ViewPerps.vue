<template>
  <div class="flex flex-col gap-6">
    <!-- Not authenticated -->
    <perps-main-banner v-if="!token" />

    <!-- Authenticated -->
    <template v-else>
      <div
        class="flex items-center justify-between col-span-1 lg:col-span-2 px-2"
      >
        <h1 class="text-s-24 xs:text-s-32 font-bold">{{ $t('perps.balance.title') }}</h1>
        <button
          class="text-error text-s-14 font-medium hoverOpacity"
          @click="logout"
        >
          {{ $t('perps.portfolio.sign-out') }}
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
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { PERP_INFO_ROUTE_NAME } from '@/router/routeNames'
import PerpsPortfolioSummary from '@/modules/perps/components/PerpsPortfolioSummary.vue'
import PerpsPortfolioChart from '@/modules/perps/components/PerpsPortfolioChart.vue'
import PerpsPositionsTable from '@/modules/perps/components/PerpsPositionsTable.vue'
import PerpsMarketList from '@/modules/perps/components/PerpsMarketList.vue'
import PerpsDepositDialog from '@/modules/perps/components/PerpsDepositDialog.vue'
import PerpsWithdrawDialog from '@/modules/perps/components/PerpsWithdrawDialog.vue'
import PerpsMainBanner from '@/modules/perps/components/PerpsMainBanner.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { usePerpsAuth } from '@/modules/perps/composables/usePerpsAuth'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useAccessStore } from '@/stores/accessStore'

const router = useRouter()
const walletMenu = useWalletMenuStore()
const walletStore = useWalletStore()
const { isWatchOnly, walletAddress } = storeToRefs(walletStore)
const { token, isAuthenticating, isRestoringAuth, login, logout } =
  usePerpsAuth()
const { isDesktopAndUp } = useAppBreakpoints()

// Trigger auto-login only when the connected wallet address actually changes
// (wallet switch / account swap). Watching the wallet object with `deep: true`
// re-fired on any internal provider mutation, which after a Sign Out would
// silently re-auth the user and make the page flash back to the signed-in
// view.
//
// The auth layer asynchronously tries to restore a stored, non-expired token
// for the new wallet first (`isRestoringAuth`). We must wait for that to settle
// before deciding to prompt — otherwise we'd request a signature during the
// restore window even though the new wallet already has a valid token.
let autoLoginPending = false
const maybeAutoLogin = () => {
  if (!autoLoginPending || isRestoringAuth.value) return
  autoLoginPending = false
  if (!isWatchOnly.value && !isAuthenticating.value && !token.value) {
    login()
  }
}
watch(walletAddress, (newAddr, oldAddr) => {
  if (newAddr && oldAddr && newAddr !== oldAddr && !isWatchOnly.value) {
    autoLoginPending = true
    maybeAutoLogin()
  }
})
watch(isRestoringAuth, () => maybeAutoLogin())

const connectWallet = () => useAccessStore().openAccessDialog()

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
