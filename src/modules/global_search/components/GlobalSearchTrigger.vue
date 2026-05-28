<template>
  <div class="relative">
    <button
      type="button"
      class="w-9 h-9 flex items-center justify-center rounded-full hover:bg-mewBg"
      @click="open"
    >
      <magnifying-glass-icon class="w-5 h-5" />
    </button>
    <div
      v-if="isOpen"
      class="fixed inset-x-0 top-0 z-30 bg-white px-4 py-3 flex items-center gap-2 shadow"
    >
      <input
        ref="inputEl"
        v-model="query"
        type="text"
        :placeholder="$t('search.placeholder')"
        class="flex-1 bg-mewBg rounded-full px-4 py-2 outline-none text-s-14"
      />
      <button class="text-s-13 font-medium text-primary" @click="close">
        {{ $t('search.cancel') }}
      </button>
    </div>
    <global-search-popover />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useGlobalSearch } from '../composables/useGlobalSearch'
import GlobalSearchPopover from './GlobalSearchPopover.vue'

const { isOpen, query, open, close } = useGlobalSearch()

const inputEl = ref<HTMLInputElement | null>(null)
watch(isOpen, async open => {
  if (!open) return
  await nextTick()
  inputEl.value?.focus()
})
</script>
