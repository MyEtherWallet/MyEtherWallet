<template>
  <button
    class="w-[160px] h-10 bg-white border border-[#e6e6e6] rounded-[20px] flex items-center gap-2.5 pl-2 pr-2.5"
    :class="hover ? 'hoverNoBG' : 'cursor-default'"
  >
    <!-- Connected: active address for the current network -->
    <template v-if="walletAddress">
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
          class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border border-white object-cover bg-white"
        />
      </span>
      <span class="flex flex-col items-start flex-1 min-w-0 gap-0.5">
        <span
          v-if="isLoadingBalances"
          class="inline-block w-12 h-3 bg-grey-10 animate-pulse rounded my-[2px]"
        />
        <span
          v-else
          class="font-semibold text-s-14 leading-[14px] tracking-[-0.28px] text-black"
        >
          {{ formattedTotalFiatPortfolioValue }}
        </span>
        <span class="flex items-center gap-1 w-full min-w-0">
          <span class="text-[10px] leading-[12px] text-[#575757] truncate">
            {{ accountName }}
          </span>
          <eye-icon
            v-if="isWatchOnly"
            data-test="pill-watch-only"
            class="w-3 h-3 text-[#575757] flex-shrink-0"
          />
          <account-connected-dot v-else data-test="pill-connected" />
        </span>
      </span>
    </template>
    <!-- Empty: no address for the selected network (keeps the trigger visible) -->
    <template v-else>
      <span class="relative shrink-0 pl-1">
        <img
          v-if="chainsStore.selectedChain?.icon"
          :src="chainsStore.selectedChain.icon"
          alt=""
          aria-hidden="true"
          class="w-6 h-6 rounded-full object-contain"
        />
      </span>
      <span
        data-test="pill-no-address"
        class="flex-1 text-left text-s-14 font-semibold text-[#575757] truncate"
      >
        {{ $t('multi_address.no_address_pill') }}
      </span>
    </template>
    <chevron-down-icon class="w-5 h-5 text-black flex-shrink-0" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import AppBlockie from '@/components/AppBlockie.vue'
import AccountConnectedDot from '@/components/core_layouts/wallet/AccountConnectedDot.vue'
import { EyeIcon } from '@heroicons/vue/16/solid'
import { useWalletStore } from '@/stores/walletStore'
import { useWatchOnlyStore } from '@/stores/watchOnlyStore'
import { useChainsStore } from '@/stores/chainsStore'
import { truncateAddress } from '@/utils/filters'

withDefaults(defineProps<{ hover?: boolean }>(), { hover: true })

const walletStore = useWalletStore()
const {
  walletAddress,
  isWatchOnly,
  isLoadingBalances,
  formattedTotalFiatPortfolioValue,
} = storeToRefs(walletStore)

const watchOnlyStore = useWatchOnlyStore()
const chainsStore = useChainsStore()

const accountName = computed<string>(
  () =>
    watchOnlyStore.activeAccount?.addressName ??
    truncateAddress(walletAddress.value ?? '', 6),
)
</script>
