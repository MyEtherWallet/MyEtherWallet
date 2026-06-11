<template>
  <div class="h-full flex flex-col gap-6">
    <div class="flex flex-col gap-1 pr-12 flex-none">
      <h2
        id="dialogTitle"
        class="text-s-28 font-bold leading-[32px] tracking-[-0.84px]"
      >
        {{ $t('purchase.select_token.title') }}
      </h2>
      <p class="text-s-16 text-info leading-[22px]">
        {{ $t('purchase.select_token.subtitle') }}
      </p>
    </div>

    <div
      class="flex items-center gap-2 h-12 px-1 bg-bgMuted rounded-24 flex-none"
    >
      <div
        class="flex-1 flex items-center gap-2.5 h-10 px-3 bg-white rounded-20"
      >
        <magnifying-glass-icon class="w-5 h-5 text-info flex-none" />
        <input
          v-model="searchInput"
          type="text"
          :placeholder="$t('purchase.select_token.search_placeholder')"
          class="flex-1 min-w-0 bg-transparent outline-none border-none p-0 text-s-15 text-black placeholder:text-info"
        />
      </div>
      <button
        type="button"
        class="h-10 flex items-center gap-1 pl-3 pr-2 rounded-20 hoverNoBG transition-colors flex-none"
        @click="emit('open-networks')"
      >
        <span class="text-s-13 font-medium whitespace-nowrap">
          {{ filterButtonLabel }}
        </span>
        <chevron-right-icon class="w-4 h-4 text-black" />
      </button>
    </div>

    <div
      v-if="isLoading"
      class="flex flex-1 items-center justify-center py-16"
      aria-live="polite"
    >
      <span
        class="inline-block w-8 h-8 rounded-full border-2 border-grey-10 border-t-primary animate-spin"
      />
    </div>
    <ul v-else role="listbox" class="flex-1 overflow-y-auto">
      <li v-for="entry in filteredEntries" :key="entry.key">
        <button
          type="button"
          class="flex items-center w-full gap-3 px-3 py-2 rounded-12 hoverBGWhite transition-colors text-left"
          @click="emit('select-token', entry.token)"
        >
          <div class="relative w-10 h-10 flex-none">
            <app-token-logo
              :url="entry.tokenIcon"
              :symbol="entry.token.symbol"
              width="w-10"
              height="h-10"
            />
            <span
              class="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full overflow-hidden border-2 border-white bg-white"
            >
              <app-token-logo
                :url="entry.chainIcon"
                :symbol="entry.network.chain"
                width="w-full"
                height="h-full"
              />
            </span>
          </div>
          <div class="min-w-0 flex-1 flex flex-col">
            <p class="text-s-16 font-semibold text-black truncate">
              {{ entry.token.symbol }}
            </p>
            <p class="text-s-12 text-info truncate">
              {{ entry.token.name }}
            </p>
          </div>
          <span
            class="text-s-11 font-bold tracking-sp-06 uppercase text-info whitespace-nowrap flex-none"
          >
            {{ entry.network.name }}
          </span>
          <check-circle-icon
            v-if="isSelectedToken(entry)"
            class="w-5 h-5 text-primary flex-none"
          />
        </button>
      </li>
      <li
        v-if="filteredEntries.length === 0"
        class="text-info text-s-14 text-center py-10"
      >
        {{ $t('purchase.select_token.no_results') }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronRightIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import { useChainsStore } from '@/stores/chainsStore'
import {
  getPurchaseChainIcon,
  getPurchaseTokenIcon,
} from '../../helpers/purchaseIcons'
import type { PurchaseAsset } from '@/types/buyToken'
import type { BuyNetwork } from '@/stores/purchaseStore'

const props = defineProps<{
  networks: BuyNetwork[]
  selectedToken: PurchaseAsset | null
  networkFilter: string | null
  compatibleChains?: string[]
  isLoading?: boolean
}>()

const emit = defineEmits<{
  'open-networks': []
  'select-token': [token: PurchaseAsset]
}>()

const { t } = useI18n()
const chainsStore = useChainsStore()

const searchInput = ref('')

interface Entry {
  key: string
  network: BuyNetwork
  token: PurchaseAsset
  tokenIcon: string | undefined
  chainIcon: string | undefined
}

const allEntries = computed<Entry[]>(() =>
  props.networks.flatMap(network =>
    network.tokens.map(token => ({
      key: `${network.chain}-${token.symbol}`,
      network,
      token,
      tokenIcon: getPurchaseTokenIcon(token, network.tokens, chainsStore),
      chainIcon: getPurchaseChainIcon(
        network.chain,
        network.tokens,
        chainsStore,
      ),
    })),
  ),
)

const filteredEntries = computed<Entry[]>(() => {
  const term = searchInput.value.trim().toLowerCase()
  return allEntries.value.filter(entry => {
    if (props.compatibleChains?.length && !props.compatibleChains.includes(entry.network.chain)) {
      return false
    }
    if (props.networkFilter && entry.network.chain !== props.networkFilter) {
      return false
    }
    if (!term) return true
    return (
      entry.token.symbol.toLowerCase().includes(term) ||
      entry.token.name.toLowerCase().includes(term)
    )
  })
})

const filterButtonLabel = computed(() => {
  if (!props.networkFilter)
    return t('purchase.select_token.filter_all_networks')
  const network = props.networks.find(n => n.chain === props.networkFilter)
  return network?.name ?? t('purchase.select_token.filter_all_networks')
})

const isSelectedToken = (entry: Entry) =>
  entry.token.chain === props.selectedToken?.chain &&
  entry.token.symbol === props.selectedToken?.symbol
</script>
