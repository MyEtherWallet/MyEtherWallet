<template>
  <button
    :class="[
      isLoading || !selectedToken
        ? 'bg-surface-strong animate-pulse min-w-[120px]'
        : 'bg-surface hoverNoBG shadow-button border-line border',
      'rounded-full px-1 min-h-9 transition-colors',
    ]"
    type="button"
    @click="showAllTokens = true"
    :aria-label="$t('select_token.title')"
    :disabled="isLoading || !selectedToken"
  >
    <div
      v-if="!isLoading && selectedToken"
      class="flex flex-nowrap items-center"
    >
      <app-token-logo
        :url="selectedToken.logoURI"
        :symbol="selectedToken.symbol"
        :address="
          networkName
            ? { address: selectedToken.address, network: networkName }
            : undefined
        "
        width="w-7"
        height="h-7"
        class="mr-2"
      />
      <app-token-symbol
        v-if="!isLoading"
        :symbol="selectedToken.symbol"
        :address="
          networkName
            ? { address: selectedToken.address, network: networkName }
            : undefined
        "
      />
      <div class="ml-1 min-w-4 h-4">
        <chevron-down-icon v-if="!isLoading" class="text-fg-subtle" />
      </div>
    </div>
  </button>
  <app-dialog
    v-model:is-open="showAllTokens"
    class="w-full sm:w-[460px] sm:mx-auto"
    :title="
      isFromView ? $t('select_token.swap_from') : $t('select_token.swap_to')
    "
    has-content-gutter
  >
    <template #content>
      <div
        class="min-h-[500px] lg:min-h-[90vh] max-h-[90vh] xs:max-h-[500px] pb-6 overflow-y-auto mew-scrollbar"
        ref="scrollContainer"
      >
        <div class="sticky top-0 bg-surface z-20 pt-2">
          <div
            class="flex gap-2 justify-between items-center mb-2 bg-brand-subtle rounded-full p-1"
          >
            <app-search-input
              v-model="searchInput"
              class="grow"
              bg-class="bg-transparent"
              :placeholder="$t('select_token.search')"
            />
            <!--SORT-->
            <app-pop-up-menu :placeholder="$t('common.sort')">
              <template #menu-button="{ toggleMenu }">
                <button
                  class="flex items-center px-4 py-2 text-s-15 font-medium hoverNoBG rounded-full bg-surface h-10 shadow-sm whitespace-nowrap min-w-[100px] justify-center"
                  @click="toggleMenu"
                >
                  <span class="mr-2">{{ activeSortLabel }}</span>
                  <ArrowLongUpIcon
                    v-if="activeSortDirection === SortDirection.ASC"
                    class="w-4 h-4 shrink-0"
                  />
                  <ArrowLongDownIcon v-else class="w-4 h-4 shrink-0" />
                </button>
              </template>
              <template #menu-content="{ toggleMenu }">
                <div class="py-4 flex flex-col w-[200px] gap-1">
                  <div class="flex items-center justify-between mb-1 mx-3">
                    <p class="text-s-17 font-medium ml-3 whitespace-nowrap">
                      {{ $t('common.sort_by') }}
                    </p>
                    <app-btn-icon-close @close="toggleMenu" />
                  </div>
                  <hr class="h-px bg-surface-strong border-0 w-full mt-1 mb-2" />
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    :class="[
                      option.value === activeSortValue ? 'bg-page' : '',
                      'flex items-center px-4 py-2.5 mx-3 hoverNoBG rounded-16 min-w-[80px] text-s-15 font-medium whitespace-nowrap',
                    ]"
                    :id="option.value"
                    @click="setActiveSort(option.value)"
                  >
                    <p class="capitalize">{{ option.label }}</p>
                    <div
                      v-if="activeSortValue === option.value"
                      class="ml-auto pl-2"
                    >
                      <ArrowLongUpIcon
                        v-if="activeSortDirection === SortDirection.ASC"
                        class="w-5 h-5 text-brand"
                      />
                      <ArrowLongDownIcon v-else class="w-5 h-5 text-brand" />
                    </div>
                  </button>
                </div>
              </template>
            </app-pop-up-menu>
          </div>
          <div class="h-px bg-surface-strong w-full mb-2"></div>
        </div>

        <!-- Stablecoins & Recently searched, pinned to the top of the results -->
        <div
          v-if="recentlySearchedResults.length || stablecoinResults.length"
          class="mb-3"
        >
          <div v-if="recentlySearchedResults.length" class="mb-3">
            <p class="text-s-12 font-medium text-fg-subtle mb-1.5 px-2">
              {{ $t('select_token.recently_viewed') }}
            </p>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-for="token in recentlySearchedResults"
                :key="`recent-${token.address}`"
                type="button"
                class="flex items-center hoverNoBG bg-page rounded-full py-1 pl-1 pr-3 transition-colors"
                @click="setSelectedToken(token)"
              >
                <app-token-logo
                  :url="token.logoURI"
                  :symbol="token.symbol"
                  :address="
                    networkName
                      ? { address: token.address, network: networkName }
                      : undefined
                  "
                  width="w-6"
                  height="h-6"
                  class="mr-1.5 shrink-0"
                />
                <app-token-symbol
                  :symbol="token.symbol"
                  :address="
                    networkName
                      ? { address: token.address, network: networkName }
                      : undefined
                  "
                />
              </button>
            </div>
          </div>

          <div v-if="stablecoinResults.length">
            <p class="text-s-12 font-medium text-fg-subtle mb-1.5 px-2">
              {{ $t('crypto.stablecoins') }}
            </p>
            <div class="flex items-center gap-1.5 flex-wrap">
              <button
                v-for="token in stablecoinResults"
                :key="`stablecoin-${token.address}`"
                type="button"
                class="flex items-center hoverNoBG bg-page rounded-full py-1 pl-1 pr-3 transition-colors"
                @click="setSelectedToken(token)"
              >
                <app-token-logo
                  :url="token.logoURI"
                  :symbol="token.symbol"
                  :address="
                    networkName
                      ? { address: token.address, network: networkName }
                      : undefined
                  "
                  width="w-6"
                  height="h-6"
                  class="mr-1.5 shrink-0"
                />
                <app-token-symbol
                  :symbol="token.symbol"
                  :address="
                    networkName
                      ? { address: token.address, network: networkName }
                      : undefined
                  "
                />
              </button>
            </div>
          </div>

          <div class="h-px bg-surface-strong w-full mt-3"></div>
        </div>

        <div v-if="enabledResults.length" class="flex flex-col gap-1">
          <button
            v-for="token in enabledResults"
            :key="token.address"
            class="flex items-center justify-between px-2 py-3 cursor-pointer hoverNoBG rounded-20 transition-colors animate-fade-in"
            :class="[
              token.address === selectedToken?.address
                ? '!bg-brand-subtle'
                : 'bg-transparent hoverBGWhite',
            ]"
            @click="setSelectedToken(token)"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <app-token-logo
                  :url="token.logoURI"
                  :symbol="token.symbol"
                  :address="
                    networkName
                      ? { address: token.address, network: networkName }
                      : undefined
                  "
                  class="shrink-0 mr-4"
                />
                <div class="text-left">
                  <app-token-symbol
                    :symbol="token.symbol"
                    :address="
                      networkName
                        ? { address: token.address, network: networkName }
                        : undefined
                    "
                  />
                  <app-tooltip v-if="token.name.length > 10" :text="token.name">
                    <h2 class="text-s-12 text-fg-subtle whitespace-nowrap">
                      {{ truncate(token.name, 20) }}
                    </h2>
                  </app-tooltip>
                  <h2 v-else class="text-s-12 text-fg-subtle whitespace-nowrap">
                    {{ token.name }}
                  </h2>
                </div>
              </div>
              <div v-if="token.price !== 0" class="text-right">
                <div v-if="isFromView && isWalletConnected">
                  <p class="font-medium text-fg">
                    {{ currencySymbol }}
                    {{ formatUsdBalance(token.usd_balance) }}
                  </p>
                  <p class="text-fg-subtle text-s-12">
                    {{ getBalance(token?.balance || '0', token.decimals) }}
                    {{ truncate(token.symbol, 7) }}
                  </p>
                </div>
                <div v-else>
                  <p class="font-medium text-fg">
                    {{ currencySymbol }}
                    {{ token.price ? formatFiat(token.price).value : '0.00' }}
                  </p>
                  <p
                    v-if="
                      isWalletConnected &&
                      token.balance &&
                      token.usd_balance > 0
                    "
                    class="text-fg-subtle text-s-12"
                  >
                    {{ getBalance(token?.balance || '0', token.decimals) }}
                    {{ truncate(token.symbol, 7) }}
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
        <div v-else-if="!disabledResults.length">
          <div class="flex justify-center items-center h-[400px] text-fg-muted">
            <p v-if="searchInput !== ''">
              {{ $t('select_token.no_tokens_match') }}
            </p>
            <p v-else>
              {{ $t('select_token.no_tokens_available') }}
            </p>
          </div>
        </div>

        <!-- Disabled group (e.g. "Trading paused for this session") -->
        <div v-if="disabledResults.length" class="mt-5">
          <p class="text-s-12 font-medium text-fg-subtle mb-2 px-2">
            {{ disabledGroupLabel }}
          </p>
          <div class="flex flex-col gap-1">
            <div
              v-for="token in disabledResults"
              :key="token.address"
              class="flex items-center justify-between px-2 py-3 rounded-20 opacity-50 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <div class="flex items-center">
                <app-token-logo
                  :url="token.logoURI"
                  :symbol="token.symbol"
                  :address="
                    networkName
                      ? { address: token.address, network: networkName }
                      : undefined
                  "
                  class="shrink-0 mr-4"
                />
                <div class="text-left">
                  <app-token-symbol
                    :symbol="token.symbol"
                    :address="
                      networkName
                        ? { address: token.address, network: networkName }
                        : undefined
                    "
                  />
                  <h2 class="text-s-12 text-fg-subtle whitespace-nowrap">
                    {{ truncate(token.name, 20) }}
                  </h2>
                </div>
              </div>
              <div v-if="token.price !== 0" class="text-right">
                <p class="font-medium text-fg">
                  {{ currencySymbol }}
                  {{ token.price ? formatFiat(token.price).value : '0.00' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            v-show="tokens.length > paginatedTokens.length && !searchInput"
            class="h-[44px] w-full sm:max-w-[250px] mx-auto flex items-center justify-center bg-page rounded-full mt-1 mb-5"
            :class="{
              'cursor-pointer': !loadingMoreItems,
            }"
            @click="loadMoreItems"
          >
            <svg
              v-if="loadingMoreItems"
              aria-hidden="true"
              class="w-6 h-6 text-brand animate-spin fill-surface mx-auto"
              viewBox="0 0 100 101"
              width="24"
              height="24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <p v-else class="text-s-15 font-medium text-fg-subtle cursor-pointer">
              {{ $t('common.load_more') }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore'
import { type NewTokenInfo } from '@/composables/useSwap'
import { type Ref, ref, computed, onMounted, watch } from 'vue'
import {
  ChevronDownIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
} from '@heroicons/vue/24/solid'
import BigNumber from 'bignumber.js'
import { storeToRefs } from 'pinia'
import { truncate } from '@/utils/filters'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from './AppSearchInput.vue'
import AppPopUpMenu from './AppPopUpMenu.vue'
import AppBtnIconClose from './AppBtnIconClose.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useRecentlyViewedTokensStore } from '@/stores/recentlyViewedTokensStore'
import { useI18n } from 'vue-i18n'
import { useScroll, refDebounced } from '@vueuse/core'
import AppTokenLogo from './AppTokenLogo.vue'
import { formatUnits } from 'viem'
import AppTokenSymbol from './AppTokenSymbol.vue'
import { analytics, TradeClickSortEvent, SwapClickSortEvent } from '@/analytics'

const props = defineProps({
  selectedToken: {
    type: Object as () => NewTokenInfo,
  },
  externalLoading: {
    type: Boolean,
    default: false,
  },
  chainTokens: {
    type: Array as () => NewTokenInfo[],
    default: () => [],
  },
  isFromView: {
    type: Boolean,
    default: true,
  },
  networkName: {
    type: String,
    required: false,
  },
  sortContext: {
    type: String as () => 'trade' | 'swap' | undefined,
    default: undefined,
  },
  // Token addresses (any case) to render disabled under `disabledGroupTitle`.
  // Generic so Trade (and later Swap) can gray out non-selectable tokens.
  disabledTokens: {
    type: Array as () => string[],
    default: () => [],
  },
  disabledGroupTitle: {
    type: String,
    required: false,
  },
})

const { t } = useI18n()
const { formatFiat, currencySymbol } = useCurrency()
const emit = defineEmits<{
  'update:selectedToken': [token: NewTokenInfo]
  'open:selectToken': [isOpen: boolean]
}>()

const store = useWalletStore()
const {
  isLoadingBalances,
  isWalletConnected,
  allTokens: walletTokens,
} = storeToRefs(store)

const chainsStore = useChainsStore()
const { isLoaded } = storeToRefs(chainsStore)

const recentlyViewedTokensStore = useRecentlyViewedTokensStore()
const { recentlyViewedCrypto } = storeToRefs(recentlyViewedTokensStore)

const isLoading = computed(() => {
  if (isWalletConnected.value) {
    return props.externalLoading || isLoadingBalances.value || !isLoaded.value
  }
  return props.externalLoading || !isLoaded.value
})

const tokens = computed<NewTokenInfo[]>(() => {
  if (!isLoaded.value) return []
  return [...props.chainTokens]
})

const showAllTokens = ref(false)
const searchInput = ref('')
// Debounced query drives the (expensive) sort + fuzzy search so heavy work runs
// after the user pauses typing instead of on every keystroke — the untouched
// `searchInput` keeps the input field responsive.
const debouncedSearchInput = refDebounced(searchInput, 250)
const loadingMoreItems = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollContainer)

onMounted(() => {
  if (!props.isFromView || !isWalletConnected.value) {
    if (
      props.sortContext !== 'trade' ||
      (props.isFromView && !isWalletConnected.value)
    ) {
      activeSortValue.value = SortValueString.RANK
    } else {
      activeSortValue.value = SortValueString.PRICE
      activeSortDirection.value = SortDirection.DESC
    }
  }
})

// Set default token to the top of the sorted list on network change
watch(
  () => props.networkName,
  () => {
    if (tokens.value.length > 0) {
      // Prefer an enabled token; never default-select a disabled one. Fall back
      // to the full list only when nothing is enabled.
      const top = enabledResults.value[0] ?? searchResults.value[0]
      if (top) emit('update:selectedToken', top)
    }
  },
)

watch(
  () => showAllTokens.value,
  () => {
    emit('open:selectToken', showAllTokens.value)
  },
)

// pagination
const endingPagination = ref(100)
const paginatedTokens: Ref<NewTokenInfo[]> = computed(() => {
  return tokens.value.slice(0, endingPagination.value)
})

/** -------------------
 *   Search & Sort
 * -------------------*/
enum SortValueString {
  RANK = 'Rank',
  NAME = 'Name',
  SYMBOL = 'Symbol',
  PRICE = 'Price',
  MARKET_CAP = 'Market Cap',
  VOLUME = '24H Volume',
  USD = 'USD Balance',
  BALANCE = 'Balance',
}

const sortOptions = computed(() => {
  const shared = [
    {
      value: SortValueString.NAME,
      label: t('common.name'),
    },
    {
      value: SortValueString.SYMBOL,
      label: t('common.symbol'),
    },
  ]
  if (props.isFromView || props.sortContext !== 'trade') {
    shared.unshift({
      value: SortValueString.RANK,
      label: t('common.rank'),
    })
  }
  const marketOptions = [
    { value: SortValueString.PRICE, label: t('common.price') },
    { value: SortValueString.MARKET_CAP, label: t('common.market_cap') },
    { value: SortValueString.VOLUME, label: t('common.volume_24h') },
  ]

  if (isWalletConnected.value && props.isFromView) {
    return [
      ...shared,
      { value: SortValueString.USD, label: t('common.usd_balance') },
      { value: SortValueString.BALANCE, label: t('common.balance') },
    ]
  }

  return [...shared, ...marketOptions]
})

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const activeSortValue = ref<SortValueString>(SortValueString.RANK)
const activeSortLabel = computed(() => {
  const option = sortOptions.value.find(o => o.value === activeSortValue.value)
  return option?.label || ''
})
const activeSortDirection = ref<SortDirection>(SortDirection.ASC)

const setActiveSort = (value: SortValueString) => {
  if (props.sortContext === 'trade') {
    analytics.trackTradeClickSortEvent(TradeClickSortEvent, {
      sortOption: value,
      isFromView: props.isFromView,
    })
  } else if (props.sortContext === 'swap') {
    analytics.trackSwapClickSortEvent(SwapClickSortEvent, {
      sortOption: value,
      isFromView: props.isFromView,
    })
  }
  if (value === activeSortValue.value) {
    activeSortDirection.value =
      activeSortDirection.value === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
  } else {
    activeSortValue.value = value
    const isNumericSort = [
      SortValueString.RANK,
      SortValueString.PRICE,
      SortValueString.MARKET_CAP,
      SortValueString.VOLUME,
      SortValueString.USD,
      SortValueString.BALANCE,
    ].includes(value)
    activeSortDirection.value = isNumericSort
      ? SortDirection.DESC
      : SortDirection.ASC
  }
}

interface TokenBalanceWithUsd extends NewTokenInfo {
  usd_balance: number
  market_cap: number
  volume24h: number
}

// Enriched token list (adds usd_balance / market_cap / volume24h). Shared by the
// main search results as well as the trending / recently searched suggestions.
const enrichedTokens = computed<TokenBalanceWithUsd[]>(() => {
  return tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(
        BigNumber(
          token.balance
            ? formatUnits(BigInt(token.balance!), token.decimals)
            : '0',
        ),
      ),
    ).toNumber()
    return {
      ...token,
      usd_balance: usdBalance,
      price: token.price || 0,
      market_cap:
        walletTokens.value.find(
          wt => wt.contract?.toLowerCase() === token.address?.toLowerCase(),
        )?.market_cap ?? 0,
      volume24h:
        walletTokens.value.find(
          wt => wt.contract?.toLowerCase() === token.address?.toLowerCase(),
        )?.volume_24h ?? 0,
    }
  })
})

