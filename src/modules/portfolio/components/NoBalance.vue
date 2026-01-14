<template>
  <app-sheet
    sheet-class="no-balance-gradient bg-no-repeat bg-cover !p-0 overflow-hidden"
  >
    <div class="flex h-full items-center justify-between relative">
      <img
        :src="ImgEthLeft"
        class="hidden lg:flex contain max-w-[20%] max-h-[160px] ml-[-2%]"
        width=""
      />

      <div
        class="flex flex-col flex-1 px-6 py-12 place-content-center justify-center gap-4 lg:gap-6 text-center z-10"
      >
        <div class="max-w-[540px] mx-auto">
          <p class="text-s-20 lg:text-s-24 font-bold mb-2">
            You don't have any crypto
          </p>

          <p class="text-s-15 lg:text-s-17 text-info leading-relaxed">
            To start trading and managing your digital assets, you will need
            some
            {{ selectedChain?.currencyName }} in your portfolio.
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
        >
          <app-base-button
            v-if="isNativeBuyable"
            class="min-w-[180px]"
            @click="buyBtn"
          >
            <div class="flex gap-2 items-center justify-center">
              <icon-buy
                class="w-6 h-6 text-white"
                dollar-icon-color="rgb(0,90,229,1)"
              />
              <p>Buy {{ selectedChain?.currencyName }}</p>
            </div>
          </app-base-button>
          <app-base-button
            class="min-w-[180px]"
            is-outline
            @click="openDepositDialog = true"
          >
            <div class="flex gap-2 items-center justify-center">
              <QrCodeIcon class="w-5 h-5 text-primary" />
              <p>Deposit {{ selectedChain?.currencyName }}</p>
            </div>
          </app-base-button>
        </div>
      </div>
      <img
        :src="ImgEthRight"
        class="hidden lg:flex contain max-w-[20%] place-self-end max-h-[160px] mr-[-2%] mb-[-2%]"
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
import { usePurchaseStore } from '@/stores/purchaseStore'
import { storeToRefs } from 'pinia'
import ImgEthLeft from '@/assets/images/backgrounds/eth-left.webp'
import ImgEthRight from '@/assets/images/backgrounds/eth-right.webp'
import TheDepositDialog from '@components/core_layouts/wallet/TheDepositDialog.vue'
import { ref, computed } from 'vue'

const openDepositDialog = ref(false)
const chainsStore = useChainsStore()
const purchaseStore = usePurchaseStore()
const { selectedChain } = storeToRefs(chainsStore)

const isNativeBuyable = computed(() => {
  return purchaseStore.purchaseInfo?.assets.some(
    asset =>
      asset.name.toLowerCase() ===
      selectedChain.value?.currencyName.toLowerCase(),
  )
})

const buyBtn = () => {
  window.open(
    'https://ccswap.myetherwallet.com/',
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
