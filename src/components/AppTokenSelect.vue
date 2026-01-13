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
        class="w-7 h-7 shrink-0 rounded-full border border-grey-outline mr-2 overflow-hidden flex items-center justify-center"
      >
        <img
          class="w-full h-full object-cover"
          :src="imageReplacer(selectedToken)"
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
                <div
                  class="mr-4 w-9 h-9 shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-button"
                >
                  <img
                    class="w-full h-full object-cover"
                    :src="imageReplacer(token)"
                    alt="token icon"
                  />
                </div>
                <div class="text-left">
                  <app-tooltip v-if="token.name.length > 10" :text="token.name">
                    <h2
                      class="font-medium text-s-15 text-black whitespace-nowrap"
                    >
                      {{ truncate(token.name, 10) }}
                    </h2>
                  </app-tooltip>
                  <h2
                    v-else
                    class="font-medium text-s-15 text-black whitespace-nowrap"
                  >
                    {{ token.name }}
                  </h2>
                  <p class="text-secondary text-s-12 font-normal">
                    {{ getBalance(token.balance) }}
                    <span class="uppercase text-s-12 opacity-60">
                      {{ truncate(token.symbol, 7) }}</span
                    >
                  </p>
                </div>
              </div>
              <div v-if="token.price !== 0" class="text-right">
                <p class="font-normal text-s-14 text-black">
                  $ {{ formatUsdBalance(token.usd_balance) }}
                </p>
                <p class="text-secondary text-s-12 font-normal">
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
import { useWalletStore, MAIN_TOKEN_CONTRACT } from '@/stores/walletStore'
import { type TokenBalance } from '@/mew_api/types'
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
import AppTooltip from '@/components/AppTooltip.vue'
import {
  formatFloatingPointValue,
  formatFiatValue,
} from '@/utils/numberFormatHelper'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { searchArrayByKeysStr } from '@/utils/searchArray'
import { useChainsStore } from '@/stores/chainsStore'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  externalLoading: {
    type: Boolean,
    default: false,
  },
})

const { t } = useI18n()

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

const defaultImg = computed(() => {
  return safeMainTokenBalance.value?.logo_url || eth
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
    [SortValueString.PRICE]: { key: 'price', type: 'number' },
    [SortValueString.USD]: { key: 'usd_balance', type: 'number' },
    [SortValueString.BALANCE]: { key: 'balance', type: 'number' },
  }

  const { key, type } = sortKeyMap[activeSortValue.value]
  const sorted =
    type === 'string'
      ? sortObjectArrayString(items, key, activeSortDirection.value)
      : sortObjectArrayNumber(items, key, activeSortDirection.value)

  if (searchInput.value) {
    return searchArrayByKeysStr(sorted, ['name', 'symbol'], searchInput.value)
  }

  return sorted
})

const setSelectedToken = (token: TokenBalance) => {
  selectedTokenContract.value = token.contract
  showAllTokens.value = false
}

const imageReplacer = (token: TokenBalance) => {
  if (
    !token.logo_url ||
    token.logo_url === 'https://img.mewapi.io/?image=null'
  ) {
    return defaultImg.value
  }
  return token.logo_url
}

const formatUsdBalance = (_value: number) => {
  return formatFiatValue(_value).value
}

const getBalance = (_value: string) => {
  return formatFloatingPointValue(_value).value
}
</script>
