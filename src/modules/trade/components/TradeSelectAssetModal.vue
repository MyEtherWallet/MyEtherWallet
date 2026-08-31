<template>
  <slot
    name="trigger"
    :open="openSelectAsset"
    :is-loading="isLoading"
    :selected-token="selectedToken"
  />

  <app-dialog
    v-model:is-open="isOpen"
    class="w-full sm:w-[480px] sm:mx-auto sm:h-[600px] !rounded-20"
    hide-close
  >
    <template #title>
      <div class="flex items-center justify-center w-full min-h-[80px] p-6">
        <h1
          id="dialogTitle"
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black text-center"
        >
          {{ $t('trade.select_asset.title') }}
        </h1>
      </div>
      <app-btn-icon
        :label="$t('common.close')"
        class="absolute top-6 right-6 bg-bgBase"
        height="h-8"
        width="w-8"
        @click="isOpen = false"
      >
        <x-mark-icon class="w-6 h-6" />
      </app-btn-icon>
    </template>
    <template #content>
      <div class="flex flex-col min-h-full">
        <div class="relative flex flex-col gap-6 p-6">
          <app-search-input
            v-model="searchInput"
            size="compact"
            bg-class="bg-bgBase"
            input-class="!text-s-14 placeholder:text-neutral-500"
            :placeholder="$t('select_token.search')"
          />

          <div class="flex flex-col gap-[2px] rounded-12">
            <button
              v-for="asset in searchResults"
              :key="asset.address"
              type="button"
              class="flex items-center gap-3 h-[68px] p-3 rounded-12 bg-white hoverBGWhite transition-colors"
              @click="selectAsset(asset)"
            >
              <div class="relative flex-none">
                <app-token-logo
                  :url="asset.logoURI"
                  :symbol="asset.symbol"
                  :address="tokenAddress(asset)"
                  width="w-10"
                  height="h-10"
                  no-shadow
                  no-ring
                />
                <span
                  v-if="isSelected(asset)"
                  class="absolute -top-[4.84px] -left-[4.84px] flex items-center justify-center w-[22px] h-[22px] rounded-full border border-white bg-neutral-200"
                >
                  <check-circle-icon class="w-[18px] h-[18px] text-black" />
                </span>
              </div>

              <div class="flex flex-col items-start flex-1 min-w-0">
                <app-token-symbol
                  :symbol="asset.symbol"
                  :address="tokenAddress(asset)"
                  class="!text-s-16 !font-semibold leading-[22px] tracking-[-0.32px]"
                />
                <p
                  class="text-s-14 leading-[20px] text-info truncate max-w-full"
                >
                  {{ asset.name }}
                </p>
              </div>

              <div class="flex flex-col items-end flex-none">
                <p
                  class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
                >
                  {{ asset.fiatOwnedFormatted }}
                </p>
                <p class="text-s-14 leading-[20px] text-info whitespace-nowrap">
                  {{ asset.amountOwnedFormatted }}
                  {{ truncate(asset.symbol, 7) }}
                </p>
              </div>
            </button>
          </div>

          <p
            v-if="!searchResults.length"
            class="text-s-14 leading-[20px] text-info text-center py-6"
          >
            {{
              searchInput
                ? $t('select_token.no_tokens_match')
                : $t('select_token.no_tokens_available')
            }}
          </p>
        </div>
        <div
          class="sticky bottom-0 mt-auto h-[118px] w-full bg-gradient-to-t from-white to-transparent pointer-events-none"
        />
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'

import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'

import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useCurrency } from '@/composables/useCurrency'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { truncate } from '@/utils/filters'
import { type NewTokenInfo } from '@/composables/useSwap'

/**
 * @description Asset picker for the Trade sell side. Lists only the assets the
 * user owns on the selected chain, ordered by the fiat value held. Exposes the
 * same `trigger` slot contract as AppSwapSelectedToken so the card that mounts
 * it keeps owning the trigger markup.
 */
interface OwnedAsset extends NewTokenInfo {
  fiatOwned: BigNumber
  fiatOwnedFormatted: string
  amountOwnedFormatted: string
}

const props = withDefaults(
  defineProps<{
    externalLoading?: boolean
    chainTokens?: NewTokenInfo[]
    networkName?: string
  }>(),
  {
    externalLoading: false,
    chainTokens: () => [],
    networkName: undefined,
  },
)

const selectedToken = defineModel<NewTokenInfo>('selectedToken')

const emit = defineEmits<{
  'select:token': [token: NewTokenInfo]
  'open:selectToken': [isOpen: boolean]
}>()

const { formatFiat } = useCurrency()
const { isLoadingBalances, isWalletConnected } = storeToRefs(useWalletStore())
const { isLoaded } = storeToRefs(useChainsStore())

const isOpen = ref(false)
const searchInput = ref('')

const openSelectAsset = () => {
  isOpen.value = true
}

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || isLoadingBalances.value || !isLoaded.value
  }
  return props.externalLoading || !isLoaded.value
})

const tokenAddress = (token: NewTokenInfo) =>
  props.networkName
    ? { address: token.address, network: props.networkName }
    : undefined

const ownedAssets = computed<OwnedAsset[]>(() => {
  if (!isLoaded.value) return []
  return props.chainTokens
    .map(token => {
      const amountOwned = token.balance
        ? formatUnits(BigInt(token.balance), token.decimals)
        : '0'
      const fiatOwned = BigNumber(amountOwned).multipliedBy(token.price || 0)
      return {
        ...token,
        fiatOwned,
        fiatOwnedFormatted: formatFiat(fiatOwned).display,
        amountOwnedFormatted: formatFloatingPointValue(amountOwned).value,
      }
    })
    .filter(asset => asset.fiatOwned.isGreaterThan(0))
    .sort((a, b) => b.fiatOwned.comparedTo(a.fiatOwned) ?? 0)
})

const searchResults = computed<OwnedAsset[]>(() => {
  if (!searchInput.value) return ownedAssets.value
  return fuzzySearchByKeys(
    ownedAssets.value,
    ['name', 'symbol'],
    searchInput.value,
  )
})

const isSelected = (asset: OwnedAsset) =>
  selectedToken.value?.address?.toLowerCase() === asset.address?.toLowerCase()

const selectAsset = (asset: OwnedAsset) => {
  selectedToken.value = asset
  emit('select:token', asset)
  isOpen.value = false
}

watch(isOpen, value => {
  if (!value) searchInput.value = ''
  emit('open:selectToken', value)
})

// Keep the selection valid when the chain changes: fall back to the largest holding.
watch(
  () => props.networkName,
  () => {
    const top = ownedAssets.value[0]
    if (top) selectedToken.value = top
  },
)
</script>
