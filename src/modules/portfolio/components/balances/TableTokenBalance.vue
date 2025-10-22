<template>
  <div v-if="isWalletConnected">
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between px-2 py-2 mb-4 sm:gap-6"
    >
      <div
        class="flex grow justify-between items-center bg-surface rounded-full p-1 max-w-[500px] order-3 order-2 sm:order-1 gap-1"
      >
        <app-search-input v-model="searchInput" class="grow" />
        <app-select
          v-model:selected="selectedAllTokensFilter"
          :options="allTokensFilterOptions"
          position="-right-1"
          class="text-s-12"
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="rounded-full hoverNoBG p-2 min-w-[150px]"
              @click="toggleSelect"
            >
              <div class="flex items-center justify-between">
                <span>{{ selectedAllTokensFilter.label }}</span>
                <chevron-down-icon class="w-4 h-4 ml-1" />
              </div>
            </button>
          </template>
        </app-select>
      </div>
      <!-- TOTAL VALUE-->
      <div class="order-1 sm:order-2 mb-3 sm:mb-0 ml-2 sm:ml-0">
        <p
          class="font-bold text-info uppercase tracking-sp-06 text-s-14 sm:text-right"
        >
          Total Value
        </p>
        <p v-if="!isLoading" class="text-s-20 font-bold sm:text-right">
          {{ totalValue }}
        </p>
        <div
          v-else
          class="bg-grey-10 animate-pulse min-w-[120px] h-[30px]"
        ></div>
      </div>
    </div>
    <div :class="['static', getTableHeight]" ref="tableContainer">
      <table class="w-full text-sm table-fixed">
        <!-- Header-->
        <thead class="bg-white">
          <tr class="text-left text-s-11 uppercase text-info tracking-sp-06">
            <!-- Watchlist -->
            <th class="hidden xs:table-cell xs:w-10"></th>
            <!-- Name & Balance -->
            <th
              class="cursor-pointer px-1 py-2 hover:text-black transition-colors"
              colspan="2"
            >
              <div
                class="flex items-center gap-1 ml-11"
                :class="{
                  'text-black': headerSort === SortValueString.NAME,
                }"
                @click="setHeaderSort(SortValueString.NAME)"
              >
                Token
                <arrow-long-up-icon
                  class="w-3 h-3"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'asc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'desc'
                  "
                />
              </div>
            </th>
            <!-- 24h % -->
            <th
              class="hidden xs:table-cell w-[60px] md:w-[80px] cursor-pointer px-1 py-2 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative"
                :class="{
                  'text-black': headerSort === SortValueString.PERCENT,
                }"
                @click="setHeaderSort(SortValueString.PERCENT)"
              >
                24h
                <arrow-long-up-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'asc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'desc'
                  "
                />
              </div>
            </th>
            <!-- Market Cap -->
            <th
              class="hidden md:table-cell cursor-pointer px-1 py-2 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative"
                :class="{
                  'text-black': headerSort === SortValueString.MARKET_CAP,
                }"
                @click="setHeaderSort(SortValueString.MARKET_CAP)"
              >
                Market Cap
                <arrow-long-up-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'asc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'desc'
                  "
                />
              </div>
            </th>
            <!-- Value and Price -->
            <th
              class="cursor-pointer px-1 py-2 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative text-right"
                :class="{
                  'text-black': headerSort === SortValueString.MARKET_CAP,
                }"
                @click="setHeaderSort(SortValueString.MARKET_CAP)"
              >
                Value
                <arrow-long-up-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'asc'
                  "
                />
                <arrow-long-down-icon
                  class="w-3 h-3 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'desc'
                  "
                />
              </div>
            </th>
            <!-- Actions -->
            <th
              class="lg:pl-1 lg:pr-3 py-2 text-right w-8 sm:w-16 lg:w-auto"
              :class="isOpenSideMenu ? 'xl:w-[160px] 2xl:w-auto' : ''"
            >
              <p class="hidden lg:block">Actions</p>
            </th>
          </tr>
        </thead>
        <!-- Body-->
        <tbody v-if="!isLoading">
          <div
            v-if="
              watchListedTokens.length === 0 &&
              selectedAllTokensFilter.value === 'watchlist'
            "
            class="text-nowrap px-3"
          >
            <h3>No watchlisted tokens</h3>
          </div>
          <tr
            v-for="token in paginatedArray"
            :key="token.name + token.marketCap + token.coinId + token.contract"
            class="h-14 md:hoverBGWhite cursor-pointer"
            @click="goToTokenPage(token)"
          >
            <!-- Watchlist -->
            <td class="hidden xs:table-cell xs:pr-2 rounded-l-12">
              <button
                v-if="token.coinId"
                @click.stop="setWatchlistToken(token.coinId)"
                class="p-2 text-black rounded-full hover:bg-grey-5 transition-colors duration-300 ease-in-out"
              >
                <!-- changes color when active -->
                <star-outline-icon
                  class="h-4 w-4 cursor-pointer"
                  v-if="!isWatchListed(token.coinId)"
                />
                <star-solid-icon v-else class="h-4 w-4 cursor-pointer" />
              </button>
            </td>
            <!-- Name & Balance -->
            <td class="px-1 py-2" colspan="2">
              <router-link
                :to="{
                  name: TOKEN_INFO_ROUTE_NAMES.crypto,
                  params: {
                    tokenId: token.coinId,
                  },
                }"
                class="flex items-center gap-3"
              >
                <app-token-logo
                  :url="token.logo_url"
                  :symbol="token.symbol"
                  class="inline-block rounded-full shadow-token"
                />
                <div class="truncate">
                  <p class="truncate">{{ token.name }}</p>
                  <p class="text-info text-s-12 uppercase">
                    {{ formatFloatingPointValue(token.balance).value }}
                    {{ truncate(token.symbol, 7) }}
                  </p>
                </div>
              </router-link>
            </td>
            <!-- 24h % -->
            <td
              class="hidden xs:table-cell w-[80px] px-1 py-1 text-right text-s-11 leading-p-100"
              :class="[
                token.percentChange24h
                  ? parsePercent(token.percentChange24h).includes('-')
                    ? 'text-error'
                    : 'text-success'
                  : 'text-black',
              ]"
            >
              <div>
                <p>
                  {{
                    token.percentChange24h
                      ? parsePercent(token.percentChange24h)
                      : '-'
                  }}
                </p>
                <div v-if="getSparkLinePoints().length === 0"></div>
                <table-sparkline
                  v-else
                  :points="getSparkLinePoints()"
                  :width="50"
                  :height="35"
                  :max-points="35"
                />
              </div>
            </td>
            <!-- MarketCap -->
            <td class="hidden md:table-cell px-1 py-2 text-right">
              {{
                token.marketCap
                  ? `$${formatFiatValue(token.marketCap).value}`
                  : '-'
              }}
            </td>
            <!-- Value -->
            <td class="px-1 py-2 text-right">
              <p>${{ getFiatValue(token) }}</p>
              <p class="text-info text-s-12">
                @ ${{ token.price ? formatFiatValue(token.price).value : '-' }}
              </p>
            </td>
            <!-- Actions -->
            <td class="lg:pl-1 lg:pr-2 py-2 rounded-r-12 relative">
              <div
                class="flex items-center justify-end lg:hidden -mr-1 md:mr-0"
              >
                <app-pop-up-menu placeholder="actions menu" location="right">
                  <template #menu-button="{ toggleMenu }">
                    <app-btn-icon
                      label="action menu"
                      @click.stop="toggleMenu"
                      height="h-7 xs:h-8"
                      width="w-7 xs:w-8"
                    >
                      <ellipsis-vertical-icon class="w-5 h-5" />
                    </app-btn-icon>
                  </template>
                  <template #menu-content="{ toggleMenu }">
                    <div
                      class="px-2 py-3 max-w-full bg-white rounded-xl min-w-[240px]"
                    >
                      <div
                        v-if="token.coinId"
                        class="xs:hidden flex items-center p-2"
                      >
                        <star-outline-icon
                          class="h-4 w-4 cursor-pointer"
                          v-if="!isWatchListed(token.coinId)"
                        />
                        <star-solid-icon
                          v-else
                          class="h-4 w-4 cursor-pointer"
                        />
                        <span class="ml-2">{{
                          isWatchListed(token.coinId)
                            ? 'Remove from Watchlist'
                            : 'Add to Watchlist'
                        }}</span>
                      </div>
                      <hr
                        class="h-px bg-grey-outline border-0 w-full my-2 xs:hidden"
                      />

                      <ul>
                        <li
                          @click.stop="toggleMenu"
                          class="p-2 flex items-center"
                        >
                          <icon-buy class="text-primary w-4 h-4 mr-2" />
                          <p>Buy</p>
                        </li>
                        <li
                          @click.stop="toggleMenu"
                          class="p-2 flex items-center"
                        >
                          <icon-swap class="text-primary w-4 h-4 mr-2" />
                          <p>Swap</p>
                        </li>
                        <li
                          @click.stop="toggleMenu"
                          class="p-2 flex items-center"
                        >
                          <icon-bridge class="text-primary w-4 h-4 mr-2" />
                          <p>Bridge</p>
                        </li>
                      </ul>
                    </div>
                  </template>
                </app-pop-up-menu>
              </div>

              <div class="hidden lg:flex flex-row gap-1 justify-end flex-wrap">
                <app-base-button size="small" @click="buyBtn()" is-outline
                  >Buy</app-base-button
                >
                <app-base-button size="small" @click="swapBtn(token)"
                  >Swap
                </app-base-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Loading State -->
      <div v-if="isLoading" class="">
        <div
          v-for="n in Number(activeShownItems.value)"
          :key="n"
          class="flex w-full h-[56px] py-2"
        >
          <div
            class="bg-surface/30 rounded-12 w-full h-full animate-pulse"
          ></div>
        </div>
      </div>
    </div>

    <div
      class="flex flex-col xs:flex-row items-center justify-center justify-between text-s-12 mt-2"
    >
      <small
        v-if="!isLoading"
        class="text-info ml-4 order-3 xs:order-1 flex-none text-center xs:text-left"
        >{{ getCurrentViewableItemsIndex }} of
        {{ tokens.length }} results</small
      >
      <div class="flex items-center gap-2 order-2 xs:order-2">
        <app-btn-icon
          :disabled="!isLoading && currentPage === 0"
          label="previous page"
          @click="prevPage"
        >
          <ChevronLeftIcon class="w-4 h-4" />
        </app-btn-icon>

        <span class="px-2">{{ currentPage + 1 }} of {{ totalPages }}</span>
        <app-btn-icon
          class=""
          :disabled="!isLoading && currentPage + 1 >= totalPages"
          label="next page"
          @click="nextPage"
        >
          <ChevronRightIcon class="w-4 h-4" />
        </app-btn-icon>
      </div>
      <app-select
        v-model:selected="activeShownItems"
        :options="shownItemsOptions"
        placeholder="Items per page"
        class="text-black !text-s-14 order-1 xs:order-3 ml-auto xs:ml-0"
        position="-right-1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import {
  StarIcon as StarSolidIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/solid'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconBridge from '@/assets/icons/core_menu/icon-bridge.vue'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'
