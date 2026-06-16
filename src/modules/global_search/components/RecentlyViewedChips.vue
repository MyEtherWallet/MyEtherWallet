<template>
  <div v-if="recentlyViewedTop6.length">
    <div class="px-3">
      <p class="text-s-11 font-bold uppercase tracking-sp-06 mb-3">
        {{ $t('search.opened_recently') }}
      </p>
      <div class="flex flex-wrap items-start gap-2">
        <button
          v-for="item in recentlyViewedTop6"
          :key="item.id"
          type="button"
          class="flex items-center gap-2 px-1.5 py-1.5 bg-[#f5f5f5] hover:bg-surface rounded-[8px] transition-colors"
          @click="selectAsset(item)"
        >
          <img
            v-if="item.icon"
            :src="item.icon"
            :alt="item.symbol"
            class="w-5 h-5 rounded-full flex-none"
          />
          <div v-else class="w-5 h-5 rounded-full bg-surface flex-none" />
          <span class="text-s-11 font-bold truncate uppercase tracking-sp-06 pr-2">{{ item.symbol }}</span>
        </button>
      </div>
    </div>
    <div class="h-px bg-grey-5 mt-4 mb-2" />
  </div>
</template>

<script setup lang="ts">
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { recentlyViewedTop6, selectAsset } = useGlobalSearch()
</script>
