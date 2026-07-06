<template>
  <div v-if="isWalletConnected">
    <div
      class="flex flex-col lg:flex-row lg:items-center justify-between px-2 py-2 mb-4 lg:gap-6"
    >
      <div
        class="flex grow flex-wrap order-3 order-2 lg:order-1 items-center gap-4"
      >
        <div
          class="flex grow justify-between items-center bg-surface rounded-full p-1 w-full xs:max-w-[500px]"
        >
          <app-search-input v-model="searchInput" class="grow" />
        </div>
        <app-pop-up-menu
          v-if="view !== 'watchlist'"
          placeholder="table options"
          location="right"
        >
          <template #menu-button="{ toggleMenu }">
            <app-btn-icon
              label="table options"
              @click.stop="toggleMenu"
              height="h-7"
              width="w-7"
            >
              <ellipsis-vertical-icon class="w-5 h-5" />
            </app-btn-icon>
          </template>
          <template #menu-content="{ toggleMenu }">
            <div class="px-2 py-3 bg-white rounded-xl min-w-[230px]">
              <button
                class="flex items-center w-full p-2 hoverBGWhite rounded-12 text-s-14"
                @click.stop="[toggleShowBalance(), toggleMenu()]"
              >
                <span class="grow text-left">Hide tokens with no value</span>
                <span
                  class="ml-2 w-4 h-4 rounded border flex items-center justify-center flex-shrink-0"
                  :class="
                    !hideLowBalance
                      ? 'bg-primary border-primary'
                      : 'border-grey-30'
                  "
                >
                  <svg
                    v-if="!hideLowBalance"
                    class="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 12 12"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </template>
        </app-pop-up-menu>
        <div
          v-if="paginatedArray.length && props.view === 'custom'"
          class="flex-none"
        >
          <app-base-button size="medium" @click="openAddCustom"
            >{{ $t('portfolio.table.add_button') }}
          </app-base-button>
        </div>
      </div>
      <!-- TOTAL VALUE-->
      <div
        class="order-1 lg:order-2 mb-3 lg:mb-0 ml-2 lg:ml-0 flex items-center gap-2"
      >
        <div class="lg:text-right">
          <p class="font-bold text-info uppercase tracking-sp-06 text-s-14">
            {{ $t('portfolio.table.total_value') }}
          </p>
          <p
            v-if="!isLoading"
            class="text-s-24 font-bold rounded-12 leading-none text-black"
          >
            {{ totalValue }}
          </p>
          <div
            v-else
            class="bg-grey-5 animate-pulse w-[100px] h-6 rounded-lg"
          ></div>
        </div>
      </div>
    </div>
    <div :class="['static', getTableHeight]" ref="tableContainer">
      <table
        class="w-full text-sm table-fixed border-separate border-spacing-y-0"
      >
        <!-- Header-->
        <thead class="bg-white">
          <tr
            class="text-left text-s-11 uppercase text-info tracking-sp-06 border-b border-grey-5 font-bold"
          >
            <!-- Watchlist -->
            <th class="hidden xs:table-cell xs:w-10 pb-4 text-center"></th>
            <!-- Name & Balance -->
            <th
              class="cursor-pointer px-1 pb-4 hover:text-black transition-colors"
              colspan="2"
            >
              <div
                class="flex items-center gap-1 ml-11 font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.NAME,
                }"
                @click="setHeaderSort(SortValueString.NAME)"
              >
                {{ $t('portfolio.table.token_header') }}
                <arrow-long-down-icon
                  class="w-3.5 h-3.5"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5"
                  v-if="
                    headerSort === SortValueString.NAME &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Market Cap -->
            <th
              class="hidden cursor-pointer px-1 pb-4 hover:text-black transition-colors"
              :class="isOpenSideMenu ? '2xl:table-cell' : 'xl:table-cell'"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.MARKET_CAP,
                }"
                @click="setHeaderSort(SortValueString.MARKET_CAP)"
              >
                {{ $t('portfolio.table.market_cap_header') }}
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.MARKET_CAP &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Price -->
            <th
              class="hidden md:table-cell cursor-pointer px-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.PRICE,
                }"
                @click="setHeaderSort(SortValueString.PRICE)"
              >
                {{ $t('portfolio.table.price_header') }}
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PRICE &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PRICE &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- 24h % -->
            <th
              class="hidden xs:table-cell cursor-pointer px-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.PERCENT,
                }"
                @click="setHeaderSort(SortValueString.PERCENT)"
              >
                {{ $t('portfolio.table.24h_header') }}
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.PERCENT &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>

            <!--Balance -->
            <th
              class="cursor-pointer pl-1 pr-1 pb-4 hover:text-black transition-colors"
            >
              <div
                class="flex items-center gap-1 justify-end relative text-right font-bold"
                :class="{
                  'text-black': headerSort === SortValueString.VALUE,
                }"
                @click="setHeaderSort(SortValueString.VALUE)"
              >
                {{ $t('portfolio.table.balance_header') }}
                <arrow-long-down-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.VALUE &&
                    tableDirection === 'desc'
                  "
                />
                <arrow-long-up-icon
                  class="w-3.5 h-3.5 absolute -right-4"
                  v-if="
                    headerSort === SortValueString.VALUE &&
                    tableDirection === 'asc'
                  "
                />
              </div>
            </th>
            <!-- Actions -->
            <th
              class="lg:pl-6 lg:pr-4 pb-4 text-right w-7 xs:w-10 md:w-12 lg:w-[160px] xl:w-[180px] 2xl:w-[200px]"
            ></th>
          </tr>
        </thead>
        <!-- Body-->
        <tbody v-if="!isLoading">
          <tr
            v-for="(token, index) in paginatedArray"
            :key="
              index +
              token.name +
              token.market_cap +
              token.coinId +
              token.contract
            "
            class="h-14 cursor-pointer hoverBGWhite"
            @click="goToTokenPage(token)"
          >
            <!-- Watchlist -->
            <td class="hidden xs:table-cell xs:w-10 rounded-l-12 text-center">
              <button
                v-if="getWatchlistId(token)"
                @click.stop="setWatchlistToken(token)"
                class="p-2 text-black rounded-full hover:bg-grey-5 transition-colors duration-300 ease-in-out"
              >
                <!-- changes icon when active -->
                <star-outline-icon
                  class="h-4 w-4 cursor-pointer"
                  v-if="!isWatchListed(getWatchlistId(token))"
                />
                <star-solid-icon v-else class="h-4 w-4 cursor-pointer" />
              </button>
            </td>
            <!-- Name -->
            <td class="px-1 py-1 rounded-l-12 xs:rounded-none" colspan="2">
              <router-link
                :to="getTokenRoute(token)"
                class="flex items-center gap-3"
                @click.stop="onTokenLinkClick(token)"
              >
                <app-token-logo
                  :url="token.logo_url"
                  :symbol="token.symbol"
                  :is-stock="token.ondo !== undefined"
                  class="inline-block rounded-full shadow-token"
                />
                <div class="truncate">
                  <app-token-symbol
                    :symbol="token.symbol"
                    :is-stock="token.ondo !== undefined"
                  />
                  <app-tooltip
                    :text="getTokenName(token)"
                    v-if="getTokenName(token).length > 20"
                  >
                    <p
                      class="truncate text-info text-s-12 max-w-[150px] md:max-w-[200px] lg:max-w-[300px] text-black"
                    >
                      {{ getTokenName(token) }}
                    </p>
                  </app-tooltip>
                  <p
                    v-else
                    class="truncate text-info text-s-12 max-w-[150px] md:max-w-[200px] lg:max-w-[300px] text-black"
                  >
                    {{ getTokenName(token) }}
                  </p>
                </div>
              </router-link>
            </td>
            <!-- Market Cap -->
            <td
              class="hidden px-1 py-1 text-right font-normal text-s-14 text-black"
              :class="isOpenSideMenu ? '2xl:table-cell' : 'xl:table-cell'"
            >
              {{
                token.market_cap
                  ? formatFiat(token.market_cap).display
                  : '-'
              }}
            </td>
            <!-- Price -->
            <td
              class="hidden md:table-cell px-1 py-1 text-right font-normal text-s-14 text-black"
            >
              {{ token.price ? formatFiat(token.price).display : '-' }}
            </td>
            <!-- 24H % -->
            <td class="hidden xs:table-cell px-1 py-1 text-right">
              <div class="flex flex-col items-end justify-center py-2">
                <p
                  class="text-s-13 font-normal mb-1"
                  :class="[
                    token.price_change_percentage_24h
                      ? parsePercent(
                          token.price_change_percentage_24h,
                        ).includes('-')
                        ? 'text-error'
                        : 'text-success'
                      : 'text-black',
                  ]"
                >
                  {{
                    token.price_change_percentage_24h
                      ? parsePercent(token.price_change_percentage_24h)
                      : '-'
                  }}
                </p>
                <table-sparkline
                  v-if="
                    token.sparkline_in_7d && token.sparkline_in_7d.length > 0
                  "
                  :points="token.sparkline_in_7d"
                  :width="70"
                  :height="24"
                  :max-points="34"
                  fill
                  :percent-change="token.price_change_percentage_24h"
                />
              </div>
            </td>

            <!-- Balance -->
            <td class="pl-1 pr-1 py-1 text-right">
              <p class="font-normal text-s-14 text-black">
                {{ token.fiatBalanceFormatted }}
              </p>
              <p class="text-info text-s-12 mt-0.5">
                {{ formatFloatingPointValue(token.balance).value }}
                <span class="uppercase font-normal text-info">{{
                  truncate(token.symbol, 7)
                }}</span>
              </p>
            </td>
            <!-- Actions -->
            <td class="lg:pr-2 py-1 rounded-r-12 relative text-right">
              <div
                class="flex items-center justify-end lg:hidden ml-auto -mr-1 md:mr-auto"
              >
                <app-pop-up-menu
                  :placeholder="$t('common.action_menu')"
                  location="right"
                >
                  <template #menu-button="{ toggleMenu }">
                    <app-btn-icon
                      :label="$t('common.action_menu')"
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
                      <button
                        v-if="getWatchlistId(token)"
                        class="xs:hidden flex items-center p-2 hoverBGWhite rounded-12"
                        @click.stop="[setWatchlistToken(token), toggleMenu()]"
                      >
                        <star-outline-icon
                          class="h-4 w-4 cursor-pointer"
                          v-if="!isWatchListed(getWatchlistId(token))"
                        />
                        <star-solid-icon
                          v-else
                          class="h-4 w-4 cursor-pointer"
                        />
                        <span class="ml-2">{{
                          isWatchListed(getWatchlistId(token))
                            ? $t('portfolio.table.remove_from_watchlist')
                            : $t('portfolio.table.add_to_watchlist')
                        }}</span>
                      </button>
                      <hr
                        v-if="
                          props.view === 'custom' ||
                          isBuyableOnCompatibleChain(token.coinId) ||
                          token.ondo !== undefined ||
                          currentChainhasSwapSupport
                        "
                        class="h-px bg-grey-10 border-0 w-full my-2 xs:hidden"
                      />

                      <ul v-if="props.view !== 'custom'">
                        <li
                          v-if="isBuyableOnCompatibleChain(token.coinId)"
                          @click.stop="[buyBtn(token, true), toggleMenu()]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <icon-buy class="text-primary w-4 h-4 mr-2" />
                          <p>{{ $t('common.buy') }}</p>
                        </li>
                        <template v-if="token.ondo !== undefined">
                          <li
                            @click.stop="[tradeBtn(token, true), toggleMenu()]"
                            class="p-2 flex items-center hoverBGWhite rounded-12"
                          >
                            <icon-trade class="text-primary w-4 h-4 mr-2" />
                            <p>{{ $t('portfolio.table.trade') }}</p>
                          </li>
                        </template>
                        <template v-else-if="currentChainhasSwapSupport">
                          <li
                            @click.stop="[swapBtn(token, true), toggleMenu()]"
                            class="p-2 flex items-center hoverBGWhite rounded-12"
                          >
                            <icon-swap class="text-primary w-4 h-4 mr-2" />
                            <p>{{ $t('common.swap') }}</p>
                          </li>
                        </template>
                      </ul>
                      <ul v-else>
                        <li
                          @click.stop="[
                            customTokenAction('edit', token),
                            toggleMenu(),
                          ]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <pencil-icon class="w-4 h-4 mr-2" />
                          <p>{{ $t('common.edit') }}</p>
                        </li>
                        <li
                          @click.stop="[
                            customTokenAction('delete', token),
                            toggleMenu(),
                          ]"
                          class="p-2 flex items-center hoverBGWhite rounded-12"
                        >
                          <trash-icon class="w-4 h-4 mr-2" />
                          <p>{{ $t('common.delete') }}</p>
                        </li>
                      </ul>
                    </div>
                  </template>
                </app-pop-up-menu>
              </div>
              <div
                v-if="props.view !== 'custom'"
                class="hidden lg:flex flex-row gap-2 justify-end"
              >
                <app-base-button
                  v-if="token.ondo !== undefined"
                  size="small"
                  @click="tradeBtn(token)"
                  class="min-w-[60px]"
                  >{{ $t('portfolio.table.trade') }}
                </app-base-button>
                <app-base-button
                  v-else-if="currentChainhasSwapSupport"
                  size="small"
                  @click="swapBtn(token)"
                  class="min-w-[60px]"
                  >{{ $t('common.swap') }}
                </app-base-button>
                <app-base-button
                  v-if="isBuyableOnCompatibleChain(token.coinId)"
                  size="small"
                  @click="buyBtn(token)"
                  is-outline
                  class="min-w-[60px]"
                  >{{ $t('common.buy') }}
                </app-base-button>
                <div v-else class="w-[60px]"></div>
              </div>
              <div
                class="hidden lg:flex flex-row gap-1 justify-end flex-wrap"
                v-else
              >
                <app-btn-icon
                  :label="$t('common.edit')"
                  @click.stop="customTokenAction('edit', token)"
                >
                  <pencil-icon class="w-4 h-4" />
                </app-btn-icon>
                <app-btn-icon
                  :label="$t('common.delete')"
                  @click.stop="customTokenAction('delete', token)"
                >
                  <trash-icon class="w-5 h-5" />
                </app-btn-icon>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-if="
          searchInput.length === 0 &&
          paginatedArray.length === 0 &&
          props.view === 'watchlist'
        "
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-1 lg:mt-10">{{ $t('portfolio.table.empty_watchlist') }}</p>
        <router-link :to="{ name: ROUTES_MAIN.CRYPTO.NAME }" class="underline"
          >{{ $t('portfolio.table.discover_more_tokens') }}
          <arrow-long-up-icon class="rotate-90 w-4 h-4 inline-flex" />
        </router-link>
      </div>
      <div
        v-if="paginatedArray.length === 0 && props.view === 'custom'"
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-6 lg:mt-10">{{ $t('portfolio.table.empty_custom') }}</p>
        <app-base-button size="medium" @click="openAddCustom">{{
          $t('portfolio.table.add_custom_token')
        }}</app-base-button>
      </div>
      <div
        v-if="paginatedArray.length === 0 && props.view === 'stocks'"
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-6 lg:mt-10">
          {{ $t('portfolio.table.empty_stocks') }}
        </p>
        <app-base-button
          size="medium"
          @click="$router.push({ name: ROUTES_MAIN.STOCKS.NAME })"
          >{{ $t('common.explore_stocks') }}</app-base-button
        >
      </div>
      <div
        v-if="searchInput.length > 0 && paginatedArray.length === 0"
        class="text-nowrap mx-auto text-info text-center py-10 text-s-14"
      >
        <p class="mb-1 lg:mt-10">
          {{ $t('portfolio.table.no_results', { query: searchInput }) }}
        </p>
      </div>
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
      class="flex flex-col xs:flex-row items-center justify-between text-s-14 mt-4 border-t border-grey-5 pt-4 px-2"
    >
      <div v-if="!isLoading" class="text-info order-3 xs:order-1 mb-4 xs:mb-0">
        {{
          $t('portfolio.table.results_of', {
            count: getCurrentViewableItemsIndex,
            total: tokens.length,
          })
        }}
      </div>
      <div class="flex items-center gap-4 order-1 xs:order-2 mb-4 xs:mb-0">
        <app-btn-icon
          :disabled="!isLoading && currentPage === 0"
          :label="$t('common.previous_page')"
          @click.stop="prevPage"
        >
          <chevron-left-icon class="w-4 h-4" />
        </app-btn-icon>
        <div class="flex items-center gap-2">
          <span class="text-black">{{ currentPage + 1 }}</span>
          <span class="text-info">{{ $t('portfolio.table.page_of') }}</span>
          <span class="text-info">{{ totalPages }}</span>
        </div>
        <app-btn-icon
          :disabled="!isLoading && currentPage + 1 >= totalPages"
          :label="$t('common.next_page')"
          @click.stop="nextPage"
        >
          <chevron-right-icon class="w-4 h-4" />
        </app-btn-icon>
      </div>

      <div class="flex items-center gap-2 order-2 xs:order-3 mb-4 xs:mb-0">
        <app-select
          v-model:selected="activeShownItems"
          :options="shownItemsOptions"
          position="top-[-160px] right-0"
          class="min-w-[70px]"
        >
          <template #select-button="{ toggleSelect }">
            <button
              class="flex items-center justify-between gap-1 px-3 py-1.5 rounded-lg border border-grey-10 hover:border-grey-30 transition-colors"
              @click="toggleSelect"
            >
              <span>{{ activeShownItems.label }}</span>
              <chevron-down-icon class="w-4 h-4 text-info" />
            </button>
          </template>
        </app-select>
      </div>
    </div>
    <custom-tokens-dialog />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import BigNumber from 'bignumber.js'