import TableSparkline from '@/components/TableSparkline.vue'
import { storeToRefs } from 'pinia'
import { truncate } from '@/utils/filters'
import type { TokenBalance } from '@/mew_api/types'
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
// import { useToastStore } from '@/stores/toastStore'
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { type AppSelectOption } from '@/types/components/appSelect'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useRouter } from 'vue-router'
import { TOKEN_INFO_ROUTE_NAMES } from '@/router/routeNames'
import { useWalletStore } from '@/stores/walletStore'
import BigNumber from 'bignumber.js'
import { usePaginate } from '@/composables/usePaginate'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'

const props = defineProps<{
  view: 'all' | 'stock' | 'watchlist'
}>()

const walletMenu = useWalletMenuStore()
const { setWalletPanel } = walletMenu
const { isOpenSideMenu } = storeToRefs(walletMenu)
const walletStore = useWalletStore()
const {
  isWalletConnected,
  formattedTotalFiatPortfolioValue,
  isLoadingBalances: isLoading,
  allTokens,
} = storeToRefs(walletStore)

const tableContainer = ref<HTMLElement | null>(null)

// const toastStore = useToastStore()

const searchInput = ref('')

/** -------------------------------
 * All Tokens Filter
  -------------------------------*/

const allTokensFilterOptions = ref([
  { label: 'All Tokens', value: 'all' },
  { label: 'Custom Tokens', value: 'customTokens' },
  { label: 'Watchlist', value: 'watchlist' },
])

