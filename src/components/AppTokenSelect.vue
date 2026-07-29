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
        :url="selectedToken.logo_url"
        :alt="selectedToken.symbol"
        width="w-7"
        height="h-7"
        class="mr-2"
        :is-stock="selectedToken.ondo !== undefined"
      />
      <app-token-symbol
        :symbol="selectedToken.symbol"
        :is-stock="selectedToken.ondo !== undefined"
      />
      <div class="ml-1 min-w-4 h-4">
        <chevron-down-icon v-if="!isLoading" class="text-info" />
      </div>
    </div>
  </button>
  <app-dialog
    v-model:is-open="showAllTokens"
    class="w-full sm:w-[460px] sm:mx-auto"
    :title="$t('select_token.title')"
    has-content-gutter
  >
    <template #content>
      <div
        class="min-h-[500px] max-h-[80vh] xs:max-h-[500px] mb-6 overflow-y-auto mew-scrollbar px-1"
      >
        <div class="sticky top-0 bg-white z-20 pt-4">
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
                  class="flex items-center px-4 py-2 text-s-15 font-medium hoverNoBG rounded-full bg-white h-10 shadow-sm whitespace-nowrap min-w-[100px] justify-center mr-1"
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
                  <hr class="h-px bg-grey-10 border-0 w-full mt-1 mb-2" />
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
                      <ArrowLongDownIcon v-else class="w-5 h-5 text-primary" />
                    </div>
                  </button>
                </div>
              </template>
            </app-pop-up-menu>
          </div>
          <div class="h-px bg-grey-10 w-full mb-2"></div>
        </div>

        <div v-if="searchResults.length" class="flex flex-col gap-1">
          <button
            v-for="token in searchResults"
            :key="token.contract"
            class="flex items-center justify-between px-4 py-3 cursor-pointer hoverNoBG rounded-20 transition-colors animate-fade-in"
            :class="[
              token.contract === selectedTokenContract
                ? 'bg-mewBg'
                : 'bg-transparent hoverBGWhite',
            ]"
            @click="setSelectedToken(token)"
          >
            <div class="flex justify-between items-center w-full">
              <div class="flex items-center">
                <app-token-logo
                  :url="token.logo_url"
                  :alt="token.symbol"
                  :is-stock="token.ondo !== undefined"
                  class="mr-4"
                />
                <div class="text-left">
                  <app-token-symbol
                    :symbol="token.symbol"
                    :is-stock="token.ondo !== undefined"
                  />
                  <app-tooltip
                    v-if="getName(token).length > 10"
                    :text="getName(token)"
                  >
                    <h2 class="text-s-12 text-info whitespace-nowrap">
                      {{ truncate(getName(token), 10) }}
                    </h2>
                  </app-tooltip>
                  <h2 v-else class="text-s-12 text-info whitespace-nowrap">
                    {{ getName(token) }}
                  </h2>
                </div>
              </div>
              <div v-if="token.price !== 0" class="text-right">
                <p class="font-normal text-s-14 text-black">
                  {{ currencySymbol }} {{ formatUsdBalance(token.usd_balance) }}
                </p>
                <div class="flex item-center justify-end gap-1">
                  <p class="text-info text-s-12 font-normal">
                    {{ getBalance(token.balance) }}
                  </p>
                  <app-token-symbol
                    :symbol="token.symbol"
                    :is-stock="token.ondo !== undefined"
                    :has-gradient="false"
                    class="text-info !text-s-12 font-normal"
                  />
                </div>
              </div>
            </div>
          </button>
        </div>
        <div v-else>
          <div class="flex justify-center items-center h-[400px] text-info">
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
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { type TokenBalance } from '@/mew_api/types'
import { ref, computed, onMounted, watch } from 'vue'
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
import AppTokenLogo from './AppTokenLogo.vue'
import AppTokenSymbol from './AppTokenSymbol.vue'
import { formatFloatingPointValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { fuzzySearchByKeys } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  externalLoading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()
const { formatFiat, currencySymbol } = useCurrency()

const store = useWalletStore()
const {
  isLoadingBalances,
  tokens: erc20Tokens,
  safeMainTokenBalance,
} = storeToRefs(store)

const chainsStore = useChainsStore()
const { isLoaded } = storeToRefs(chainsStore)

const isLoading = computed(() => {
  return props.externalLoading || isLoadingBalances.value || !isLoaded.value
})

const tokens = computed<TokenBalance[]>(() => {
  if (!isLoaded.value || safeMainTokenBalance.value === null) return []
  return [safeMainTokenBalance.value, ...erc20Tokens.value]
})

const selectedTokenContract = defineModel<string>('selectedTokenContract')

const selectedToken = computed<TokenBalance | null>(() => {
  return store.getTokenBalance(
    selectedTokenContract.value || MAIN_TOKEN_CONTRACT,
  )
})

const showAllTokens = ref(false)
const searchInput = ref('')

onMounted(() => {
  if (tokens.value.length > 0) setSelectedToken(tokens.value[0])
})

/** -------------------
 *   Search & Sort
 * -------------------*/
enum SortValueString {
  NAME = 'Name',
  SYMBOL = 'Symbol',
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

const activeSortValue = ref<SortValueString>(SortValueString.USD)
const activeSortDirection = ref<SortDirection>(SortDirection.DESC)
const activeSortLabel = computed(() => {
  const option = sortOptions.value.find(
    option => option.value === activeSortValue.value,
  )
  return option ? option.label : ''
})

const setActiveSort = (value: SortValueString) => {
  if (value === activeSortValue.value) {
    activeSortDirection.value =
      activeSortDirection.value === SortDirection.ASC
        ? SortDirection.DESC
        : SortDirection.ASC
  } else {
    activeSortValue.value = value
    const isNumericSort = [
      SortValueString.USD,
      SortValueString.BALANCE,
    ].includes(value)
    activeSortDirection.value = isNumericSort
      ? SortDirection.DESC
      : SortDirection.ASC
  }
}

interface TokenBalanceWithUsd extends TokenBalance {
  usd_balance: number
}
const searchResults = computed<TokenBalanceWithUsd[]>(() => {
  const items = tokens.value.map(token => {
    const usdBalance = BigNumber(
      BigNumber(token.price || 0).times(BigNumber(token.balance)),
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
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  const sorted =
    type === 'string'
      ? sortObjectArrayString(items, key, activeSortDirection.value)
      : sortObjectArrayNumber(items, key, activeSortDirection.value)

  if (searchInput.value) {
    return fuzzySearchByKeys(sorted, ['name', 'symbol'], searchInput.value)
  }

  return sorted
})

const setSelectedToken = (token: TokenBalance) => {
  selectedTokenContract.value = token.contract
  showAllTokens.value = false
}

const formatUsdBalance = (_value: number) => {
  return formatFiat(_value).value
}

const getBalance = (_value: string) => {
  return formatFloatingPointValue(_value).value
}

const getName = (token: TokenBalance): string => {
  return token.ondo?.stockAlias ? token.ondo.stockAlias : token.name
}

const emit = defineEmits<{
  'open:selectToken': [isOpen: boolean]
}>()
watch(
  () => showAllTokens.value,
  () => {
    emit('open:selectToken', showAllTokens.value)
  },
)
</script>
