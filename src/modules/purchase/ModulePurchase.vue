<template>
  <div class="flex flex-col h-full">
    <app-content-group
      :title="t('purchase.title')"
      :description="t('purchase.description')"
      size="l"
    />

    <app-segmented-control
      v-model="currentTab"
      :items="tabs"
      :label="t('purchase.title')"
      full-width
      class="mt-5"
    />

    <!-- Tab content -->
    <div class="flex-1 flex flex-col pt-5">
      <transition name="fade" mode="out-in">
        <module-buy v-if="currentTab === 'buy'" key="buy" class="flex-1" />
        <module-sell v-else key="sell" class="flex-1" />
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import AppContentGroup from '@components/content_group/AppContentGroup.vue'
import AppSegmentedControl from '@components/segmented_control/AppSegmentedControl.vue'
import type { SegmentItem } from '@components/segmented_control/types'
import ModuleBuy from './ModuleBuy.vue'
import ModuleSell from './ModuleSell.vue'

type PurchaseTab = 'buy' | 'sell'

const { t } = useI18n()

const currentTab = ref<PurchaseTab>('buy')

// A "Buy" button on the tables sets the coingecko id — force the Buy tab so the
// pre-populated token is visible (ModuleBuy consumes and clears the id).
const { selectedPurchaseCoinId } = storeToRefs(useWalletMenuStore())
watch(selectedPurchaseCoinId, coinId => {
  if (coinId) currentTab.value = 'buy'
})

const tabs = computed<SegmentItem<PurchaseTab>[]>(() => [
  { value: 'buy', label: t('purchase.buy.title') },
  { value: 'sell', label: t('purchase.sell.title') },
])
</script>
