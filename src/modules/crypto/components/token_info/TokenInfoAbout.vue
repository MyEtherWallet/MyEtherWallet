<template>
  <!-- Description -->
  <div
    v-if="isLoading || description"
    :class="[isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10', 'px-4 py-6']"
  >
    <h2
      class="basis-full xs:basis-auto font-bold text-s-20 xs:text-s-24 leading-p-150 mb-4 flex items-center"
    >
      {{ $t('crypto.about') }}
      <app-token-symbol
        v-if="symbol"
        :symbol="symbol"
        class="!font-bold !text-s-20 xs:!text-s-24 leading-p-150 ml-1"
      />
    </h2>
    <div v-if="isLoading" class="pt-1">
      <div class="h-4 mb-2 animate-pulse bg-surface rounded-6 w-full"></div>
      <div class="h-4 mb-2 animate-pulse bg-surface rounded-6 w-full"></div>
      <div class="h-4 animate-pulse bg-surface rounded-6 w-2/3"></div>
    </div>
    <p v-else class="text-s-14 text-info leading-p-150 whitespace-pre-line">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'

interface Props {
  description?: string | null
  symbol?: string
  isLoading?: boolean
}
defineProps<Props>()

const walletMenu = useWalletMenuStore()
const { isOpenSideMenu } = storeToRefs(walletMenu)
</script>
