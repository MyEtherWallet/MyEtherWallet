<template>
  <div
    ref="wrapperEl"
    class="relative min-w-0 w-[240px]"
    :class="isOpen ? 'z-[2]' : ''"
    @keydown="trapFocus"
  >
    <button
      v-if="isCompact"
      type="button"
      :aria-label="$t('search.placeholder')"
      class="w-9 h-9 ml-auto flex items-center justify-center rounded-full transition-colors duration-500"
      :class="isOpen ? 'bg-white' : 'bg-mewBg'"
      @click="open"
    >
      <magnifying-glass-icon class="w-5 h-5 text-info" />
    </button>
    <div
      v-else
      class="flex items-center gap-2 px-4 py-2 rounded-full transition-colors duration-500"
      :class="isOpen ? 'bg-white' : 'bg-mewBg'"
    >
      <magnifying-glass-icon class="w-4 h-4 text-info" />
      <input
        v-model="query"
        type="text"
        :placeholder="$t('search.placeholder')"
        :aria-label="$t('search.placeholder')"
        class="flex-1 bg-transparent outline-none text-s-14 placeholder:text-info"
        @focus="open"
        @click="open"
      />
    </div>
    <global-search-popover :is-compact="isCompact" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { onClickOutside, useElementSize } from '@vueuse/core'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useGlobalSearch } from '../composables/useGlobalSearch'
import GlobalSearchPopover from './GlobalSearchPopover.vue'

const COMPACT_WIDTH_THRESHOLD = 200

const { query, open, isOpen, close } = useGlobalSearch()
const { breakpoints } = useAppBreakpoints()

const wrapperEl = ref<HTMLElement | null>(null)
const { width: wrapperWidth } = useElementSize(wrapperEl)

const isCompact = computed(
  () =>
    breakpoints.smaller('sm').value ||
    (wrapperWidth.value > 0 && wrapperWidth.value < COMPACT_WIDTH_THRESHOLD),
)

onClickOutside(wrapperEl, () => {
  if (isOpen.value) close()
})

const trapFocus = (e: KeyboardEvent) => {
  if (e.key !== 'Tab' || !isOpen.value || !wrapperEl.value) return
  const focusable = wrapperEl.value.querySelectorAll<HTMLElement>(
    'input, button, [tabindex]:not([tabindex="-1"])',
  )
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
</script>
