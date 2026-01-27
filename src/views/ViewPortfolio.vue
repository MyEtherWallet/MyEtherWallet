<template>
  <div class="flex flex-col">
    <div
      v-if="isWalletConnected"
      :class="[
        isOpenSideMenu
          ? 'lg-max:grid-cols-[300px_1fr] 2xl:grid-cols-[360px_1fr_1fr]'
          : 'lg-max:grid-cols-[300px_1fr_1fr] 2xl:grid-cols-[360px_1fr_1fr]',
        'grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch basis-full',
      ]"
    >
      <app-wallet-card class="h-full" />

      <portfolio-allocation
        v-if="isLoadingBalances || hasBalances"
        class="lg-max:order-2 h-full"
      />
      <portfolio-history
        v-if="isLoadingBalances || hasBalances"
        :class="[
          isOpenSideMenu
            ? '2xl:col-span-1 lg-max:col-span-2'
            : 'lg-max:col-span-1',
          'col-span-1 md:col-span-2  lg-max:order-2 h-full',
        ]"
      />
      <no-balance
        v-if="!isLoadingBalances && !hasBalances"
        :class="[
          isOpenSideMenu ? 'lg-max:col-span-1' : 'lg-max:col-span-2',
          ' md:col-span-1  2xl:col-span-2 ',
        ]"
      />
    </div>
    <div
      v-if="isWalletConnected"
      class="flex flex-col lg-max:flex-row gap-4 mt-7"
    >
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
import PortfolioHistory from '@/modules/portfolio/PortfolioHistory.vue'
import PortfolioAllocation from '@/modules/portfolio/PortfolioAllocation.vue'
import PortfolioGainsAndLosses from '@/modules/portfolio/PortfolioGainsAndLosses.vue'
import PortfolioBalance from '@/modules/portfolio/PortfolioBalance.vue'
import ConnectWallet from '@/modules/portfolio/components/ConnectWallet.vue'
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
