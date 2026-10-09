<script setup lang="ts">
import { computed } from 'vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { useCurrency } from '@/composables/useCurrency'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import type { AssetPickerItem } from '@/modules/home/composables/useAssetPicker'

const props = defineProps<{ item: AssetPickerItem; selected: boolean }>()

defineEmits<{ toggle: [] }>()

const { formatFiat } = useCurrency()

const changeText = computed(() => {
  const { change } = props.item
  if (change == null) return ''
  // formatPercentageValue returns a bare '0' (no %) for zero.
  if (change === 0) return '0%'
  return `${change < 0 ? '-' : '+'}${formatPercentageValue(Math.abs(change)).value}`
})
</script>

<template>
  <!-- Selectable cell (Figma "Cell" with a prefix watchlist toggle): the whole
       row toggles the pick; the parent commits picks on confirm. -->
  <button
    type="button"
    data-test="asset-picker-row"
    :aria-pressed="selected"
    class="flex h-[68px] w-full items-center gap-3 rounded-xl p-3 text-left transition-colors hover:bg-background-alternative-hover"
    @click="$emit('toggle')"
  >
    <!-- Heroicons only inherit `class`, so the hook + tint live on a wrapper. -->
    <span
      data-test="picker-star"
      class="flex w-7 shrink-0 justify-center"
      :class="selected ? 'text-text-brand' : 'text-text-placeholder'"
    >
      <AppIcon
        name="star"
        :variant="selected ? 'filled' : 'stroke'"
        size="xxs"
      />
    </span>
    <AppTokenLogo
      :url="item.logoUrl"
      :symbol="item.symbol"
      :is-stock="item.type === 'stock'"
      width="w-10"
      height="h-10"
      no-shadow
      class="shrink-0"
    />
    <span class="min-w-0 flex-1">
      <AppTokenSymbol
        :symbol="item.symbol"
        :is-stock="item.type === 'stock'"
        class="block truncate !text-label-base text-black"
      />
      <span class="block truncate text-text-sm text-text-subtle">
        {{ item.name }}
      </span>
    </span>
    <span class="flex shrink-0 flex-col items-end">
      <span
        v-if="item.price != null"
        data-test="picker-price"
        class="text-label-base text-black"
      >
        {{ formatFiat(item.price).display }}
      </span>
      <span
        v-if="item.change != null"
        data-test="picker-change"
        class="text-text-sm"
        :class="item.change < 0 ? 'text-text-error' : 'text-text-success'"
      >
        {{ changeText }}
      </span>
    </span>
  </button>
</template>
