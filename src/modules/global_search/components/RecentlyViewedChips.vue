<template>
  <div v-if="recentlyViewedTop6.length">
    <div class="px-3">
      <p class="text-s-14 text-black mb-4">
        {{ $t('search.opened_recently') }}
      </p>
      <div class="flex flex-wrap items-start gap-2">
        <button
          v-for="item in recentlyViewedTop6"
          :key="item.id"
          type="button"
          class="flex items-center gap-1.5 pl-1 pr-2 py-1 bg-surface-hover hover:bg-surface rounded-[8px] transition-colors"
          @click="selectAsset(item)"
        >
          <app-token-logo
            :url="item.icon"
            :symbol="item.symbol"
            :is-stock="item.isStock"
            width="w-5"
            height="h-5"
          />
          <app-token-symbol
            :symbol="item.symbol"
            :is-stock="item.isStock"
            class="!text-s-11 font-bold tracking-sp-06"
          />
        </button>
      </div>
    </div>
    <div class="h-px bg-grey-5 mt-4 mb-2" />
  </div>
</template>

<script setup lang="ts">
import AppTokenLogo from '@/components/AppTokenLogo.vue'
import AppTokenSymbol from '@/components/AppTokenSymbol.vue'
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { recentlyViewedTop6, selectAsset } = useGlobalSearch()
</script>
