<template>
  <div class="flex flex-col">
    <div
      :class="[
        isOpenSideMenu
          ? 'lg-max:grid-cols-[300px_1fr] 2xl:grid-cols-[300px_1fr_1fr]'
          : 'lg-max:grid-cols-[300px_1fr_1fr]',
        'grid grid-cols-12 gap-4 items-stretch',
      ]"
    >
      <app-wallet-card class="col-span-12 sm:col-span-5 lg-max:col-span-1" />
      <portfolio-allocation
        class="lg-max:order-2 col-span-12 sm:col-span-7 lg-max:col-span-1"
      />
      <portfolio-history
        :class="[
          isOpenSideMenu
            ? 'lg-max:col-span-2 2xl:col-span-1'
            : 'lg-max:col-span-1',
          'lg-max:order-2 col-span-12 ',
        ]"
      />
    </div>
    <div class="flex flex-col lg-max:flex-row gap-4 mt-7">
      <portofolio-gains-and-losses type="all" />
      <portofolio-gains-and-losses type="stock" />
    </div>
    <portfolio-balance />
    <router-view />
  </div>
</template>
<script setup lang="ts">
import AppWalletCard from '@/components/AppWalletCard.vue'
import PortfolioHistory from '@/modules/portfolio/PortfolioHistory.vue'
import PortfolioAllocation from '@/modules/portfolio/PortfolioAllocation.vue'
import PortofolioGainsAndLosses from '@/modules/portfolio/PortofolioGainsAndLosses.vue'
import PortfolioBalance from '@/modules/portfolio/PortfolioBalance.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
const walletMenuStore = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenuStore)
</script>
