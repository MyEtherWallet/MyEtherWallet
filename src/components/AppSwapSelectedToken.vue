<template>
  <button
    :class="[
      isLoading || !selectedToken
        ? 'bg-grey-10 animate-pulse min-w-[120px]'
        : 'bg-white hoverNoBG shadow-button border-grey-10 border',
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
        <chevron-down-icon v-if="!isLoading" class="text-info" />
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
        class="min-h-[500px] max-h-[80vh] xs:max-h-[500px] pb-6 overflow-y-auto mew-scrollbar"
        ref="scrollContainer"
      >
        <div class="sticky top-0 bg-white z-20 pt-2">
          <div class="relative">
            <div
              class="flex gap-2 justify-between items-center mb-2 bg-mewBg rounded-full p-1"
            >
              <div ref="searchFocusTarget" class="grow">
                <app-search-input
                  v-model="searchInput"
                  class="w-full"
                  bg-class="bg-transparent"
                  :placeholder="$t('select_token.search')"
                />
              </div>
              <!--SORT-->
              <app-pop-up-menu :placeholder="$t('common.sort')">
                <template #menu-button="{ toggleMenu }">
                  <button
                    class="flex items-center px-4 py-2 text-s-15 font-medium hoverNoBG rounded-full bg-white h-10 shadow-sm whitespace-nowrap min-w-[100px] justify-center"
                    @click="toggleMenu"
                  >
                    <span class="mr-2">{{ activeSortValue }}</span>
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
                    <button
                      v-for="option in sortOptions"
                      :key="option.value"
                      :class="[
                        option.value === activeSortValue ? 'bg-grey-5' : '',
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
                          class="w-5 h-5 text-primary"
                        />
                        <ArrowLongDownIcon
                          v-else
                          class="w-5 h-5 text-primary"
                        />
                      </div>
                    </button>
                  </div>
                </template>
              </app-pop-up-menu>
            </div>
            <!-- Trending & Stablecoins dropdown -->
            <transition name="fade" mode="out-in">
              <div
                v-if="showSearchDropdown"
                class="absolute bottom-0 left-0 w-full bg-white rounded-20 shadow-2xl border border-grey-outline px-4 py-4 translate-y-full z-30"
                @mousedown.prevent
              >
                <div v-if="trendingTokens.length" class="mb-3">
                  <p class="text-s-12 font-medium text-info mb-2">Trending</p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="token in trendingTokens"
                      :key="token.address"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-grey-10 bg-white hoverNoBG shadow-sm text-s-13 font-medium transition-colors"
                      :class="
                        token.address === selectedToken?.address
                          ? '!bg-mewBg border-primary'
                          : ''
                      "
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
                        width="w-5"
                        height="h-5"
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
                <div
                  v-if="trendingTokens.length && stablecoinTokens.length"
                  class="h-px bg-grey-outline w-full mb-3"
                ></div>
                <div v-if="stablecoinTokens.length">
                  <p class="text-s-12 font-medium text-info mb-2">
                    Stablecoins
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="token in stablecoinTokens"
                      :key="token.address"
                      class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-grey-10 bg-white hoverNoBG shadow-sm text-s-13 font-medium transition-colors"
                      :class="
                        token.address === selectedToken?.address
                          ? '!bg-mewBg border-primary'
                          : ''
                      "
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
                        width="w-5"
                        height="h-5"
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
              </div>
            </transition>
          </div>
          <div class="h-px bg-grey-10 w-full mb-2"></div>
        </div>

        <div v-if="searchResults.length" class="flex flex-col gap-1">
          <button
            v-for="token in searchResults"
            :key="token.address"
            class="flex items-center justify-between px-2 py-3 cursor-pointer hoverNoBG rounded-20 transition-colors animate-fade-in"
            :class="[
              token.address === selectedToken?.address
                ? '!bg-mewBg'
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
                    <h2 class="text-s-12 text-info whitespace-nowrap">
                      {{ truncate(token.name, 20) }}
                    </h2>
                  </app-tooltip>
                  <h2 v-else class="text-s-12 text-info whitespace-nowrap">
                    {{ token.name }}
                  </h2>
                </div>
              </div>
              <div v-if="token.price !== 0" class="text-right">
                <div v-if="isFromView && isWalletConnected">
                  <p class="font-medium text-black">
                    $ {{ formatUsdBalance(token.usd_balance) }}
                  </p>
                  <p class="text-info text-s-12">
                    {{ getBalance(token?.balance || '0', token.decimals) }}
                    {{ truncate(token.symbol, 7) }}
                  </p>
                </div>
                <div v-else>
                  <p class="font-medium text-black">
                    $
                    {{
                      token.price ? formatFiatValue(token.price).value : '0.00'
                    }}
                  </p>
                  <p
                    v-if="
                      isWalletConnected &&
                      token.balance &&
                      token.usd_balance > 0
                    "
                    class="text-info text-s-12"
                  >
                    {{ getBalance(token?.balance || '0', token.decimals) }}
                    {{ truncate(token.symbol, 7) }}
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
        <div v-else>
          <div class="flex justify-center items-center h-[400px] text-grey-30">
            <p v-if="searchInput !== ''">
              {{ $t('select_token.no_tokens_match') }}
            </p>
            <p v-else>
              {{ $t('select_token.no_tokens_available') }}
            </p>
          </div>
        </div>
        <div>
          <div
            v-show="tokens.length > paginatedTokens.length && !searchInput"
            class="h-[44px] w-full sm:max-w-[250px] mx-auto flex items-center justify-center bg-grey-5 rounded-full mt-1 mb-5"
            :class="{
              'cursor-pointer': !loadingMoreItems,
            }"
            @click="loadMoreItems"
          >
            <svg
              v-if="loadingMoreItems"
              aria-hidden="true"
              class="w-6 h-6 text-primary animate-spin fill-white mx-auto"
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
            <p v-else class="text-s-15 font-medium text-grey-70 cursor-pointer">
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
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useI18n } from 'vue-i18n'
import { useScroll, useFocusWithin } from '@vueuse/core'
import AppTokenLogo from './AppTokenLogo.vue'
import { formatUnits } from 'viem'
import AppTokenSymbol from './AppTokenSymbol.vue'
import { analytics, TradeClickSortEvent, SwapClickSortEvent } from '@/analytics'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import type { GetWebTokensTableResponse } from '@/mew_api/types'

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
  trendingAddresses: {
    type: Array as () => string[],
    default: () => [],
  },
})

