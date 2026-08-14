<script setup lang="ts">
import { computed } from 'vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'

interface Props {
  logo?: string
  symbol: string
  name?: string
  isStock?: boolean
  /** 24h change as a number; positive renders green, negative red. */
  change?: number
  /** Pre-formatted fiat price (parent formats via useCurrency). */
  priceDisplay?: string
}

const props = defineProps<Props>()

defineEmits<{
  select: []
}>()

const up = computed(() => (props.change ?? 0) >= 0)
const changeColor = computed(() => (up.value ? 'text-success' : 'text-error'))
const changeText = computed(() =>
  props.change != null
    ? `${up.value ? '+' : '-'}${Math.abs(props.change).toFixed(2)}%`
    : '',
)
</script>

<template>
  <div
    data-test="token-list-row"
    class="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors hover:bg-[#f7f7f7]"
    @click="$emit('select')"
  >
    <AppTokenLogo
      :url="logo"
      :symbol="symbol"
      :is-stock="isStock"
      width="size-8"
      height="size-8"
      no-ring
      no-shadow
      class="shrink-0"
    />
    <div class="flex min-w-0 flex-1 flex-col">
      <AppTokenSymbol
        :symbol="symbol"
        :is-stock="isStock"
        class="!text-s-16 !font-semibold tracking-[-0.32px] text-black"
      />
      <span v-if="name" class="truncate text-s-14 leading-5 text-[#575757]">
        {{ name }}
      </span>
    </div>
    <div class="flex shrink-0 flex-col items-end text-right">
      <p
        class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
      >
        {{ priceDisplay }}
      </p>
      <p
        v-if="change != null"
        class="text-s-14 font-normal leading-5 tracking-[-0.28px]"
        :class="changeColor"
        data-test="token-list-row-change"
      >
        {{ changeText }}
      </p>
    </div>
  </div>
</template>
