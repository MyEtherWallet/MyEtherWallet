<template>
  <app-sheet
    sheet-class="no-balance-gradient  bg-no-repeat bg-cover !px-4 !md:px-0 2xl:!p-0 "
  >
    <div
      class="flex place-content-center h-full items-center justify-center 2xl:justify-between"
    >
      <img
        :src="ImgEthLeft"
        class="hidden 2xl:flex contain max-w-[15%] max-h-[200px]"
        width=""
      />

      <div
        class="flex flex-col place-content-center justify-center gap-3 lg:gap-4 2xl:gap-6 text-center"
      >
        <div>
          <p class="text-s-17 lg:text-s-20 font-bold mb-2">
            You dont have any crypto
          </p>

          <p class="text-s-14 lg:text-s-16 text-info">
            To start trading and managing your digital asstes, you will need
            some
            {{ selectedChain?.currencyName }} in your portfolio.
          </p>
        </div>
        <div
          class="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2 lg:gap-4 items-stretch"
        >
          <app-base-button
            class="min-w-[190px]"
            :size="isDesktopAndUp ? 'large' : 'medium'"
            @click="buyBtn"
          >
            <div class="flex gap-2 items-center justify-center">
              <icon-buy
                class="w-5 h-5 md:w-7 md:h-7 text-white"
                dollar-icon-color="rgb(0,90,229,1)"
              />
              <p>Buy {{ selectedChain?.currencyName }}</p>
            </div>
          </app-base-button>
          <app-base-button
            class="min-w-[190px]"
            is-outline
            :size="isDesktopAndUp ? 'large' : 'medium'"
            @click="openDepositDialog = true"
          >
            <div class="flex gap-2 items-center justify-center">
              <QrCodeIcon class="w-4 h-4 md:w-6 md:h-6 text-primary" />
              <p>Deposit {{ selectedChain?.currencyName }}</p>
            </div>
          </app-base-button>
        </div>
      </div>
      <img
        :src="ImgEthRight"
        class="hidden 2xl:flex contain max-w-[15%] place-self-end max-h-[200px]"
      />
    </div>
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
  </app-sheet>
</template>
<script setup lang="ts">
import AppSheet from '@/components/AppSheet.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import { QrCodeIcon } from '@heroicons/vue/24/outline'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { storeToRefs } from 'pinia'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import ImgEthLeft from '@/assets/images/backgrounds/eth-left.webp'
import ImgEthRight from '@/assets/images/backgrounds/eth-right.webp'
import TheDepositDialog from '@components/core_layouts/wallet/TheDepositDialog.vue'
import { ref } from 'vue'

const openDepositDialog = ref(false)
const chainsStore = useChainsStore()
const { selectedChain } = storeToRefs(chainsStore)

const { isDesktopAndUp } = useAppBreakpoints()

const buyBtn = () => {
  window.open(
    'https://ccswap.myetherwallet.com',
    '_blank',
    'noopener,noreferrer',
  )
}
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