import { formatUnits } from 'viem'

// Components
import AppSearchInput from '@/components/AppSearchInput.vue'
import AppSelect from '@/components/AppSelect.vue'
import AppBaseButton from '@/components/AppBaseButton.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import AppPopUpMenu from '@/components/AppPopUpMenu.vue'
import AppTooltip from '@/components/AppTooltip.vue'
import TableSparkline from '@/components/TableSparkline.vue'
import CustomTokensDialog from './CustomTokensDialog.vue'
// Icons
import {
  StarIcon as StarSolidIcon,
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/solid'
import IconBuy from '@/assets/icons/core_menu/icon-buy.vue'
import IconSwap from '@/assets/icons/core_menu/icon-swap.vue'
import IconTrade from '@/assets/icons/core_menu/icon-trade.vue'
import { StarIcon as StarOutlineIcon } from '@heroicons/vue/24/outline'

// Composables & Utils
import { usePaginate } from '@/composables/usePaginate'
import { useFetchWatchlist } from '@/composables/useFetchWatchlist'
import { sortObjectArrayNumber, sortObjectArrayString } from '@/utils/sortArray'
import { searchArrayByKeysStr } from '@/utils/searchArray'
import { truncate } from '@/utils/filters'
import { getAPIPath } from '@/utils/constructAPIPath'
import { analytics, ClickTokenTradeEvent } from '@/analytics'
import {
  formatFloatingPointValue,
  formatPercentageValue,
} from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'
import { captureException } from '@sentry/vue'
import { SENTRY_MODULE_TAGS } from '@/sentry/constants'

// Types & Routes
import type {
  GetErc20AddressBalanceResponse,
  TokenBalance,
  GetWebStocksWatchlistResponseStock,
} from '@/mew_api/types'
import type { AppSelectOption } from '@/types/components/appSelect'
import {
  ROUTES_MAIN,
  TOKEN_INFO_ROUTE_NAMES,
  STOCK_INFO_ROUTE_NAMES,
} from '@/router/routeNames'
import { type BalanceFilter } from '../../helpers/index'

// Stores
import { useWatchlistStore } from '@/stores/watchlistTableStore'
import { useWalletMenuStore } from '@/stores/walletMenuStore'
import { useWalletStore } from '@/stores/walletStore'
import { useTokenInfoStore } from '@/stores/tokenInfoStore'
import { useCustomTokenStore } from '@/stores/customTokenStore'
import { useChainsStore } from '@/stores/chainsStore'
import { usePurchaseStore } from '@/stores/purchaseStore'

/** -------------------------------
 * Constants & Types
 -------------------------------*/
export interface DisplayToken extends TokenBalance {
  fiatBalance?: number
  fiatBalanceFormatted?: string
}

enum SortValueString {
  NAME = 'Name',
  PERCENT = '24h',
  MARKET_CAP = 'Market_Cap',
  VALUE = 'USD_Balance',
  PRICE = 'Price',
}

/** -------------------------------
 * Store & State Setup
 -------------------------------*/
const props = defineProps<{
  view: BalanceFilter
}>()

const router = useRouter()
const chainStore = useChainsStore()
const walletStore = useWalletStore()
const walletMenu = useWalletMenuStore()
const watchListStore = useWatchlistStore()
const customTokenStore = useCustomTokenStore()
const tokenInfoStore = useTokenInfoStore()
const purchaseStore = usePurchaseStore()
const { isBuyableOnCompatibleChain } = purchaseStore

const { formatFiat } = useCurrency()

const { selectedChain, currentChainhasSwapSupport } = storeToRefs(chainStore)
const {
  setWalletPanel,
  setSelectedTradeTokenSymbol,
  setSelectedPurchaseCoinId,
  toggleShowBalance,
} = walletMenu
const { isOpenSideMenu, hideLowBalance } = storeToRefs(walletMenu)
const {
  isWalletConnected,
  formattedTotalFiatPortfolioValue,
  isLoadingBalances,
  allTokens,
  allStocks,
  walletAddress,
} = storeToRefs(walletStore)

const { isWatchListed, setWatchlistItem } = watchListStore
const { watchListedTokens, watchListedStocks } = storeToRefs(watchListStore)
const { customTokens } = storeToRefs(customTokenStore)
const { openCustomTokenDialog, setCurrentView } = customTokenStore

// Local State
const searchInput = ref('')
const headerSort = ref<SortValueString>(SortValueString.MARKET_CAP)
const tableDirection = ref<'asc' | 'desc'>('asc')
const extraCustomBalances = ref<Record<string, GetErc20AddressBalanceResponse>>(
  {},
)

/** -------------------------------
 * Computed Values
 -------------------------------*/
const chainCustomTokens = computed(() => {
  const chainName = chainStore.selectedChain?.name || ''
  return customTokens.value[chainName] || []
})

const isLoading = computed(() =>
  props.view === 'watchlist'
    ? isLoadingBalances.value || isLoadingWatchlist.value
    : isLoadingBalances.value,
)

/** -------------------------------
 * Fetching & Watchers
 -------------------------------*/
const selectedChainForWatchlist = computed(() => selectedChain.value ?? null)

const {
  tokensWatchlistData,
  stocksWatchlistData,
  isFetchingTokensWatchlist,
  isFetchingStocksWatchlist,
  fetchAllWatchlist,
} = useFetchWatchlist(selectedChainForWatchlist)

const isLoadingWatchlist = computed(
  () => isFetchingTokensWatchlist.value || isFetchingStocksWatchlist.value,
)

const formatStock = (
  item: GetWebStocksWatchlistResponseStock,
): DisplayToken => {
  return {
    name: item.underlyingMarket.name,
    symbol: item.primaryMarket.symbol,
    logo_url: item.iconPngUrl || item.iconSvgUrl || '',
    price: item.primaryMarket.price ? Number(item.primaryMarket.price) : 0,
    price_change_percentage_24h: item.primaryMarket.priceChangePercentage24h
      ? Number(item.primaryMarket.priceChangePercentage24h)
      : 0,
    market_cap: item.underlyingMarket.marketCap
      ? Number(item.underlyingMarket.marketCap)
      : 0,
    sparkline_in_7d: item.primaryMarket.sparkline24h || [],
    balanceWei: '0x',
    balance: '0',
    contract: '',
    fiatBalance: 0,
    fiatBalanceFormatted: formatFiat(0).display,
    ondo: {
      stockAlias: item.stockAlias,
      iconPngUrl: item.iconPngUrl,
      iconSvgUrl: item.iconSvgUrl,
      primaryMarket: {
        symbol: item.primaryMarket.symbol,
      },
      underlyingMarket: {
        name: item.underlyingMarket.name,
      },
    },
  } as DisplayToken
}

const getCustomTokenBalance = async (
  contractAddress: string,
): Promise<GetErc20AddressBalanceResponse> => {
  const path = getAPIPath(
    `/v1/evm/chains/${selectedChain.value?.chainID}/erc20/${contractAddress}/addresses/${walletAddress.value}/balance`,
  )
  const response = await fetch(path)
  if (!response.ok) throw new Error('Failed to fetch balance')
  return response.json()
}

watch(selectedChain, () => (extraCustomBalances.value = {}))

// Fetch watchlist when view is 'watchlist'
watch(
  () => props.view,
  newView => {
    if (
      newView === 'watchlist' &&
      (watchListedTokens.value.length > 0 || watchListedStocks.value.length > 0)
    ) {
      fetchAllWatchlist()
    }
  },
  { immediate: true },
)

watch(
  [chainCustomTokens, walletAddress],
  async () => {
    if (props.view !== 'custom') return

    const existingAddresses = new Set(
      allTokens.value.map(t => t.contract?.toLowerCase()),
    )

    for (const token of chainCustomTokens.value) {
      const addr = token.address.toLowerCase()
      if (!existingAddresses.has(addr) && !extraCustomBalances.value[addr]) {
        try {
          extraCustomBalances.value[addr] = await getCustomTokenBalance(
            token.address,
          )
        } catch (e) {
          captureException(e, {
            ...SENTRY_MODULE_TAGS.PORTFOLIO,
            extra: {
              title: 'Error fetching custom token balance',
              tokenAddress: token.address,
              chainId: selectedChain.value?.chainID,
            },
          })
        }
      }
    }
  },
  { immediate: true },
)

/** -------------------------------
 * Table Logic
 -------------------------------*/
const setHeaderSort = (key: SortValueString) => {
  if (headerSort.value === key) {
    tableDirection.value = tableDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    tableDirection.value = 'desc'
    headerSort.value = key
  }
}
const getTokenName = (token: DisplayToken): string => {
  return token.ondo?.stockAlias || token.name
}

const getFiatValue = (token: TokenBalance): BigNumber => {
  return BigNumber(token.price || 0).multipliedBy(token.balance)
}

const mapToDisplay = (token: TokenBalance): DisplayToken => {
  const fiat = getFiatValue(token)
  return {
    ...token,
    fiatBalance: fiat.toNumber(),
    fiatBalanceFormatted: formatFiat(fiat).display,
  }
}

const tokens = computed<DisplayToken[]>(() => {
  let list: DisplayToken[] = []

  // Create lookups for faster access
  const balanceMap = new Map(
    allTokens.value.map(t => [t.contract?.toLowerCase(), t]),
  )
  const coinIdMap = new Map(allTokens.value.map(t => [t.coinId, t]))

  // Create lookup for stocks by ondo symbol
  const stocksMap = new Map(
    allStocks.value.map(s => [s.ondo?.primaryMarket?.symbol?.toLowerCase(), s]),
  )

  if (props.view === 'watchlist') {
    // make sure that response is array, if not set to empty array
    const watchlistTokenResponse = Array.isArray(tokensWatchlistData.value)
      ? tokensWatchlistData.value
      : []
    // Map tokens watchlist
    const tokensList =
      watchlistTokenResponse
        .filter(token => watchListedTokens.value.includes(token.coinId))
        .map(token => {
          const balanceToken = coinIdMap.get(token.coinId)
          if (balanceToken) return mapToDisplay(balanceToken)

          return {
            ...token,
            fiatBalance: 0,
            fiatBalanceFormatted: formatFiat(0).display,
            balanceWei: '0x',
            balance: '0',
            contract: '',
            price: token.price || undefined,
            market_cap: token.marketCap || undefined,
            price_change_percentage_24h: token.priceChangePercentage24h || 0,
            sparkline_in_7d: token.sparklineIn7d || [],
            logo_url: token.logoUrl || '',
          } as DisplayToken
        }) || []

    // Map stocks watchlist
    const stocksList =
      (stocksWatchlistData.value || [])
        .filter(stock => {
          return watchListedStocks.value
            .map(s => s.toLowerCase())
            .includes(stock.primaryMarket.symbol.toLowerCase())
        })
        .map(stock => {
          // Check if user has balance for this stock
          const balanceStock = stocksMap.get(
            stock.primaryMarket.symbol.toLowerCase(),
          )
          if (balanceStock) return mapToDisplay(balanceStock)

          return formatStock(stock)
        }) || []
    list = [...tokensList, ...stocksList]
  } else if (props.view === 'custom') {
    list = chainCustomTokens.value.map(customToken => {
      const balanceToken = balanceMap.get(customToken.address.toLowerCase())
      if (balanceToken) {
        return {
          ...mapToDisplay(balanceToken),
          symbol: customToken.symbol,
        }
      }

      const extra = extraCustomBalances.value[customToken.address.toLowerCase()]
      if (extra) {
        const balance = formatUnits(
          BigInt(extra.nativeValue),
          customToken.decimals,
        )
        const fiat = BigNumber(extra.fiatValue || 0)
        return {
          name: customToken.name,
          symbol: customToken.symbol,
          contract: customToken.address,
          decimals: customToken.decimals,
          balanceWei: extra.nativeValue,
          balance,
          fiatBalance: fiat.toNumber(),
          fiatBalanceFormatted: formatFiat(fiat).display,
          price: extra.priceFiatPerNative || 0,
        } as DisplayToken
      }

      return {
        name: customToken.name,
        symbol: customToken.symbol,
        contract: customToken.address,
        decimals: customToken.decimals,
        balanceWei: '0x',
        balance: '0',
        fiatBalance: 0,
        fiatBalanceFormatted: formatFiat(0).display,
      } as DisplayToken
    })
  } else if (props.view === 'stocks') {
    list = allStocks.value.map(mapToDisplay)
  } else {
    list = allTokens.value.map(mapToDisplay)
  }

  if (!hideLowBalance.value && props.view !== 'watchlist') {
    list = list.filter(t => (t.fiatBalance ?? 0) > 0)
  }

  if (searchInput.value) {
    list = searchArrayByKeysStr(list, ['name', 'symbol'], searchInput.value)
  }

  // Sorting logic
  const sortMap: Record<SortValueString, () => DisplayToken[]> = {
    [SortValueString.NAME]: () =>
      sortObjectArrayString(list, 'name', tableDirection.value),
    [SortValueString.PERCENT]: () =>
      sortObjectArrayNumber(
        list,
        'price_change_percentage_24h',
        tableDirection.value,
      ),
    [SortValueString.MARKET_CAP]: () =>
      sortObjectArrayNumber(list, 'market_cap', tableDirection.value),
    [SortValueString.VALUE]: () =>
      sortObjectArrayNumber(list, 'fiatBalance', tableDirection.value),
    [SortValueString.PRICE]: () =>
      sortObjectArrayNumber(list, 'price', tableDirection.value),
  }

  return sortMap[headerSort.value] ? sortMap[headerSort.value]() : list
})

const totalValue = computed(() => {
  if (props.view === 'all') return formattedTotalFiatPortfolioValue.value
  const sum = tokens.value.reduce(
    (acc, t) => acc.plus(t.fiatBalance || 0),
    new BigNumber(0),
  )
  return formatFiat(sum).display
})

/** -------------------------------
 * Pagination Logic
 -------------------------------*/
const shownItemsOptions: AppSelectOption[] = [
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
]
const activeShownItems = ref<AppSelectOption>(shownItemsOptions[1])
const shownItems = computed(() => Number(activeShownItems.value.value))

const { currentPage, paginatedArray, nextPage, prevPage, totalPages } =
  usePaginate<DisplayToken>(tokens, shownItems)

const getTableHeight = computed(() =>
  shownItems.value === 5 ? 'min-h-[320px]' : 'min-h-[596px]',
)

const getCurrentViewableItemsIndex = computed(() =>
  Math.min(shownItems.value * (currentPage.value + 1), tokens.value.length),
)

/** -------------------------------
 * Navigation & Handlers
 -------------------------------*/
const buyBtn = (token?: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.BUY, {
    location: 'balance_table',
    token: token?.symbol,
    isMobile,
  })
  setSelectedPurchaseCoinId(token?.coinId ?? null)
  walletMenu.openPanel('purchase')
}

