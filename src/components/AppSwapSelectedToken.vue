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
      <div class="h-[80vh] xs:h-[500px] !overflow-y-scroll px-3 sm:px-7">
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
      </div>
    </template>
  </app-dialog>
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/walletStore'
import { type NewTokenInfo } from '@/composables/useSwap'
import { ref, computed, onMounted } from 'vue'
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
const { isLoadingBalances } = storeToRefs(store)

const chainsStore = useChainsStore()
const { isLoaded } = storeToRefs(chainsStore)

const isLoading = computed(() => {
  return props.externalLoading || isLoadingBalances.value || !isLoaded.value
})

const tokens = computed<NewTokenInfo[]>(() => {
  if (!isLoaded.value) return []
  return [...props.chainTokens]
})

const showAllTokens = ref(false)
const searchInput = ref('')

const defaultImg = computed(() => {
  return eth
})

onMounted(() => {
  if (tokens.value.length > 0) setSelectedToken(tokens.value[0])
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
const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const items = tokens.value.map(token => {
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
      return sortObjectArrayString(items, 'name', activeSortDirection.value)
    }
    if (activeSortValue.value === SortValueString.SYMBOL) {
      return sortObjectArrayString(items, 'symbol', activeSortDirection.value)
    }
    if (activeSortValue.value === SortValueString.PRICE) {
      return sortObjectArrayNumber(items, 'price', activeSortDirection.value)
    }
    if (activeSortValue.value === SortValueString.USD) {
      return sortObjectArrayNumber(
        items,
        'usd_balance',
        activeSortDirection.value,
      )
    }
    if (activeSortValue.value === SortValueString.BALANCE) {
      return sortObjectArrayNumber(items, 'balance', activeSortDirection.value)
    }
    return items
  }
  return searchArrayByKeysStr(items, ['name', 'symbol'], searchInput.value)
})

const setSelectedToken = (token: NewTokenInfo) => {
  emit('update:selectedToken', token)
  showAllTokens.value = false
}

const imageReplacer = (token: NewTokenInfo) => {
  if (!token.logoURI || token.logoURI === 'https://img.mewapi.io/?image=null') {
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
