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
      <div
        class="min-w-7 h-7 box-border rounded-full border border-1 border-grey-outline mr-2 overflow-hidden"
      >
        <img
          class="w-7 h-7 rounded-full"
          :src="imageReplacer(selectedToken)"
          width="28"
          height="28"
          alt=""
        />
      </div>
      <p v-if="!isLoading" class="font-medium text-nowrap">
        {{ truncate(selectedToken.symbol, 7) }}
      </p>
      <div class="ml-1 min-w-4 h-4">
        <chevron-down-icon v-if="!isLoading" class="text-info" />
      </div>
    </div>
  </button>
  <app-dialog
    v-model:is-open="showAllTokens"
    :title="$t('select_token.title')"
    class="sm:max-w-[500px] sm:mx-auto"
  >
    <template #content>
      <div
        class="h-[80vh] xs:h-[500px] !overflow-y-scroll px-3 sm:px-7"
        ref="scrollContainer"
      >
        <div class="sticky top-0 bg-white z-10 rounded-b-4xl pt-2 xs:pt-0">
          <div
            class="flex gap-4 justify-between items-center mb-4 bg-surface rounded-full p-1"
          >
            <app-search-input
              v-model="searchInput"
              class="grow"
              :placeholder="$t('select_token.search')"
            />
            <!--SORT-->
            <app-pop-up-menu :placeholder="$t('common.sort')">
              <template #menu-button="{ toggleMenu }">
                <button
                  class="flex items-center px-2 py-2 text-s-15 font-medium hoverNoBG rounded-full"
                  @click="toggleMenu"
                >
                  <span class="mr-2 ml-1">{{ activeSortValue }}</span>
                  <ArrowUpIcon
                    v-if="activeSortDirection === SortDirection.DESC"
                    class="w-4 h-4"
                  />
                  <ArrowDownIcon v-else class="w-4 h-4" />
                </button>
              </template>
              <template #menu-content="{ toggleMenu }">
                <div class="py-4 flex flex-col">
                  <div class="flex items-center justify-between mb-1 mx-3">
                    <p class="text-s-17 font-medium ml-3">
                      {{ $t('common.sort_by') }}
                    </p>
                    <app-btn-icon-close @click="toggleMenu" />
                  </div>
                  <hr class="h-px bg-grey-outline border-0 w-full mt-1 mb-2" />
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    :class="[
                      option.value === activeSortValue ? 'bg-grey-5' : '',
                      'flex items-center px-4 py-2 mx-3 hoverNoBG rounded-16 min-w-[80px] text-s-15 font-medium',
                    ]"
                    :id="option.value"
                    @click="setActiveSort(option.value)"
                  >
                    <p class="capitalize">{{ option.label }}</p>
                    <div
                      v-if="activeSortValue === option.value"
                      class="ml-auto"
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
        </div>

        <div v-if="searchResults.length" class="flex flex-col">
          <button
            v-for="token in searchResults"
            :key="token.address"
            class="flex items-center justify-between px-2 py-3 cursor-pointer hoverNoBG rounded-16"
            @click="setSelectedToken(token)"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <img
                  class="mr-4 w-7 h-7 rounded-full overflow-hidden"
                  :src="imageReplacer(token)"
                  alt="token icon"
                />
                <div class="text-left">
                  <h2>{{ token.name }}</h2>
                  <p class="text-info text-sm">
                    {{ getBalance(token?.balance || '0') }}
                    <span class="uppercase text-xs">
                      {{ truncate(token.symbol, 7) }}</span
                    >
                  </p>
                </div>
              </div>
              <div v-if="token.price !== 0">
                <p class="text-medium">
                  $ {{ formatUsdBalance(token.usd_balance) }}
                </p>
                <p class="text-info text-xs">
                  @ ${{ formatFiatValue(token.price || 0).value }}
                </p>
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
import eth from '@/assets/icons/tokens/eth.svg'
import { truncate } from '@/utils/filters'
import AppDialog from '@/components/AppDialog.vue'
import AppSearchInput from './AppSearchInput.vue'
import AppPopUpMenu from './AppPopUpMenu.vue'
import AppBtnIconClose from './AppBtnIconClose.vue'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { searchArrayByKeysStr } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useI18n } from 'vue-i18n'
import { useScroll } from '@vueuse/core'

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

const defaultImg = computed(() => {
  return eth
})

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
  return [
    {
      value: SortValueString.NAME,
      label: t('common.name'),
    },
    {
      value: SortValueString.SYMBOL,
      label: t('common.symbol'),
    },
    {
      value: SortValueString.PRICE,
      label: t('common.price'),
    },
    {
      value: SortValueString.USD,
      label: t('common.usd_balance'),
    },
    {
      value: SortValueString.BALANCE,
      label: t('common.balance'),
    },
  ]
})

enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

const activeSortValue = ref<SortValueString>(SortValueString.NAME)
const activeSortDirection = ref<SortDirection>(SortDirection.ASC)

const setActiveSort = (value: SortValueString) => {
  if (value === activeSortValue.value) {
    // Toggle direction if the same sort value is clicked
    activeSortDirection.value =
      activeSortDirection.value === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
  } else {
    // Set new sort value and default to ascending direction
    activeSortValue.value = value
    activeSortDirection.value = SortDirection.ASC
  }
}

interface TokenBalanceWithUsd extends NewTokenInfo {
  usd_balance: number
}

/**
 * if searchInput is empty, sort the paginatedItems based on the activeSortValue and activeSortDirection
 * else return search results from all of the tokens
 */
const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const allItems = tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(BigNumber(token.balance ?? '0')),
    ).toNumber()
    return {
      ...token,
      usd_balance: usdBalance, // Add usd_balance to each token
      price: token.price || 0, // Ensure price is defined
    }
  })

  const paginatedItems = paginatedTokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(BigNumber(token.balance ?? '0')),
    ).toNumber()
    return {
      ...token,
      usd_balance: usdBalance, // Add usd_balance to each token
      price: token.price || 0, // Ensure price is defined
    }
  })

  if (!searchInput.value) {
    if (activeSortValue.value === SortValueString.NAME) {
      return sortObjectArrayString(
        paginatedItems,
        'name',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.SYMBOL) {
      return sortObjectArrayString(
        paginatedItems,
        'symbol',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.PRICE) {
      return sortObjectArrayNumber(
        paginatedItems,
        'price',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.USD) {
      return sortObjectArrayNumber(
        paginatedItems,
        'usd_balance',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.BALANCE) {
      return sortObjectArrayNumber(
        paginatedItems,
        'balance',
        activeSortDirection.value,
      )
    }
    return paginatedItems
  }
  return searchArrayByKeysStr(allItems, ['name', 'symbol'], searchInput.value)
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

const imageReplacer = (token: NewTokenInfo) => {
  if (
    !token.logoURI ||
    token.logoURI.includes('null') ||
    token.logoURI.includes('undefined')
  ) {
    return defaultImg.value
  }
  return token.logoURI
}

const formatUsdBalance = (_value: number) => {
  return formatFiatValue(_value).value
}

const getBalance = (_value: string) => {
  return formatFloatingPointValue(_value).value
}
</script>
