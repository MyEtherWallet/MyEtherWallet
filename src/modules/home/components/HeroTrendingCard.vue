<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, type RouteLocationRaw } from 'vue-router'
import AppCell from '@/components/AppCell.vue'
import AppAvatar from '@/components/avatar/AppAvatar.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
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

const isUp = (change: number) => change >= 0
const changeText = (change: number) =>
  `${isUp(change) ? '+' : '-'}${Math.abs(change).toFixed(2)}%`
</script>

<template>
  <div
    data-test="hero-trending-card"
    class="flex w-full min-w-0 flex-col gap-4 rounded-2xl bg-background-alternative px-2 py-3"
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
          class="text-label-base text-text-default transition-colors group-hover:text-text-brand"
        >
          {{ title }}
        </span>
      </button>
      <span class="text-text-sm text-text-subtle">
        {{ t('homePage.hero.last24h') }}
      </span>
    </div>

    <!-- Body: 4px gap between rows, each row a small design-library Cell. -->
    <div class="flex w-full flex-col gap-1">
      <template v-if="isLoading">
        <AppCell
          v-for="n in 5"
          :key="n"
          size="small"
          loading
          data-test="trending-skeleton"
        >
          <template #avatar />
          <template #accessory />
        </AppCell>
      </template>

      <p
        v-else-if="!items.length"
        data-test="trending-empty"
        class="px-3 py-2 text-text-sm text-text-subtle"
      >
        {{ t('homePage.hero.empty') }}
      </p>

      <AppCell
        v-for="item in items"
        v-else
        :key="item.symbol"
        size="small"
        :description="item.name"
        data-test="token-list-row"
        @click="router.push(item.to)"
      >
        <template #avatar="{ size }">
          <AppAvatar
            :size="size"
            :type="item.isStock ? 'stocks' : 'cryptoAsset'"
            :url="item.logo"
            :symbol="item.symbol"
          />
        </template>
        <template #title>
          <AppTokenSymbol
            :symbol="item.symbol"
            :is-stock="item.isStock"
            class="!text-label-base text-text-default"
          />
        </template>
        <template #accessory>
          <p class="text-label-base text-text-default">
            {{ formatFiat(item.price).display }}
          </p>
          <p
            class="text-text-sm"
            :class="isUp(item.change) ? 'text-text-success' : 'text-text-error'"
            data-test="token-list-row-change"
          >
            {{ changeText(item.change) }}
          </p>
        </template>
      </AppCell>
    </div>
  </div>
</template>
