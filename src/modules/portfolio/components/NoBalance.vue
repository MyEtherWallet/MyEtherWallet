<template>
  <app-sheet
    sheet-class="!p-0 bg-no-repeat  flex items-center justify-center !lg:p-0 !relative bg-[url('@/assets/images/backgrounds/eth-left.webp'),_url('@/assets/images/backgrounds/eth-right.webp'),_radial-gradient(circle_500px_at_50%_100%,_rgba(255,255,255,0.5)_60%,transparent_100%),_linear-gradient(to_bottom,transparent,rgba(255,255,255,0.6)_90px,rgba(255,255,255,1)_190px),linear-gradient(to_right,rgba(90,197,210,1)_0%,rgba(149,206,253,1)_50%,rgba(126,138,250,1)_100%)] bg-[size:0px,_0px,_100%,_100%,_100%] xs:bg-[size:90px,_90px,_100%,_100%,_100%]  2xl:bg-[size:150px,_150px,_100%,_100%,_100%] bg-[position:_left_10px_top_10px,_right_10px_bottom_0px,_center_center,_center_center,_center_center]"
    :is-elivated="false"
  >
    <div class="flex h-full items-center justify-between relative">
      <div
        class="flex flex-col flex-1 p-4 xl:p-6 place-content-center justify-center gap-4 xl:gap-6 text-center z-4"
      >
        <div class="max-w-[540px] mx-auto">
          <p class="text-s-20 xl:text-s-24 font-bold mb-2">
            {{ $t('portfolio.no_balance.title') }}
          </p>

          <p class="text-s-15 xl:text-s-17 text-fg-subtle leading-relaxed">
            {{
              $t('portfolio.no_balance.description', {
                currencyName: selectedChain?.currencyName,
              })
            }}
          </p>
        </div>
        <div
          class="flex flex-col xs:flex-row items-center justify-center gap-3 md:gap-4 flex-wrap"
        >
          <app-base-button
            v-if="isNativeBuyable"
            class="min-w-[180px]"
            @click="buyBtn"
          >
            <div class="flex gap-2 items-center justify-center">
              <icon-buy
                class="w-5 h-5 xl:w-6 xl:h-6 text-fg-on-fill"
                dollar-icon-color="rgb(0,90,229,1)"
              />
              <p>
                {{ $t('portfolio.no_balance.buy') }}
                {{ selectedChain?.currencyName }}
              </p>
            </div>
          </app-base-button>
          <app-base-button
            class="min-w-[165px] xl:min-w-[180px]"
            is-outline
            @click="openDepositDialog = true"
            :size="isXLAndUp ? 'large' : 'medium'"
          >
            <div class="flex gap-2 items-center justify-center">
              <QrCodeIcon class="w-4 h-4 xl:w-5 xl:h-5 text-brand" />
              <p>
                {{ $t('portfolio.no_balance.deposit') }}
                {{ selectedChain?.currencyName }}
              </p>
            </div>
          </app-base-button>
        </div>
      </div>
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
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import TheDepositDialog from '@components/core_layouts/wallet/TheDepositDialog.vue'
import { ref, computed } from 'vue'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { analytics, ClickTokenTradeEvent } from '@/analytics'

const { isXLAndUp } = useAppBreakpoints()
const openDepositDialog = ref(false)
const chainsStore = useChainsStore()
const purchaseStore = usePurchaseStore()
const walletMenu = useWalletMenuStore()
const { selectedChain } = storeToRefs(chainsStore)
const { isBuyable } = purchaseStore
const { isFetching: isFetchingBuyableCoins } = storeToRefs(purchaseStore)

const isNativeBuyable = computed(() => {
  if (isFetchingBuyableCoins.value) return false
  return isBuyable(selectedChain.value?.currencyNameLong.toLowerCase())
})

const buyBtn = () => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.BUY, {
    location: 'portfolio_no_balance',
    token: selectedChain.value?.currencyName,
  })
  walletMenu.openPanel('purchase')
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