const selectedAllTokensFilter = ref(allTokensFilterOptions.value[0])

/** -------------------------------
 * Total Value
-------------------------------*/
const totalValue = computed(() => {
  return props.view === 'all' ? formattedTotalFiatPortfolioValue.value : ''
})

/** -------------------------------
 * Sorting
-------------------------------*/
enum SortValueString {
  NAME = 'Name',
  PERCENT = '24h',
  MARKET_CAP = 'Market_Cap',
  VALUE = 'USD_Balance',
}
const headerSort = ref<SortValueString>(SortValueString.MARKET_CAP)
const tableDirection = ref<'asc' | 'desc'>('desc')

const setHeaderSort = (key: SortValueString) => {
  if (headerSort.value === key) {
    tableDirection.value = tableDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    tableDirection.value = 'desc'
  }
  headerSort.value = key
}

/**-------------------------------
 * Balances Table Data
-------------------------------*/

interface DisplayToken extends TokenBalance {
  marketCap?: number
  percentChange24h?: number
}
const tokens = computed<DisplayToken[]>(() => {
  const tokens = [...allTokens.value].map(token => {
    //TODO: remove TEMP FOR TESTING PURPOSES
    const randomA = Math.round((Math.random() * 198 - 99) * 100) / 100
    const random =
      randomA > 0
        ? undefined
        : Math.round((Math.random() * 198 - 99) * 100) / 100
    const marketCap =
      randomA > 0 ? undefined : Math.floor(Math.random() * 1000000000 + 1000000)
    return {
      ...token,
      marketCap: marketCap,
      percentChange24h: random,
    }
  })

  //Sorting
  if (headerSort.value === SortValueString.NAME) {
    return sortObjectArrayString(tokens, 'name', tableDirection.value)
  }
  if (headerSort.value === SortValueString.PERCENT) {
    return sortObjectArrayNumber(
      tokens,
      'percentChange24h',
      tableDirection.value,
    )
  }
  if (headerSort.value === SortValueString.MARKET_CAP) {
    return sortObjectArrayNumber(tokens, 'marketCap', tableDirection.value)
  }

  return tokens
})