const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const allItems: TokenBalanceWithUsd[] = enrichedTokens.value

  const sortKeyMap: Record<
    SortValueString,
    { key: keyof TokenBalanceWithUsd; type: 'string' | 'number' }
  > = {
    [SortValueString.RANK]: { key: 'rank', type: 'number' },
    [SortValueString.NAME]: { key: 'name', type: 'string' },
    [SortValueString.SYMBOL]: { key: 'symbol', type: 'string' },
    [SortValueString.PRICE]: { key: 'price', type: 'number' },
    [SortValueString.MARKET_CAP]: { key: 'market_cap', type: 'number' },
    [SortValueString.VOLUME]: { key: 'volume24h', type: 'number' },
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  const sorted =
    type === 'string'
      ? sortObjectArrayString(allItems, key, activeSortDirection.value)
      : sortObjectArrayNumber(allItems, key, activeSortDirection.value)

  if (debouncedSearchInput.value) {
    return fuzzySearchByKeys(
      sorted,
      ['name', 'symbol'],
      debouncedSearchInput.value,
    )
  }

  const enabledSorted = sorted.filter(t => !isTokenDisabled(t))
  const disabledSorted = sorted.filter(t => isTokenDisabled(t))
  const combinedSorted = [...enabledSorted, ...disabledSorted]
  return combinedSorted.slice(0, endingPagination.value)
})