const getTokenRoute = (token: DisplayToken) => {
  if (token.ondo !== undefined) {
    return {
      name: STOCK_INFO_ROUTE_NAMES.home,
      params: { symbol: token.ondo.primaryMarket.symbol },
    }
  }
  return {
    name: TOKEN_INFO_ROUTE_NAMES.home,
    params: { tokenId: token.coinId || token.symbol },
  }
}

const onTokenLinkClick = (token: DisplayToken) => {
  if (token.ondo === undefined) {
    tokenInfoStore.setTokenInfo(token)
  }
}

const goToTokenPage = (token: DisplayToken) => {
  onTokenLinkClick(token)
  router.push(getTokenRoute(token))
}

const getWatchlistId = (token: DisplayToken): string => {
  return token.ondo?.primaryMarket?.symbol || token.coinId || ''
}

const isTokenStock = (token: DisplayToken): boolean => {
  return token.ondo !== undefined && !!token.ondo?.primaryMarket?.symbol
}

const setWatchlistToken = (token: DisplayToken) => {
  const id = getWatchlistId(token)
  if (!id) return
  const isStock = isTokenStock(token)
  setWatchlistItem(id, isStock)
  if (!isWatchListed(id)) {
    fetchAllWatchlist()
  }
}

const openAddCustom = () => {
  setCurrentView('add')
  openCustomTokenDialog()
}

const customTokenAction = (action: 'delete' | 'edit', token: TokenBalance) => {
  setCurrentView(action, {
    name: token.name,
    symbol: token.symbol || '',
    address: token.contract || '',
    decimals: token.decimals || 0,
  })
  openCustomTokenDialog()
}

const swapBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.SWAP, {
    location: 'balance_table',
    token: token.symbol,
    isMobile,
  })
  setWalletPanel('swap')
  if (!isOpenSideMenu.value) walletMenu.setIsOpenSideMenu(true)
  if (!isMobile) goToTokenPage(token)
}

const tradeBtn = (token: DisplayToken, isMobile = false) => {
  analytics.trackClickTokenTradeEvent(ClickTokenTradeEvent.TRADE, {
    location: 'balance_table',
    token: token.symbol,
    isMobile,
    stock: token.ondo?.underlyingMarket.name,
  })
  setSelectedTradeTokenSymbol(token.symbol)
  setWalletPanel('trade')
  if (!isOpenSideMenu.value) walletMenu.setIsOpenSideMenu(true)
  if (!isMobile) goToTokenPage(token)
}

const parsePercent = (val: number | null): string => {
  if (val === null || val === undefined) return ''
  return formatPercentageValue(val ?? 0).value
}
</script>