const getFiatValue = (token: DisplayToken) => {
  return formatFiatValue(
    BigNumber(token.price || 0).multipliedBy(token.balance),
  ).value
}

/** -------------------------------
 * Custom Token
  -------------------------------*/

// const customTokensMenu = ref([
//   { label: 'Add Custom Token', value: 'add-custom' },
//   { label: 'Edit Custom Token', value: 'edit-custom' },
// ])

// const openCustomTokenMenu = () => {
//   //TODO: implement custom token functionality
//   toastStore.addToastMessage({
//     text: 'The custom token feature is coming soon!',
//   })
// }

/** -------------------------------
 * Watchlist
-------------------------------*/

const watchListStore = useWatchlistStore()
const { isWatchListed, addTokenToWatchList, removeTokenWatchList } =
  watchListStore
const { watchListedTokens } = storeToRefs(watchListStore)

const setWatchlistToken = (tokenId: string) => {
  if (isWatchListed(tokenId)) {
    removeTokenWatchList(tokenId)
  } else {
    addTokenToWatchList(tokenId)
  }
}

/** -------------------------------
 * Number of items shown in the table
-------------------------------*/
const shownItemsOptions = <AppSelectOption[]>[
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]

const shownItems = computed<number>(() => {
  return Number(activeShownItems.value.value)
})

const getTableHeight = computed<string>(() => {
  if (shownItems.value === 5) {
    return 'min-h-[320px]'
  }
  return 'min-h-[596px]'
})
/** -------------------------------
 * Pagination
-------------------------------*/
const activeShownItems = ref<AppSelectOption>(shownItemsOptions[1])

const getCurrentViewableItemsIndex = computed<number>(() => {
  const viewing = shownItems.value * (currentPage.value + 1)
  if (viewing > tokens.value.length) {
    return tokens.value.length
  }
  return viewing
})

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate<DisplayToken>(tokens, shownItems)

const buyBtn = () => {
  window.open('https://ccswap.myetherwallet.com', '_blank')
}
const swapBtn = (token: DisplayToken) => {
  setWalletPanel('swap')
  goToTokenPage(token)
}

const parsePercent = (val: number | null): string => {
  if (val === null || val === undefined) return ''
  return formatPercentageValue(val ?? 0).value
}

