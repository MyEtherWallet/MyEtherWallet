<template>
  <div class="flex flex-col gap-y-5">
    <div
      v-if="isWalletConnected"
      :class="[
        'grid grid-cols-1 md:grid-cols-[300px_1fr] lg-max:grid-cols-[360px_1fr] gap-5 items-stretch basis-full',
      ]"
    >
      <app-wallet-card />
      <portfolio-history v-if="isLoadingBalances || hasBalances" />

      <no-balance v-else />
    </div>
    <div
      :class="[
        isOpenSideMenu ? 'xl:grid-cols-2' : 'xl:grid-cols-3',
        'grid grid-cols-1 lg-max:grid-cols-3  2xl:grid-cols-3 gap-5 lg:mt-3',
      ]"
      v-if="isWalletConnected && (isLoadingBalances || hasBalances)"
    >
      <portfolio-overview />

      <portfolio-allocation class="h-full" />
      <!-- <rewards-portfolio
        class="h-full"
        :class="[
          { 'xl:col-span-2 2xl:col-span-1': isOpenSideMenu },
          'col-span-1',
        ]"
      /> -->
      <rewards-new-campaign-countdown
        class="h-full"
        :class="[
          { 'xl:col-span-2 2xl:col-span-1': isOpenSideMenu },
          'col-span-1',
        ]"
      />
    </div>

    <div v-if="isWalletConnected" class="flex flex-col lg-max:flex-row gap-5">
      <portfolio-gains-and-losses type="all" />
      <portfolio-gains-and-losses type="stock" />
    </div>
    <div v-else>
      <connect-wallet />
    </div>
    <portfolio-balance />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import AppWalletCard from '@/components/AppWalletCard.vue'
import PortfolioOverview from '@/modules/portfolio/PortfolioOverview.vue'
import PortfolioHistory from '@/modules/portfolio/PortfolioHistory.vue'
import PortfolioAllocation from '@/modules/portfolio/PortfolioAllocation.vue'
import PortfolioGainsAndLosses from '@/modules/portfolio/PortfolioGainsAndLosses.vue'
import PortfolioBalance from '@/modules/portfolio/PortfolioBalance.vue'
import ConnectWallet from '@/modules/portfolio/components/ConnectWallet.vue'
// import RewardsPortfolio from '@/modules/rewards/RewardsPortfolio.vue'
import RewardsNewCampaignCountdown from '@/modules/rewards/RewardsNewCampaignCountdown.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import NoBalance from '@/modules/portfolio/components/NoBalance.vue'
import { storeToRefs } from 'pinia'

const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
const walletStore = useWalletStore()
const { hasBalances, isLoadingBalances, isWalletConnected } =
  storeToRefs(walletStore)
</script>
