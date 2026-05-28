<template>
  <div
    class="relative w-full max-w-[360px]"
    :class="isOpen ? 'z-40' : ''"
  >
    <div class="flex items-center gap-2 px-4 py-2 bg-mewBg rounded-full">
      <magnifying-glass-icon class="w-4 h-4 text-info" />
      <input
        v-model="query"
        type="text"
        :placeholder="$t('search.placeholder')"
        class="flex-1 bg-transparent outline-none text-s-14 placeholder:text-info"
        @focus="open"
        @click="open"
      />
    </div>
    <global-search-popover />
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useGlobalSearch } from '../composables/useGlobalSearch'
import GlobalSearchPopover from './GlobalSearchPopover.vue'

const { query, open, isOpen } = useGlobalSearch()
</script>
