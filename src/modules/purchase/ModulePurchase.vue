<template>
  <div class="flex flex-col h-full min-h-[640px]">
    <!-- Topbar -->
    <div class="border-b border-grey-10 -mx-4">
      <div class="flex items-center gap-4 px-4 -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          :class="[
            'px-1 pb-2 border-b-2 transition-colors',
            currentTab === tab.value
              ? 'border-black text-black'
              : 'border-transparent text-grey-30',
          ]"
          @click="currentTab = tab.value"
        >
          <span class="text-s-24 font-bold leading-[26px] tracking-[-0.48px]">
            {{ tab.label }}
          </span>
        </button>
      </div>
    </div>

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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ModuleBuy from './ModuleBuy.vue'
import ModuleSell from './ModuleSell.vue'

type PurchaseTab = 'buy' | 'sell'

const { t } = useI18n()

const currentTab = ref<PurchaseTab>('buy')

const tabs = computed<{ value: PurchaseTab; label: string }[]>(() => [
  { value: 'buy', label: t('purchase.buy.title') },
  { value: 'sell', label: t('purchase.sell.title') },
])
</script>
