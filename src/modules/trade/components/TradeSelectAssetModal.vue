<template>
  <slot
    name="trigger"
    :open="openSelectAsset"
    :is-loading="isLoading"
    :selected-token="selectedToken"
  />

  <app-dialog
    v-model:is-open="isOpen"
    :class="[
      side === 'sell' ? 'sm:h-[600px]' : 'sm:h-[640px]',
      'w-full sm:w-[480px] sm:mx-auto !rounded-20',
    ]"
    hide-close
  >
    <template #title>
      <div
        class="flex flex-col gap-1 items-center justify-center w-full min-h-[80px] px-6 pt-6 pb-4"
      >
        <h1
          id="dialogTitle"
          class="text-s-20 font-bold leading-[22px] tracking-[-0.4px] text-black text-center"
        >
          {{ $t('trade.select_asset.title') }}
        </h1>
        <p
          v-if="side === 'buy'"
          class="text-s-16 leading-[22px] text-[#575757] text-center"
        >
          {{ $t('trade.select_asset.subtitle') }}
        </p>
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
      <div class="relative flex h-full flex-col">
        <div
          :class="[
            sectionHeader ? 'pb-[2px]' : 'pb-6',
            'flex flex-none flex-col gap-6 bg-white px-6 pt-6',
          ]"
        >
          <app-search-input
            v-model="searchInput"
            size="compact"
            bg-class="bg-bgBase"
            input-class="!text-s-14 placeholder:text-neutral-500"
            :placeholder="$t('select_token.search')"
          />
          <p
            v-if="sectionHeader"
            class="flex items-center px-3 py-2 text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
          >
            {{ sectionHeader }}
          </p>
        </div>

        <div
          ref="listContainer"
          class="flex flex-1 flex-col gap-[2px] overflow-y-auto rounded-12 px-6 pb-6 mew-scrollbar"
        >
          <template v-for="asset in searchResults" :key="asset.address">
            <p
              v-if="asset === firstUnavailableAsset"
              class="flex items-center px-3 py-2 mt-[22px] text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
            >
              {{ $t('trade.select_asset.unavailable') }}
            </p>
            <component
              :is="isAssetPaused(asset) ? 'div' : 'button'"
              :type="isAssetPaused(asset) ? undefined : 'button'"
              :class="[
                isAssetPaused(asset) ? 'cursor-default' : 'hoverBGWhite',
                isSessionUnavailable(asset) ? 'opacity-30' : '',
                'flex items-center gap-3 h-[68px] p-3 rounded-12 bg-white transition-colors focus-visible:!outline-offset-[-3px]',
              ]"
              @click="!isAssetPaused(asset) && selectAsset(asset)"
            >
              <div
                :class="[
                  isDimmed(asset) ? 'opacity-40' : '',
                  'relative flex-none',
                ]"
              >
                <app-token-logo
                  :url="asset.logoURI"
                  :symbol="asset.symbol"
                  :address="tokenAddress(asset)"
                  :is-stock="side === 'buy'"
                  width="w-10"
                  height="h-10"
                  no-shadow
                  no-ring
                />
                <span
                  v-if="isSelected(asset)"
                  class="absolute -top-[4.84px] -left-[4.84px] flex items-center justify-center w-[22px] h-[22px] overflow-hidden rounded-full border border-white bg-neutral-200"
                >
                  <check-circle-icon class="w-6 h-6 flex-none text-black" />
                </span>
              </div>

              <div
                :class="[
                  isDimmed(asset) ? 'opacity-40' : '',
                  'flex flex-col items-start flex-1 min-w-0',
                ]"
              >
                <app-token-symbol
                  :symbol="asset.symbol"
                  :address="tokenAddress(asset)"
                  :is-stock="side === 'buy'"
                  :has-gradient="false"
                  class="!text-s-16 !font-semibold leading-[22px] tracking-[-0.32px]"
                />
                <p
                  class="text-s-14 leading-[20px] text-[#575757] truncate max-w-full"
                >
                  {{ asset.name }}
                </p>
              </div>

              <app-tooltip
                v-if="pauseReasonOf(asset)"
                :text="$t(`trade.pause_reason.${pauseReasonOf(asset)}.tooltip`)"
                theme="dark"
                position="right"
                class="flex-none"
              >
                <span
                  class="flex items-center gap-1 p-1 pl-2 rounded-32 bg-warning-subtle-hover"
                >
                  <span
                    class="text-s-14 font-semibold leading-[20px] tracking-[-0.28px] text-orange-600"
                  >
                    {{ $t(`trade.pause_reason.${pauseReasonOf(asset)}.tag`) }}
                  </span>
                  <information-circle-icon
                    class="w-[18px] h-[18px] text-orange-600"
                  />
                </span>
              </app-tooltip>

              <div v-else class="flex flex-col items-end flex-none">
                <p
                  class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black"
                >
                  {{ asset.fiatValueFormatted }}
                </p>
                <p
                  :class="[
                    side === 'buy' ? changeColor(asset) : 'text-[#575757]',
                    'text-s-14 leading-[20px] whitespace-nowrap',
                  ]"
                >
                  {{ asset.secondaryLine }}
                </p>
              </div>
            </component>
          </template>

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
          :class="[
            hasMoreBelow ? 'opacity-100' : 'opacity-0',
            'absolute bottom-0 left-0 h-[118px] w-full bg-gradient-to-t from-white to-transparent pointer-events-none transition-opacity',
          ]"
        />
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useScroll } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'
import { CheckCircleIcon } from '@heroicons/vue/24/solid'
import { InformationCircleIcon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useI18n } from 'vue-i18n'

import AppDialog from '@/components/AppDialog.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppTooltip from '@/components/AppTooltip.vue'

