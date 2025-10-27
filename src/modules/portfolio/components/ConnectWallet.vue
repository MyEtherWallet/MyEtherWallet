<template>
  <app-sheet
    sheet-class="no-balance-gradient  bg-no-repeat bg-cover !p-0 flex items-end justify-center relative overflow-hidden"
  >
    <img
      :src="ImgEthLeft"
      class="contain max-w-[20%] place-self-start"
      width=""
    />

    <div
      class="flex flex-col items-stretch justify-center gap-4 lg:gap-6 text-center py-10 px-3 lg:px-5"
    >
      <div>
        <p class="text-s-24 lg:text-s-40 font-bold mb-2">
          Connect wallet to see your portfolio
        </p>

        <p class="text-s-14 lg:text-s-16 text-info">
          Unlock your wallet to see full features. Manage your crypto assets
          across multiple blockchains: trade stock, swap, stake, and more.
        </p>
      </div>
      <div
        class="flex flex-col items-center justify-center gap-3 lg:gap-4 mt-3"
      >
        <app-base-button
          class="min-w-[190px]"
          :size="isDesktopAndUp ? 'large' : 'medium'"
        >
          Connect Wallet
        </app-base-button>
        <p>
          or <app-btn-text class="underline">Create a new wallet</app-btn-text>
        </p>
      </div>
    </div>
    <img :src="ImgEthRight" class="contain max-w-[20%]" />
  </app-sheet>
</template>
<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnText from '@/components/AppBtnText.vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import ImgEthLeft from '@/assets/images/backgrounds/eth-left.webp'
import ImgEthRight from '@/assets/images/backgrounds/eth-right.webp'
const { isDesktopAndUp } = useAppBreakpoints()
</script>
<style scoped>
.no-balance-gradient {
  background:
    radial-gradient(
      circle 500px at 50% 100%,
      rgba(255, 255, 255, 0.5) 60%,
      transparent 100%
    ),
    linear-gradient(to bottom, transparent, rgba(255, 255, 255, 1) 190px),
    linear-gradient(
      to right,
      rgba(90, 197, 210, 1) 0%,
      rgba(149, 206, 253, 1) 50%,
      rgba(126, 138, 250, 1) 100%
    );
}
</style>
