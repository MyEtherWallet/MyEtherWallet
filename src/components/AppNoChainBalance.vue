<template>
  <div class="flex flex-col items-center justify-center gap-3 w-full">
    <p class="text-info">{{ $t('common.add_funds_to_proceed') }}</p>
    <app-base-button v-if="isNativeBuyable" class="!w-full" @click="buyBtn">
      <div class="flex gap-2 items-center justify-center">
        <icon-buy
          class="w-5 h-5 xl:w-6 xl:h-6 text-white"
          dollar-icon-color="rgb(0,90,229,1)"
        />
        <p>
          {{
            $t('common.buy_currency', {
              currency: selectedChain?.currencyName ?? '',
            })
          }}
        </p>
      </div>
    </app-base-button>
    <app-base-button
      type="tertiary"
      surface="alternative"
      size="small"
      v-if="isNativeBuyable"
      class="mt-1 !min-w-[200px] group transition-transform"
      @click="openDepositDialog = true"
    >
      <div class="flex gap-2 items-center justify-center group">
        <p>
          {{
            $t('common.or_deposit_currency', {
              currency: selectedChain?.currencyName ?? '',
            })
          }}
        </p>
        <ArrowLongRightIcon
          class="w-4 h-4 xl:w-5 xl:h-5 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </app-base-button>
    <app-base-button
      v-if="!isNativeBuyable"
      class="w-full"
      @click="openDepositDialog = true"
    >
      <div class="flex gap-2 items-center justify-center">
        <QrCodeIcon class="w-4 h-4 xl:w-5 xl:h-5 text-white" />
        <p>
          {{
            $t('common.deposit_currency', {
              currency: selectedChain?.currencyName ?? '',
            })
          }}
        </p>
      </div>
    </app-base-button>
    <the-deposit-dialog v-model:open-dialog="openDepositDialog" />
  </div>
</template>
<script setup lang="ts">
import AppBaseButton from '@/components/AppBaseButton.vue'
import { ArrowLongRightIcon, QrCodeIcon } from '@heroicons/vue/24/outline'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { usePurchaseStore } from '@/stores/purchaseStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { storeToRefs } from 'pinia'
import TheDepositDialog from '@components/core_layouts/wallet/TheDepositDialog.vue'
import { ref, computed } from 'vue'
import { analytics, ClickTokenTradeEvent } from '@/analytics'

const props = defineProps<{
  source: 'send' | 'swap' | 'bridge' | 'trade'
}>()

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
    location: props.source,
    token: selectedChain.value?.currencyName,
  })
  walletMenu.openPanel('purchase')
}
</script>
