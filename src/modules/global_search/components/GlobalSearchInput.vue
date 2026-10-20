<template>
  <div
    ref="wrapperEl"
    :class="[
      'relative min-w-0',
      isCompact ? '' : 'w-60',
      isOpen ? 'z-[2]' : '',
    ]"
    @keydown="trapFocus"
  >
    <app-btn-icon
      v-if="isCompact"
      icon="magnifying-glass"
      size="l"
      variant="filled"
      :label="$t('search.placeholder')"
      @click="open"
    />
    <app-searchbar
      v-else
      v-model="query"
      :placeholder="$t('search.placeholder')"
      @focusin="open"
      @click="open"
    />
    <global-search-popover :is-compact="isCompact" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { useAppBreakpoints } from '@/composables/useAppBreakpoints'
import { useGlobalSearch } from '../composables/useGlobalSearch'
import GlobalSearchPopover from './GlobalSearchPopover.vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppSearchbar from '@/components/AppSearchbar.vue'

const { query, open, isOpen, close } = useGlobalSearch()
const { breakpoints } = useAppBreakpoints()

const wrapperEl = ref<HTMLElement | null>(null)

// Navbar (Figma 1078:1485): Searchbar on desktop, a 40px search button < 1280.
const isCompact = computed(() => breakpoints.smaller('xl').value)

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