const STABLECOIN_SYMBOLS = new Set([
  'USDC',
  'USDT',
  'DAI',
  'BUSD',
  'TUSD',
  'FRAX',
  'USDD',
  'USDP',
  'GUSD',
  'LUSD',
  'SUSD',
  'MIM',
  'CUSD',
  'AGEUR',
  'EURS',
  'EURT',
  'FDUSD',
  'PYUSD',
])

const { t } = useI18n()
const emit = defineEmits<{
  'update:selectedToken': [token: NewTokenInfo]
  'open:selectToken': [isOpen: boolean]
}>()

const store = useWalletStore()
const { isLoadingBalances, isWalletConnected } = storeToRefs(store)

const chainsStore = useChainsStore()
const { isLoaded } = storeToRefs(chainsStore)

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
const loadingMoreItems = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollContainer)

const searchFocusTarget = ref<HTMLElement | null>(null)
const { focused: searchFocused } = useFocusWithin(searchFocusTarget)
const showSearchDropdown = computed(
  () => searchFocused.value && !searchInput.value && !props.isFromView,
)

onMounted(() => {
  if (!props.isFromView || !isWalletConnected.value) {
    if (props.sortContext !== 'trade') {
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
      const top = searchResults.value[0]
      if (top) emit('update:selectedToken', top)
    }
  },
)

watch(
  () => showAllTokens.value,
  isOpen => {
    emit('open:selectToken', isOpen)
    if (isOpen && !props.isFromView && props.networkName) {
      fetchMarketData()
    }
  },
)

// Market data for to-token sort (marketCap, totalVolume)
const { useMEWFetch } = useFetchMewApi()
// address (lowercase) → { marketCap, totalVolume }
const marketDataMap = ref<
  Record<string, { marketCap: number | null; totalVolume: number | null }>
>({})

const fetchMarketData = async () => {
  if (!props.networkName) return
  const { data, onFetchResponse } = useMEWFetch(
    `/v1/web/tokens-table?filterChain=${props.networkName}&perPage=200&sort=MARKET_CAP_DESC`,
  )
    .get()
    .json<GetWebTokensTableResponse>()
  onFetchResponse(() => {
    if (!data.value) return
    const map: Record<
      string,
      { marketCap: number | null; totalVolume: number | null }
    > = {}
    for (const item of data.value.items) {
      const chainAddresses = item.addresses as Record<string, string>
      const addr = chainAddresses[props.networkName!]
      if (addr) {
        map[addr.toLowerCase()] = {
          marketCap: item.marketCap,
          totalVolume: item.totalVolume,
        }
      }
    }
    marketDataMap.value = map
  })
}

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
  USD = 'USD Balance',
  BALANCE = 'Balance',
  MARKET_CAP = 'Market Cap',
  VOLUME = '24h Volume',
}