const getSparkLinePoints = () => {
  // if (
  //   token.sparklineIn7d &&
  //   token.sparklineIn7d.length > 0 &&
  //   activePercent.value.value !== '1h'
  // ) {
  //   if (activePercent.value.value === '7d') {
  //     return token.sparklineIn7d
  //   }
  //   const totalPoints = token.sparklineIn7d.length / 7
  //   return token.sparklineIn7d.slice(-totalPoints)
  // }
  return [
    112870.01637755331, 112929.9397716864, 112715.50165167684,
    112990.21580043276, 113442.28069364143, 113253.1113223007,
    113156.56943826913, 112995.308511099, 112700.04411105992,
    113062.13544234853, 112088.22986745652, 112422.24901596077,
    112476.0869349915, 112443.6612941868, 112592.77559223701, 113042.7817158566,
    112562.48777658338, 112421.39545765055, 111972.49734494487,
    111771.39865374852, 111487.93584452692, 111121.72507506835,
    110767.84168895654, 110818.25472180649, 111199.93148834158,
    111421.2073092355, 111311.1263122397, 111172.12653064249,
    110752.26596267126, 110793.48679619528, 110708.66960879423,
    110531.09583273325, 111271.68118521282, 111516.32075982497,
    111563.02242448437, 111076.6155384864, 110968.85054268927,
    111693.47908038496, 110689.07472780014, 110871.19673179896,
    111183.20320387377, 111585.59359375246, 111444.15250991116,
    111606.05066574663, 110922.2576204432, 110648.09858393036,
    108705.59082599828, 108797.48915023833, 108351.07919531601,
    108681.9674782462, 108357.1050855725, 107808.50597374301,
    108417.82422450527, 107985.60383108161, 108168.17353436728,
    108721.02286448535, 108614.70730145884, 108850.80479080149,
    109181.00611204734, 108844.69706569162, 108418.74567209769,
    106777.58590344951, 105720.55420111967, 104941.22576466638,
    104953.76270225686, 104777.54392041727, 105637.72456941512,
    105353.87398216527, 105909.58504396181, 105410.36143840729,
    106825.8474195911, 106436.7153558714, 106458.72871351143,
    106637.64075028818, 106567.25320451484, 107107.46307298902,
    107429.45346955593, 107016.94179918483, 106443.61194984635,
    106873.8466281408, 107099.65206107982, 106609.13013785085,
    107128.71710851924, 106536.96768166094, 106794.97175083953,
    106919.60377644845, 107022.8593157679, 106803.86682905952,
    106932.4066286696, 106991.11301872972, 106980.1455985165,
    107070.93471032777, 106968.26416692934, 107011.34462815462,
    106992.63460145699, 106706.53067279152, 106897.87467019023,
    106873.61641543529, 107094.35594603926, 107044.77083141152,
    107210.23428047558, 107147.81742888642, 107156.00337647724,
    106903.79932474553, 106994.99026184587, 106892.59199791536,
    107277.8900097389, 107097.55099996917, 106894.00465728603,
    106765.30322754725, 106815.08572050236, 106489.79430051908,
    107601.94399619543, 107661.60148137854, 107804.49082162174,
    107580.78284153281, 108074.73428483192, 108440.14412851754,
    108430.33239110556, 108701.68249623412, 109198.03762001857,
    109404.69898589609, 108953.78744965605, 108899.47537203658,
    108703.11827939545, 108976.71889815509, 108655.50525004533,
    107984.75530202611, 108031.89967462847, 108802.63136876836,
    110213.82084744876, 110408.77985590181, 110988.93843181919,
    111313.87149220676, 111154.61395542785, 111127.01051419933,
    110867.09387240493, 110771.30592452061, 111032.33988398887,
    110846.45798521055, 111057.76323610534, 111322.7026176929,
    111427.00607037144, 110455.59307840143, 110340.15173252257,
    110880.01637720925, 110828.02730463324, 111027.57915637184,
    110585.68622264663, 110836.40846709388, 110608.5714932665,
    110490.77048453045, 110033.27171327456, 109587.65776738718,
    109133.49157778294, 107726.40857946868, 107603.55609132143,
    107941.29470249634, 108131.8700683883, 107766.34807709047,
    107763.47584764786, 108596.10577425564, 108617.2385815631,
    108971.72776049396, 108309.2361192458, 111287.67777555031,
    113348.64642768126, 113187.82370886576,
  ]
}

/**-------------------------------
 * Token Link
 --------------------------------*/
const router = useRouter()

const goToTokenPage = (token: DisplayToken) => {
  router.push({
    name: TOKEN_INFO_ROUTE_NAMES.home,
    params: { tokenId: token.coinId },
  })
}
</script>
