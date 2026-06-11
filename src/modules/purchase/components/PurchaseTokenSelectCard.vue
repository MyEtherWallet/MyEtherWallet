<template>
  <button
    type="button"
    class="bg-bgBase border border-bgBase hover:border-grey-10 transition-colors w-full flex items-center gap-2 p-4 rounded-20"
    @click="emit('click')"
  >
    <div class="relative w-10 h-10 flex-none">
      <app-token-logo
        :url="tokenIconUrl"
        :symbol="displayTokenSymbol"
        width="w-9"
        height="h-9"
        class="absolute top-0 left-0"
      />
      <span
        class="absolute bottom-0 right-0 w-[18px] h-[18px] rounded-full overflow-hidden border-2 border-bgBase bg-white"
      >
        <app-token-logo
          :url="chain.icon"
          :symbol="chain.name"
          width="w-full"
          height="h-full"
        />
      </span>
    </div>
    <div class="flex flex-col items-start flex-1 min-w-0">
      <p class="text-s-16 font-semibold text-black leading-[22px] truncate">
        {{ displayTokenSymbol }}
      </p>
      <p class="text-s-12 text-info leading-[18px] truncate">
        {{ chain.nameLong || chain.name }}
      </p>
    </div>
    <chevron-right-icon class="w-5 h-5 text-black flex-none" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import type { Chain } from '@/mew_api/types'
import type { PurchaseAsset } from '@/types/buyToken'

const props = defineProps<{
  chain: Chain
  token: PurchaseAsset | null
}>()

const emit = defineEmits<{
  click: []
}>()

const displayTokenSymbol = computed<string>(
  () => props.token?.symbol ?? props.chain.currencyName ?? '',
)

const tokenIconUrl = computed<string | undefined>(() => {
  if (!props.token) return props.chain.icon
  if (props.token.symbol === props.chain.currencyName) return props.chain.icon
  return props.token.market_data?.icon ?? props.chain.icon
})
</script>
