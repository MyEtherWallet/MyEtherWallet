<template>
  <div class="flex flex-col gap-y-5">
    <!-- Not connected -->
    <connect-wallet v-if="!isWalletConnected" />

    <!-- Connected, no balances -->
    <div
      v-else-if="!hasTopData"
      class="grid grid-cols-1 md:grid-cols-[300px_1fr] lg-max:grid-cols-[360px_1fr] gap-5 items-stretch basis-full"
    >
      <app-wallet-card />
      <no-balance />
    </div>

    <!-- Mobile (< 768): single column, Wallet · History · Hero · Allocation · Overview -->
    <template v-else-if="isMobile">
      <app-wallet-card />
      <portfolio-history />
      <rwa-hero-card />
      <portfolio-allocation />
      <portfolio-overview />
    </template>

    <!-- Tablet reflow (< 1280, or sidebar open < 1440) -->
    <template v-else-if="isReflow">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
        <app-wallet-card />
        <rwa-hero-card class="h-full" />
      </div>
      <portfolio-history />
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <portfolio-allocation class="h-full" />
        <portfolio-overview />
      </div>
    </template>

    <!-- Wide (>= 1280 sidebar closed, or >= 1440) -->
    <template v-else>
      <div class="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch">
        <app-wallet-card />
        <portfolio-history class="xl:col-span-2" />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:mt-3">
        <portfolio-overview />
        <portfolio-allocation class="h-full" />
        <rwa-hero-card class="h-full" />
      </div>
    </template>

    <div v-if="isWalletConnected" class="flex flex-col lg-max:flex-row gap-5">
      <portfolio-gains-and-losses type="all" />
      <portfolio-gains-and-losses type="stock" />
    </div>

    <rwa-rewards-section v-if="isWalletConnected" />
    <rwa-reward-modal />
    <portfolio-balance />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useWindowSize } from '@vueuse/core'
import AppWalletCard from '@/components/AppWalletCard.vue'
import PortfolioOverview from '@/modules/portfolio/PortfolioOverview.vue'
import PortfolioHistory from '@/modules/portfolio/PortfolioHistory.vue'
import PortfolioAllocation from '@/modules/portfolio/PortfolioAllocation.vue'
import PortfolioGainsAndLosses from '@/modules/portfolio/PortfolioGainsAndLosses.vue'
import PortfolioBalance from '@/modules/portfolio/PortfolioBalance.vue'
import ConnectWallet from '@/modules/portfolio/components/ConnectWallet.vue'
import RwaHeroCard from '@/modules/rwa_rewards/RwaHeroCard.vue'
import RwaRewardsSection from '@/modules/rwa_rewards/RwaRewardsSection.vue'
import RwaRewardModal from '@/modules/rwa_rewards/RwaRewardModal.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import NoBalance from '@/modules/portfolio/components/NoBalance.vue'
import { storeToRefs } from 'pinia'

const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const walletStore = useWalletStore()
const { hasBalances, isLoadingBalances, isWalletConnected } =
  storeToRefs(walletStore)

const { width } = useWindowSize()

const hasTopData = computed(() => isLoadingBalances.value || hasBalances.value)
const isMobile = computed(() => width.value < 768)
const isReflow = computed(
  () =>
    !isMobile.value &&
    (width.value < 1280 || (isOpenSideMenu.value && width.value < 1440)),
)
</script>