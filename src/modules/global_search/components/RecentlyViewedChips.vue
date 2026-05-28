<template>
  <div v-if="recentlyViewedTop6.length" class="px-4 py-3">
    <p class="text-s-11 font-bold uppercase tracking-sp-06 mb-2">
      {{ $t('search.opened_recently') }}
    </p>
    <div class="grid grid-cols-3 gap-2">
      <button
        v-for="item in recentlyViewedTop6"
        :key="item.id"
        type="button"
        class="flex items-center gap-2 px-3 py-2 bg-mewBg hover:bg-surface rounded-full transition-colors"
        @click="selectAsset(item)"
      >
        <img
          v-if="item.icon"
          :src="item.icon"
          :alt="item.symbol"
          class="w-5 h-5 rounded-full flex-none"
        />
        <div v-else class="w-5 h-5 rounded-full bg-surface flex-none" />
        <span class="text-s-12 font-medium truncate">{{ item.symbol }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalSearch } from '../composables/useGlobalSearch'

const { recentlyViewedTop6, selectAsset } = useGlobalSearch()
</script>