import { useWalletStore } from '@/stores/walletStore'
import { useChainsStore } from '@/stores/chainsStore'
import { useMarketStatusStore } from '@/stores/marketStatusStore'
import { useCurrency } from '@/composables/useCurrency'
import {
  formatFloatingPointValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { truncate } from '@/utils/filters'
import { type NewTokenInfo } from '@/stores/swapStore'
import type { TradeAssetToken } from '../composables/useTradeTokens'
import { isPauseReason } from '../common/tradeSession'

interface DisplayAsset extends TradeAssetToken {
  fiatValue: BigNumber
  fiatValueFormatted: string
  secondaryLine: string
}

const props = withDefaults(
  defineProps<{
    side: 'sell' | 'buy'
    externalLoading?: boolean
    chainTokens?: NewTokenInfo[]
    networkName?: string
    disabledTokens?: string[]
  }>(),
  {
    externalLoading: false,
    chainTokens: () => [],
    networkName: undefined,
    disabledTokens: () => [],
  },
)

const selectedToken = defineModel<NewTokenInfo>('selectedToken')

const emit = defineEmits<{
  'select:token': [token: NewTokenInfo]
  'open:selectToken': [isOpen: boolean]
}>()

const { t } = useI18n()
const { formatFiat } = useCurrency()
const { isLoadingBalances, isWalletConnected } = storeToRefs(useWalletStore())
const { isLoaded } = storeToRefs(useChainsStore())
const { currentSession } = storeToRefs(useMarketStatusStore())

const isOpen = ref(false)
const searchInput = ref('')
const listContainer = ref<HTMLElement | null>(null)
const { arrivedState } = useScroll(listContainer, { offset: { bottom: 4 } })

const hasMoreBelow = computed(() => !arrivedState.bottom)

const openSelectAsset = () => {
  isOpen.value = true
}

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || isLoadingBalances.value || !isLoaded.value
  }
  return props.externalLoading || !isLoaded.value
})

const sectionHeader = computed(() => {
  if (props.side !== 'buy') return ''
  const session = currentSession.value
  if (!session || session === 'regular') return ''
  const name = t(`trade.market_status.${session}`)
  return name.startsWith('trade.')
    ? ''
    : t('trade.select_asset.available_in', { marketStatus: name })
})

const changeLabel = (change: number): string => {
  const formatted = formatPercentageValue(change).value
  return change > 0 && !/^[+<>]/.test(formatted) ? `+${formatted}` : formatted
}

const tokenAddress = (token: NewTokenInfo) =>
  props.networkName
    ? { address: token.address, network: props.networkName }
    : undefined

const assets = computed<DisplayAsset[]>(() => {
  if (!isLoaded.value) return []
  const tokens = props.chainTokens as TradeAssetToken[]

  if (props.side === 'buy') {
    return tokens.map(token => ({
      ...token,
      fiatValue: BigNumber(token.price || 0),
      fiatValueFormatted: formatFiat(BigNumber(token.price || 0)).display,
      secondaryLine: changeLabel(token.priceChangePercentage24h ?? 0),
    }))
  }

  return tokens
    .map(token => {
      const amountOwned = token.balance
        ? formatUnits(BigInt(token.balance), token.decimals)
        : '0'
      const fiatValue = BigNumber(amountOwned).multipliedBy(token.price || 0)
      return {
        ...token,
        fiatValue,
        fiatValueFormatted: formatFiat(fiatValue).display,
        secondaryLine: `${formatFloatingPointValue(amountOwned).value} ${truncate(token.symbol, 7)}`,
      }
    })
    .filter(asset => asset.fiatValue.isGreaterThan(0))
    .sort((a, b) => b.fiatValue.comparedTo(a.fiatValue) ?? 0)
})

const disabledAddresses = computed(
  () => new Set(props.disabledTokens.map(address => address.toLowerCase())),
)

const pauseReasonOf = (asset: DisplayAsset) =>
  asset.pauseReason && isPauseReason(asset.pauseReason)
    ? asset.pauseReason
    : null

const isSessionUnavailable = (asset: DisplayAsset) =>
  props.side === 'buy' &&
  disabledAddresses.value.has(asset.address?.toLowerCase())

const isAssetPaused = (asset: DisplayAsset) =>
  !!pauseReasonOf(asset) ||
  disabledAddresses.value.has(asset.address?.toLowerCase())

const isDimmed = (asset: DisplayAsset) =>
  isAssetPaused(asset) && !isSessionUnavailable(asset)

const searchResults = computed<DisplayAsset[]>(() => {
  const matches = searchInput.value
    ? fuzzySearchByKeys(assets.value, ['name', 'symbol'], searchInput.value)
    : assets.value
  if (props.side !== 'buy') return matches
  return [
    ...matches.filter(asset => !isSessionUnavailable(asset)),
    ...matches.filter(isSessionUnavailable),
  ]
})

const firstUnavailableAsset = computed(() =>
  searchResults.value.find(isSessionUnavailable),
)

const changeColor = (asset: DisplayAsset) =>
  (asset.priceChangePercentage24h ?? 0) < 0 ? 'text-error' : 'text-success-600'

const isSelected = (asset: DisplayAsset) =>
  selectedToken.value?.address?.toLowerCase() === asset.address?.toLowerCase()

const selectAsset = (asset: DisplayAsset) => {
  selectedToken.value = asset
  emit('select:token', asset)
  isOpen.value = false
}

watch(isOpen, value => {
  if (!value) searchInput.value = ''
  emit('open:selectToken', value)
})

watch(
  () => props.networkName,
  () => {
    const top = assets.value.find(asset => !isAssetPaused(asset))
    if (top) selectedToken.value = top
  },
)
</script>