const sortOptions = computed(() => {
  const shared = [
    { value: SortValueString.RANK, label: t('common.rank') },
    { value: SortValueString.NAME, label: t('common.name') },
    { value: SortValueString.SYMBOL, label: t('common.symbol') },
  ]

  if (!props.isFromView) {
    return [
      ...shared,
      { value: SortValueString.PRICE, label: t('common.price') },
      { value: SortValueString.MARKET_CAP, label: 'Market Cap' },
      { value: SortValueString.VOLUME, label: '24h Volume' },
    ]
  }

  if (isWalletConnected.value) {
    return [
      ...shared,
      { value: SortValueString.USD, label: t('common.usd_balance') },
      { value: SortValueString.BALANCE, label: t('common.balance') },
    ]
  }
  if (props.isFromView || props.sortContext !== 'trade') {
    shared.unshift({
      value: SortValueString.RANK,
      label: t('common.rank'),
    })
  }
  return [...shared, { value: SortValueString.PRICE, label: t('common.price') }]
})

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const activeSortValue = ref<SortValueString>(SortValueString.RANK)
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
  rank: number
  marketCap: number | null
  totalVolume: number | null
}

const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const allItems = tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(
        BigNumber(
          token.balance
            ? formatUnits(BigInt(token.balance!), token.decimals)
            : '0',
        ),
      ),
    ).toNumber()
    const md = marketDataMap.value[token.address.toLowerCase()]
    return {
      ...token,
      usd_balance: usdBalance,
      price: token.price || 0,
      rank: token.rank ?? 0,
      marketCap: md?.marketCap ?? null,
      totalVolume: md?.totalVolume ?? null,
    }
  })

  const isMarketDataSort =
    activeSortValue.value === SortValueString.MARKET_CAP ||
    activeSortValue.value === SortValueString.VOLUME
  const filteredItems = isMarketDataSort
    ? allItems.filter(t => t.marketCap !== null || t.totalVolume !== null)
    : allItems

  const sortKeyMap: Record<
    SortValueString,
    { key: keyof TokenBalanceWithUsd; type: 'string' | 'number' }
  > = {
    [SortValueString.RANK]: { key: 'rank', type: 'number' },
    [SortValueString.NAME]: { key: 'name', type: 'string' },
    [SortValueString.SYMBOL]: { key: 'symbol', type: 'string' },
    [SortValueString.PRICE]: { key: 'price', type: 'number' },
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
    [SortValueString.MARKET_CAP]: { key: 'marketCap', type: 'number' },
    [SortValueString.VOLUME]: { key: 'totalVolume', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  const sorted =
    type === 'string'
      ? sortObjectArrayString(filteredItems, key, activeSortDirection.value)
      : sortObjectArrayNumber(filteredItems, key, activeSortDirection.value)

  if (searchInput.value) {
    return fuzzySearchByKeys(sorted, ['name', 'symbol'], searchInput.value)
  }

  return sorted.slice(0, endingPagination.value)
})

const trendingTokens = computed<TokenBalanceWithUsd[]>(() => {
  const trendingSet = new Set(props.trendingAddresses.map(a => a.toLowerCase()))
  return tokens.value
    .filter(t => trendingSet.has(t.address.toLowerCase()))
    .slice(0, 4)
    .map((token, index) => ({
      ...token,
      usd_balance: 0,
      price: token.price || 0,
      rank: index,
      marketCap: null,
      totalVolume: null,
    }))
})

const stablecoinTokens = computed<TokenBalanceWithUsd[]>(() => {
  return tokens.value
    .filter(t => STABLECOIN_SYMBOLS.has(t.symbol.toUpperCase()))
    .slice(0, 4)
    .map((token, index) => ({
      ...token,
      usd_balance: 0,
      price: token.price || 0,
      rank: index,
      marketCap: null,
      totalVolume: null,
    }))
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
  emit('update:selectedToken', token)
  showAllTokens.value = false
}

const formatUsdBalance = (_value: number) => {
  return formatFiatValue(_value).value
}

const getBalance = (value: string, decimals: number) => {
  return formatFloatingPointValue(formatUnits(BigInt(value), decimals)).value
}
</script>
