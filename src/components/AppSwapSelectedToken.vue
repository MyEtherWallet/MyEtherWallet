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
        width="w-7"
        height="h-7"
        class="mr-2"
      />
      <app-token-symbol v-if="!isLoading" :symbol="selectedToken.symbol" />
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
          <div
            class="flex gap-2 justify-between items-center mb-2 bg-mewBg rounded-full p-1"
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
                  class="flex items-center px-4 py-2 text-s-15 font-medium hoverNoBG rounded-full bg-white h-10 shadow-sm whitespace-nowrap min-w-[100px] justify-center"
                  @click="toggleMenu"
                >
                  <span class="mr-2">{{ activeSortValue }}</span>
                  <ArrowUpIcon
                    v-if="activeSortDirection === SortDirection.DESC"
                    class="w-4 h-4 shrink-0"
                  />
                  <ArrowDownIcon v-else class="w-4 h-4 shrink-0" />
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
                  <hr class="h-px bg-grey-outline border-0 w-full mt-1 mb-2" />
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
                      <ArrowUpIcon
                        v-if="activeSortDirection === SortDirection.DESC"
                        class="w-5 h-5 text-primary"
                      />
                      <ArrowDownIcon v-else class="w-5 h-5 text-primary" />
                    </div>
                  </button>
                </div>
              </template>
            </app-pop-up-menu>
          </div>
          <div class="h-px bg-grey-outline w-full mb-2"></div>
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
                  class="shrink-0 mr-4"
                />
                <div class="text-left">
                  <app-token-symbol :symbol="token.symbol" />
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
                <div v-if="isFromView">
                  <p class="font-medium text-black">
                    $ {{ formatUsdBalance(token.usd_balance) }}
                  </p>
                  <p class="text-info text-s-12">
                    {{ getBalance(token?.balance || '0') }}
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
            v-show="tokens.length > paginatedTokens.length"
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
import { type Ref, ref, computed, onMounted } from 'vue'
import {
  ChevronDownIcon,
  ArrowDownIcon,
  ArrowUpIcon,
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
import { searchArrayByKeysStr } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useI18n } from 'vue-i18n'
import { useScroll } from '@vueuse/core'
import AppTokenLogo from './AppTokenLogo.vue'
import AppTokenSymbol from './AppTokenSymbol.vue'

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
})

const { t } = useI18n()
const emit = defineEmits(['update:selectedToken'])

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

onMounted(() => {
  if (tokens.value.length > 0) setSelectedToken(tokens.value[0])
})

// pagination
const endingPagination = ref(100)
const paginatedTokens: Ref<NewTokenInfo[]> = computed(() => {
  return tokens.value.slice(0, endingPagination.value)
})

/** -------------------
 *   Search & Sort
 * -------------------*/
enum SortValueString {
  NAME = 'Name',
  SYMBOL = 'Symbol',
  PRICE = 'Price',
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
  if (props.isFromView) {
    return [
      ...shared,
      {
        value: SortValueString.USD,
        label: t('common.usd_balance'),
      },
      {
        value: SortValueString.BALANCE,
        label: t('common.balance'),
      },
    ]
  }
  return [
    ...shared,
    {
      value: SortValueString.PRICE,
      label: t('common.price'),
    },
  ]
})

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const activeSortValue = ref<SortValueString>(SortValueString.USD)
const activeSortDirection = ref<SortDirection>(SortDirection.ASC)

const setActiveSort = (value: SortValueString) => {
  if (value === activeSortValue.value) {
    activeSortDirection.value =
      activeSortDirection.value === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
  } else {
    activeSortValue.value = value
    const isNumericSort = [
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
}

const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const allItems = tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(BigNumber(token.balance ?? '0')),
    ).toNumber()
    return {
      ...token,
      usd_balance: usdBalance,
      price: token.price || 0,
    }
  })

  const sortKeyMap: Record<
    SortValueString,
    { key: keyof TokenBalanceWithUsd; type: 'string' | 'number' }
  > = {
    [SortValueString.NAME]: { key: 'name', type: 'string' },
    [SortValueString.SYMBOL]: { key: 'symbol', type: 'string' },
    [SortValueString.PRICE]: { key: 'price', type: 'number' },
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  const sorted =
    type === 'string'
      ? sortObjectArrayString(allItems, key, activeSortDirection.value)
      : sortObjectArrayNumber(allItems, key, activeSortDirection.value)

  if (searchInput.value) {
    return searchArrayByKeysStr(sorted, ['name', 'symbol'], searchInput.value)
  }

  return sorted.slice(0, endingPagination.value)
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

const getBalance = (_value: string) => {
  return formatFloatingPointValue(_value).value
}
</script>
