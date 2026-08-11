<template>
  <div class="h-full flex flex-col gap-6">
    <div class="flex items-start gap-3 pr-12 flex-none">
      <button
        type="button"
        class="flex-none w-8 h-8 -ml-1 flex items-center justify-center rounded-full hoverNoBG transition-colors"
        @click="emit('back')"
      >
        <chevron-left-icon class="w-5 h-5 text-fg" />
      </button>
      <div class="flex flex-col gap-1 flex-1 min-w-0">
        <h2 class="text-s-28 font-bold leading-[32px] tracking-[-0.84px]">
          {{ $t('purchase.select_token.filter_title') }}
        </h2>
        <p class="text-s-16 text-fg-subtle leading-[22px]">
          {{ $t('purchase.select_token.filter_subtitle') }}
        </p>
      </div>
    </div>

    <div
      class="flex items-center h-12 px-1 bg-surface border-4 border-line rounded-24 flex-none"
    >
      <app-search-input
        v-model="searchInput"
        size="compact"
        bg-class="bg-transparent"
        class="flex-1"
        :placeholder="$t('purchase.select_token.search_placeholder')"
      />
    </div>

    <div
      v-if="isLoading"
      class="flex flex-1 items-center justify-center py-16"
      aria-live="polite"
    >
      <span
        class="inline-block w-8 h-8 rounded-full border-2 border-line border-t-brand animate-spin"
      />
    </div>
    <ul v-else role="listbox" class="flex-1 overflow-y-auto">
      <!-- All networks -->
      <li>
        <button
          type="button"
          class="flex items-center w-full gap-3 px-3 py-2 rounded-12 hoverBGWhite transition-colors text-left"
          @click="emit('select-network', null)"
        >
          <div
            class="w-10 h-10 flex-none rounded-full bg-page"
            aria-hidden="true"
          />
          <span class="text-s-16 font-semibold text-fg flex-1">
            {{ $t('purchase.select_token.filter_all_networks') }}
          </span>
          <check-circle-icon
            v-if="currentFilter === null"
            class="w-5 h-5 text-brand flex-none"
          />
        </button>
      </li>

      <!-- Compatible networks -->
      <li v-for="network in compatibleNetworks" :key="network.chain">
        <button
          type="button"
          class="flex items-center w-full gap-3 px-3 py-2 rounded-12 hoverBGWhite transition-colors text-left"
          @click="emit('select-network', network.chain)"
        >
          <app-token-logo
            :url="getChainIcon(network)"
            :symbol="network.chain"
            width="w-10"
            height="h-10"
          />
          <span class="text-s-16 font-semibold text-fg flex-1 truncate">
            {{ network.name }}
          </span>
          <check-circle-icon
            v-if="currentFilter === network.chain"
            class="w-5 h-5 text-brand flex-none"
          />
        </button>
      </li>

      <!-- Incompatible networks section -->
      <template v-if="incompatibleNetworks.length">
        <li class="px-1 pt-5 pb-1">
          <p class="text-s-14 font-medium text-fg-subtle">
            {{ $t('select_chain.incompatible_title') }}
          </p>
        </li>
        <li
          v-for="network in incompatibleNetworks"
          :key="network.chain"
          class="flex items-center w-full gap-3 px-3 py-2 rounded-12 opacity-50"
        >
          <app-token-logo
            :url="getChainIcon(network)"
            :symbol="network.chain"
            width="w-10"
            height="h-10"
          />
          <span class="text-s-16 font-semibold text-fg flex-1 truncate">
            {{ network.name }}
          </span>
        </li>
      </template>

      <li
        v-if="
          compatibleNetworks.length === 0 && incompatibleNetworks.length === 0
        "
        class="text-fg-subtle text-s-14 text-center py-10"
      >
        {{ $t('common.not_found.chains') }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronLeftIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import { useChainsStore } from '@/stores/chainsStore'
import { getPurchaseChainIcon } from '../../helpers/purchaseIcons'
import type { BuyNetwork } from '@/stores/purchaseStore'

const props = defineProps<{
  networks: BuyNetwork[]
  currentFilter: string | null
  compatibleChains?: string[]
  incompatibleChains?: string[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  back: []
  'select-network': [chain: string | null]
}>()

const chainsStore = useChainsStore()

const searchInput = ref('')

const getChainIcon = (network: BuyNetwork) =>
  getPurchaseChainIcon(network.chain, network.tokens, chainsStore)

const compatibleNetworks = computed<BuyNetwork[]>(() => {
  const term = searchInput.value.trim().toLowerCase()
  const base = props.compatibleChains?.length
    ? props.networks.filter(n => props.compatibleChains!.includes(n.chain))
    : props.networks
  if (!term) return base
  return base.filter(
    n =>
      n.name.toLowerCase().includes(term) ||
      n.chain.toLowerCase().includes(term),
  )
})

const incompatibleNetworks = computed<BuyNetwork[]>(() => {
  if (!props.incompatibleChains?.length) return []
  const term = searchInput.value.trim().toLowerCase()
  const base = props.networks.filter(n =>
    props.incompatibleChains!.includes(n.chain),
  )
  if (!term) return base
  return base.filter(
    n =>
      n.name.toLowerCase().includes(term) ||
      n.chain.toLowerCase().includes(term),
  )
})
</script>
