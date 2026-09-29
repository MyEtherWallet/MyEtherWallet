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
    <app-btn-text
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
        <AppIcon
          name="arrow-long-right"
          size="xxs"
          class="xl:size-5 group-hover:translate-x-1 transition-transform"
        />
      </div>
    </app-btn-text>
    <app-base-button
      v-if="!isNativeBuyable"
      class="w-full"
      @click="openDepositDialog = true"
    >
      <div class="flex gap-2 items-center justify-center">
        <AppIcon name="qr-code" size="xxs" class="xl:size-5 text-white" />
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
import AppBtnText from './AppBtnText.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
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
