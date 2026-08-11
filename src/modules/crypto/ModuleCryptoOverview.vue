<template>
  <div class="grid grid-cols-12 w-full gap-5 2xl:gap-10 items-stretch mb-4">
    <!-- OVERVIEW STATS -->
    <div
      class="col-span-12 grid grid-cols-4 lg:grid-cols-[140px_1fr_1fr_1fr_1fr] items-center justify-between gap-4 lg:gap-8 mb-8 mt-2"
    >
      <h2
        class="col-span-4 lg:col-span-1 text-s-18 md:text-s-24 font-bold md:ml-2 leading-p-120 min-w-[140px]"
      >
        {{ $t('crypto.crypto_today') }}
      </h2>
      <div
        class="border-l border-line pl-4 md:pl-6 h-full flex flex-col justify-center"
      >
        <p
          class="text-s-8 md:text-s-10 text-fg-subtle uppercase tracking-sp-06 font-bold mb-1"
        >
          {{ $t('crypto.total_market_cap') }}
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-14 md:text-s-18 font-bold leading-p-150"
        >
          {{ formatFiat(data.marketCap).display }}
          <span
            class="text-s-10 md:text-s-13 font-bold leading-p-150 ml-1"
            :class="{
              'text-error': data.marketCapChange24hPercentage < 0,
              'text-success': data.marketCapChange24hPercentage >= 0,
            }"
          >
            {{
              BigNumber(data.marketCapChange24hPercentage).isLessThan(0)
                ? ''
                : '+'
            }}
            {{
              formatPercentageValue(
                BigNumber(data.marketCapChange24hPercentage),
              ).value
            }}
          </span>
        </p>

        <div
          v-else
          class="animate-pulse bg-surface-strong rounded-full h-6 w-3/4"
        ></div>
      </div>
      <div
        class="border-l border-line pl-4 md:pl-6 h-full flex flex-col justify-center"
      >
        <p
          class="text-s-8 md:text-s-10 text-fg-subtle uppercase tracking-sp-06 font-bold mb-1"
        >
          {{ $t('crypto.twenty_four_h_trading_volume') }}
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-14 md:text-s-18 font-bold leading-p-150"
        >
          {{ formatFiat(data.volume24h).display }}
        </p>
        <div
          v-else
          class="animate-pulse bg-surface-strong rounded-full h-6 w-3/4"
        ></div>
      </div>
      <div
        class="border-l border-line pl-4 md:pl-6 h-full flex flex-col justify-center"
      >
        <p
          class="text-s-8 md:text-s-10 text-fg-subtle uppercase tracking-sp-06 font-bold mb-1"
        >
          {{ $t('crypto.btc_dominance') }}
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-14 md:text-s-18 font-bold leading-p-150"
        >
          {{
            data.btcDominancePercentage !== undefined
              ? formatPercentageValue(data.btcDominancePercentage).value
              : '-'
          }}
        </p>

        <div
          v-else
          class="animate-pulse bg-surface-strong rounded-full h-6 w-3/4"
        ></div>
      </div>
      <div
        class="border-l border-line pl-4 md:pl-6 h-full flex flex-col justify-center"
      >
        <p
          class="text-s-8 md:text-s-10 text-fg-subtle uppercase tracking-sp-06 font-bold mb-1"
        >
          {{ $t('crypto.eth_dominance') }}
        </p>
        <p
          v-if="data && !isLoading"
          class="text-s-14 md:text-s-18 font-bold leading-p-150"
        >
          {{
            data.ethDominancePercentage !== undefined
              ? formatPercentageValue(data.ethDominancePercentage).value
              : '-'
          }}
        </p>

        <div
          v-else
          class="animate-pulse bg-surface-strong rounded-full h-6 w-3/4"
        ></div>
      </div>
    </div>
    <!-- NEW TOKENS -->
    <OverviewContainer
      :title="$t('crypto.new_tokens')"
      :current-page="currPageNewTokens"
      :total-pages="totalPagesNewTokens"
      :is-loading="isLoading"
      @nextPage="nextPageNewTokens"
      @previousPage="prevPageNewTokens"
      class="col-span-12 lg:col-span-4"
    >
      <template #tokens>
        <div v-if="data && !isLoading" class="flex flex-col">
          <token-row
            v-for="(token, index) in paginatedNewTokensArray"
            :key="token.symbol + index"
            :token="token"
          />
        </div>
      </template>
    </OverviewContainer>
    <div class="w-full flex items-stretch flex-col col-span-12 lg:col-span-4">
      <module-trending />
    </div>
    <!-- RWA TOP Gainers-->
    <OverviewContainer
      :title="$t('crypto.rwa_top_gainers')"
      :current-page="currPageGainersTokens"
      :total-pages="totalPagesGainersTokens"
      :is-loading="isLoading"
      @nextPage="nextPageGainersTokens"
      @previousPage="prevPageGainerTokens"
      class="col-span-12 lg:col-span-4"
    >
      <template #tokens>
        <div v-if="data && !isLoading" class="flex flex-col">
          <token-row
            v-for="(token, index) in paginatedGainersTokensArray"
            :key="token.name + index"
            :token="token"
          />
        </div>
      </template>
    </OverviewContainer>
  </div>
</template>

<script setup lang="ts">
import OverviewContainer from './components/overview/OverviewContainer.vue'
import TokenRow from './components/overview/TokenRow.vue'
import { useFetchMewApi } from '@/composables/useFetchMewApi'
import { ref } from 'vue'
import { useCurrency } from '@/composables/useCurrency'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import type { CryptoOverview, CryptoOverviewToken } from '@/mew_api/types'
import BigNumber from 'bignumber.js'
import ModuleTrending from '@/modules/crypto/ModuleTrending.vue'
import { usePaginate } from '@/composables/usePaginate'

const { useMEWFetch } = useFetchMewApi()
const { formatFiat } = useCurrency()

const newTokens = ref<CryptoOverviewToken[]>([])
const gainersTokens = ref<CryptoOverviewToken[]>([])
const fetchUrl = '/v1/web/overview'
const {
  data,
  onFetchResponse,
  isFetching: isLoading,
} = useMEWFetch(fetchUrl).get().json<CryptoOverview>()

onFetchResponse(() => {
  if (data.value) {
    newTokens.value = data.value.newCoins
    gainersTokens.value = data.value.ondoTopGainers.map(
      (gainer): CryptoOverviewToken => {
        return {
          coinId: 'ondo-' + gainer.primaryMarket.symbol,
          name: gainer.stockAlias || '',
          symbol: gainer.primaryMarket.symbol,
          logoUrl: gainer.iconPngUrl || null,
          price: new BigNumber(gainer.primaryMarket.price).toNumber(),
          priceChangePercentage24h: new BigNumber(
            gainer.primaryMarket.priceChangePercentage24h,
          ).toNumber(),
          ondo: {
            stockAlias: gainer.stockAlias,
            primaryMarket: gainer.primaryMarket,
          },
        }
      },
    )
  }
})

const {
  currentPage: currPageNewTokens,
  paginatedArray: paginatedNewTokensArray,
  nextPage: nextPageNewTokens,
  prevPage: prevPageNewTokens,
  totalPages: totalPagesNewTokens,
} = usePaginate<CryptoOverviewToken>(newTokens, 3)

const {
  currentPage: currPageGainersTokens,
  paginatedArray: paginatedGainersTokensArray,
  nextPage: nextPageGainersTokens,
  prevPage: prevPageGainerTokens,
  totalPages: totalPagesGainersTokens,
} = usePaginate<CryptoOverviewToken>(gainersTokens, 3)
</script>