// Disabled-token grouping: split the visible results into the normal
// (selectable) list and a disabled group rendered at the bottom.
const disabledSet = computed(
  () => new Set(props.disabledTokens.map(a => a.toLowerCase())),
)
const isTokenDisabled = (token: NewTokenInfo) =>
  disabledSet.value.has(token.address?.toLowerCase())
const enabledResults = computed(() =>
  searchResults.value.filter(t => !isTokenDisabled(t)),
)
const disabledResults = computed(() =>
  searchResults.value.filter(t => isTokenDisabled(t)),
)
const disabledGroupLabel = computed(
  () => props.disabledGroupTitle || t('trade.trading_paused_session'),
)

// Stablecoins & recently searched suggestions, pinned above the results and
// shown whenever the picker is open (including while the user is searching)
const SUGGESTION_LIMIT = 6

// Well-known stablecoin symbols. The swap token type carries no stablecoin flag,
// so match by symbol to surface them regardless of the connected wallet.
const STABLECOIN_SYMBOLS = new Set([
  'USDT',
  'USDC',
  'DAI',
  'USDE',
  'USDS',
  'PYUSD',
  'FDUSD',
  'TUSD',
  'USDP',
  'GUSD',
  'FRAX',
  'LUSD',
  'USDD',
  'BUSD',
  'USDG',
  'RLUSD',
])

