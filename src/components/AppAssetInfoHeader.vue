<template>
  <div class="pb-3 xs:pb-5">
    <div
      class="flex items-center justify-end gap-3 mt-2 sm:mt-4 mb-2 mr-[60px] xs:mr-[60px]"
    >
      <app-share-button :share-text="shareText" :disabled="isLoading" />
      <app-btn-icon
        :label="
          isWatchlisted
            ? $t('common.remove_from_watchlist')
            : $t('common.add_to_watchlist')
        "
        :disabled="isLoading"
        @click="$emit('toggle-watchlist')"
      >
        <star-solid-icon v-if="isWatchlisted" class="h-5 w-5" />
        <star-outline-icon v-else class="h-5 w-5" />
      </app-btn-icon>
    </div>
    <div
      v-if="isLoading || !hasData"
      class="mx-3 xs:mx-6 md:mx-4 lg:mx-10 h-[63px] lg:h-[65px] xl:h-[67px] animate-pulse bg-surface-strong rounded-12 w-[60%]"
    />
    <div
      v-else
      :class="[
        isOpenSideMenu ? 'lg:px-6 2xl:px-10' : 'lg:px-10',
        'px-4 py-0 flex items-start gap-4',
      ]"
    >
      <div class="relative">
        <app-token-logo
          :url="iconUrl"
          :symbol="symbol"
          :is-stock="isStock"
          width="w-10 xs:w-[56px]"
          height="h-10 xs:h-[56px]"
        />
        <div
          class="absolute bottom-0 right-0 translate-y-1/4 translate-x-1/4"
        >
          <app-token-logo
            v-if="selectedChain && existsOnCurrentChain"
            :url="selectedChain.icon"
            :symbol="selectedChain.name"
            width="w-5"
            height="h-5"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <div v-if="isStock" class="flex flex-row flex-wrap items-end gap-2">
          <app-token-symbol
            :symbol="symbol"
            :is-stock="true"
            class="text-s-20 xs:text-s-24 xl:text-s-28 !font-bold !leading-p-110"
          />
          <h1 class="text-s-17 xs:text-s-20 leading-p-110 font-semibold">
            ({{ name }})
          </h1>
        </div>
        <h1
          v-else
          class="text-s-20 xs:text-s-24 leading-p-110 font-bold xl:text-s-28"
        >
          {{ symbol.toUpperCase() }}
          <span class="text-s-17 xs:text-s-20 mr-1 font-semibold"
            >({{ name }})</span
          >
        </h1>
        <div>
          <p class="text-s-20 xs:text-s-24 inline">
            {{ currentPrice ? formatFiat(currentPrice).display : '--' }}
          </p>
          <div v-if="priceChangeNum !== null" class="inline-block ml-2">
            <ArrowTrendingDownIcon
              v-if="priceChangeNum < 0"
              class="w-4 h-4 inline-block text-error"
            />
            <ArrowTrendingUpIcon
              v-else
              class="w-4 h-4 inline-block text-success"
            />
            <span
              :class="[
                {
                  'text-success': priceChangeNum >= 0,
                  'text-error': priceChangeNum < 0,
                },
                'ml-1 text-s-14 xs:text-s-17',
              ]"
            >
              {{ priceChangeDisplay }}
            </span>
          </div>
        </div>
        <p
          v-if="!isLoading && existsOnCurrentChain"
          class="text-s-8 xs:text-s-11 tracking-sp-06 font-bold uppercase text-fg-subtle"
        >
          {{ $t('crypto.on_chain', { chain: selectedChain?.name }) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppShareButton from '@/components/AppShareButton.vue'
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { StarIcon as StarSolidIcon } from '@heroicons/vue/24/solid'
import {
  StarIcon as StarOutlineIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/vue/24/outline'
import { formatPercentageValue } from '@/utils/numberFormatHelper'
import { useCurrency } from '@/composables/useCurrency'

const props = defineProps({
  isLoading: { type: Boolean, required: true },
  hasData: { type: Boolean, required: true },
  shareText: { type: String, required: true },
  isWatchlisted: { type: Boolean, required: true },
  iconUrl: { type: String, default: undefined },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  currentPrice: { type: [Number, String] as PropType<number | string | null>, default: null },
  priceChangePercentage: {
    type: [Number, String] as PropType<number | string | null>,
    default: null,
  },
  selectedChain: {
    type: Object as PropType<{ icon: string; name: string } | null>,
    default: null,
  },
  existsOnCurrentChain: { type: Boolean, default: false },
  isOpenSideMenu: { type: Boolean, required: true },
  isStock: { type: Boolean, default: false },
})

defineEmits<{ 'toggle-watchlist': [] }>()

const { formatFiat } = useCurrency()

const priceChangeNum = computed(() => {
  if (props.priceChangePercentage === null || props.priceChangePercentage === undefined)
    return null
  return Number(props.priceChangePercentage)
})

const priceChangeDisplay = computed(() => {
  if (props.priceChangePercentage === null || props.priceChangePercentage === undefined)
    return ''
  if (props.isStock) return formatPercentageValue(props.priceChangePercentage).value
  return `${Number(props.priceChangePercentage).toFixed(2)}%`
})
</script>
