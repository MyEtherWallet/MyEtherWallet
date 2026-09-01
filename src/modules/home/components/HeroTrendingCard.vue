<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import AppTokenListRow from '@/components/AppTokenListRow.vue'
import { useCurrency } from '@/composables/useCurrency'
import type { TrendingRowItem } from './heroTrending'

interface Props {
  title: string
  seeAllTo: RouteLocationRaw
  items: TrendingRowItem[]
  isLoading?: boolean
}

defineProps<Props>()

const { t } = useI18n()
const router = useRouter()
const { formatFiat } = useCurrency()
</script>

<template>
  <div
    data-test="hero-trending-card"
    class="flex w-full min-w-0 flex-col gap-4 rounded-2xl bg-white px-2 py-3"
  >
    <!-- Header: title on the left, "Last 24h" on the right. px-3 keeps its
         content aligned with the rows now that the card padding is 8px. -->
    <div class="flex w-full items-end justify-between px-3 py-2">
      <button
        type="button"
        data-test="trending-see-all"
        class="group flex items-center"
        @click="router.push(seeAllTo)"
      >
        <span
          class="text-s-16 font-semibold leading-[22px] tracking-[-0.32px] text-black transition-colors group-hover:text-primary"
        >
          {{ title }}
        </span>
      </button>
      <span class="text-s-14 leading-5 text-[#575757]">
        {{ t('homePage.hero.last24h') }}
      </span>
    </div>

    <!-- Body: 4px gap between rows. -->
    <div class="flex w-full flex-col gap-1">
      <template v-if="isLoading">
        <div
          v-for="n in 5"
          :key="n"
          data-test="trending-skeleton"
          class="flex w-full items-center gap-3 px-3 py-2"
        >
          <div class="size-8 shrink-0 animate-pulse rounded-full bg-[#f0f0f0]" />
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <div class="h-4 w-16 animate-pulse rounded bg-[#f0f0f0]" />
            <div class="h-3.5 w-24 animate-pulse rounded bg-[#f0f0f0]" />
          </div>
          <div class="h-4 w-12 animate-pulse rounded bg-[#f0f0f0]" />
        </div>
      </template>

      <p
        v-else-if="!items.length"
        data-test="trending-empty"
        class="px-3 py-2 text-s-14 text-[#575757]"
      >
        {{ t('homePage.hero.empty') }}
      </p>

      <AppTokenListRow
        v-for="item in items"
        v-else
        :key="item.symbol"
        :logo="item.logo"
        :symbol="item.symbol"
        :name="item.name"
        :is-stock="item.isStock"
        :change="item.change"
        :price-display="formatFiat(item.price).display"
        @select="router.push(item.to)"
      />
    </div>
  </div>
</template>
