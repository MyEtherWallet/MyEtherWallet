<template>
  <button
    class="w-[196px] bg-white border border-[#e6e6e6] rounded-[20px] flex items-center gap-2.5 pl-2 pr-2.5 py-1.5 shadow-button shadow-button-elevated"
    :class="hover ? 'hoverNoBG' : 'cursor-default'"
  >
    <span class="relative shrink-0">
      <app-blockie
        :address="walletAddress ?? ''"
        :size="6"
        class="rounded-full"
      />
      <img
        v-if="chainsStore.selectedChain?.icon"
        :src="chainsStore.selectedChain.icon"
        alt=""
        aria-hidden="true"
        class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full object-contain bg-white"
      />
    </span>
    <span class="flex flex-col gap-[2px] items-start flex-1 min-w-0">
      <span class="font-semibold text-s-14 leading-[14px] text-black">
        {{ formattedTotalFiatPortfolioValue }}
      </span>
      <span class="flex items-center gap-1 w-full min-w-0">
        <span class="text-[10px] leading-[12px] text-[#575757] truncate">
          {{ accountName }}
        </span>
        <eye-icon
          v-if="isWatchOnly"
          data-test="pill-watch-only"
          class="w-4 h-4 text-[#575757] flex-shrink-0"
        />
        <span
          v-else
          data-test="pill-connected"
          class="w-2 h-2 rounded-full bg-[#1ea97c] flex-shrink-0"
        />
      </span>
    </span>
    <chevron-down-icon class="w-5 h-5 text-black flex-shrink-0" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import AppBlockie from '@/components/AppBlockie.vue'
import { EyeIcon } from '@heroicons/vue/16/solid'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useChainsStore } from '@/stores/chainsStore'
import { truncateAddress } from '@/utils/filters'

withDefaults(defineProps<{ hover?: boolean }>(), { hover: true })

const walletStore = useWalletStore()
const { walletAddress, isWatchOnly, formattedTotalFiatPortfolioValue } =
  storeToRefs(walletStore)

const watchOnlyStore = useWatchOnlyStore()
const chainsStore = useChainsStore()

const accountName = computed<string>(
  () =>
    watchOnlyStore.activeAccount?.addressName ??
    truncateAddress(walletAddress.value ?? '', 6),
)
</script>
