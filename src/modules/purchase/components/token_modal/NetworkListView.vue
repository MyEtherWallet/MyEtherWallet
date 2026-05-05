<template>
  <div class="h-full flex flex-col gap-6">
    <div class="flex items-start gap-3 pr-12 flex-none">
      <button
        type="button"
        class="flex-none w-8 h-8 -ml-1 flex items-center justify-center rounded-full hoverNoBG transition-colors"
        @click="emit('back')"
      >
        <chevron-left-icon class="w-5 h-5 text-black" />
      </button>
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <h2 class="text-s-28 font-bold leading-[32px] tracking-[-0.84px]">
          {{ $t('purchase.select_token.filter_title') }}
        </h2>
        <p class="text-s-16 text-info leading-[22px]">
          {{ $t('purchase.select_token.filter_subtitle') }}
        </p>
      </div>
    </div>

    <div
      class="flex items-center gap-2.5 h-12 px-3 bg-white border-4 border-grey-10 rounded-24 flex-none"
    >
      <magnifying-glass-icon class="w-5 h-5 text-info flex-none" />
      <input
        v-model="searchInput"
        type="text"
        :placeholder="$t('purchase.select_token.search_placeholder')"
        class="flex-1 min-w-0 bg-transparent outline-none border-none p-0 text-s-15 text-black placeholder:text-info"
      />
    </div>

    <ul role="listbox" class="flex-1 overflow-y-auto">
      <li>
        <button
          type="button"
          class="flex items-center w-full gap-3 py-2 rounded-12 hoverBGWhite transition-colors text-left"
          @click="emit('select-network', null)"
        >
          <div
            class="w-10 h-10 flex-none rounded-full bg-bgBase"
            aria-hidden="true"
          />
          <span class="text-s-16 font-semibold text-black flex-1">
            {{ $t('purchase.select_token.filter_all_networks') }}
          </span>
          <check-circle-icon
            v-if="currentFilter === null"
            class="w-5 h-5 text-primary flex-none"
          />
        </button>
      </li>
      <li v-for="network in filteredNetworks" :key="network.chain">
        <button
          type="button"
          class="flex items-center w-full gap-3 py-2 rounded-12 hoverBGWhite transition-colors text-left"
          @click="emit('select-network', network.chain)"
        >
          <app-token-logo
            :url="getChainIcon(network)"
            :symbol="network.chain"
            width="w-10"
            height="h-10"
          />
          <span class="text-s-16 font-semibold text-black flex-1 truncate">
            {{ network.name }}
          </span>
          <check-circle-icon
            v-if="currentFilter === network.chain"
            class="w-5 h-5 text-primary flex-none"
          />
        </button>
      </li>
      <li
        v-if="filteredNetworks.length === 0"
        class="text-info text-s-14 text-center py-10"
      >
        {{ $t('common.not_found.chains') }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { getPurchaseChainIcon } from '../../helpers/purchaseIcons'
import type { BuyNetwork } from '@/stores/purchaseStore'

const props = defineProps<{
  networks: BuyNetwork[]
  currentFilter: string | null
}>()

const emit = defineEmits<{
  back: []
  'select-network': [chain: string | null]
}>()

const chainsStore = useChainsStore()

const searchInput = ref('')

const getChainIcon = (network: BuyNetwork) =>
  getPurchaseChainIcon(network.chain, network.tokens, chainsStore)

const filteredNetworks = computed<BuyNetwork[]>(() => {
  const term = searchInput.value.trim().toLowerCase()
  if (!term) return props.networks
  return props.networks.filter(
    n =>
      n.name.toLowerCase().includes(term) ||
      n.chain.toLowerCase().includes(term),
  )
})
</script>