// Stablecoins available on the current chain, most liquid (24H volume) first.
const stablecoinResults = computed<TokenBalanceWithUsd[]>(() => {
  const stables = sortObjectArrayNumber(
    enrichedTokens.value,
    'volume24h',
    SortDirection.DESC,
  ).filter(
    token =>
      STABLECOIN_SYMBOLS.has(token.symbol?.toUpperCase()) &&
      !isTokenDisabled(token),
  )

  // On the "from" (sell) side only surface stables the user actually holds,
  // ordered by holding size — so the category is hidden when you have none.
  if (props.isFromView) {
    return sortObjectArrayNumber(
      stables.filter(token => Number(token.balance ?? 0) > 0),
      'usd_balance',
      SortDirection.DESC,
    ).slice(0, SUGGESTION_LIMIT)
  }

  return stables.slice(0, SUGGESTION_LIMIT)
})

// Recently searched reuses the shared "recently viewed" store, resolving each
// entry against the current chain's tokens (by coingecko id, falling back to
// address) so only selectable tokens are shown.
const recentlySearchedResults = computed<TokenBalanceWithUsd[]>(() => {
  const resolved: TokenBalanceWithUsd[] = []
  const seen = new Set<string>()
  for (const entry of recentlyViewedCrypto.value) {
    if (resolved.length >= SUGGESTION_LIMIT) break
    const match = enrichedTokens.value.find(
      token =>
        (token.cgId && token.cgId === entry.id) ||
        token.address?.toLowerCase() === entry.id?.toLowerCase(),
    )
    if (
      match &&
      !isTokenDisabled(match) &&
      !seen.has(match.address.toLowerCase())
    ) {
      seen.add(match.address.toLowerCase())
      resolved.push(match)
    }
  }
  return resolved
})

const loadMoreItems = () => {
  loadingMoreItems.value = true
  // false loading
  setTimeout(() => {
    loadingMoreItems.value = false
    endingPagination.value += 100
    y.value -= 600
  }, 500)
}

const setSelectedToken = (token: NewTokenInfo) => {
  recentlyViewedTokensStore.addToken({
    id: token.cgId || token.address,
    symbol: token.symbol,
    name: token.name,
    icon: token.logoURI || undefined,
    isStock: false,
  })
  emit('update:selectedToken', token)
  showAllTokens.value = false
}

const formatUsdBalance = (_value: number) => {
  return formatFiat(_value).value
}

const getBalance = (value: string, decimals: number) => {
  return formatFloatingPointValue(formatUnits(BigInt(value), decimals)).value
}
</script>
