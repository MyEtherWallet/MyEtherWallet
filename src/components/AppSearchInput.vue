<template>
  <div class="relative">
    <magnifying-glass-icon
      :class="[
        'absolute left-0 mx-3 cursor-pointer',
        size === 'compact' ? 'top-2.5 w-5 h-5' : 'top-2 w-6 h-6',
        inFocusInput ? 'text-brand' : 'text-fg-subtle',
      ]"
      @click="searchInput?.focus()"
    />

    <input
      ref="searchInput"
      type="text"
      v-model="model"
      :class="[
        'grow focus:outline-none focus:ring-0 border-none text-sm text-normal rounded-full h-10 w-full py-1 transition-colors',
        size === 'compact' ? 'pl-10 text-[15px]' : 'pl-[46px] text-[17px]',
        bgClass,
      ]"
      :aria-label="placeholder || $t('common.search')"
      :placeholder="placeholder || $t('common.search')"
      @focus="inFocusInput = true"
      @blur="inFocusInput = false"
    />
    <div
      :class="[
        'absolute right-3 flex align-center',
        size === 'compact' ? 'top-2.5' : 'top-1',
      ]"
    >
      <app-btn-icon
        @click="clearInputValue"
        :class="[
          model !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
        :label="$t('common.clear_icon')"
      >
        <x-circle-icon
          :class="['text-brand', size === 'compact' ? 'w-5 h-5' : 'w-6 h-6']"
      /></app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, type PropType } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { XCircleIcon } from '@heroicons/vue/24/outline'

/**
 * @description AppSearchInput component, used to display a search input field with a clear button.
 *
 * @example
 * <app-search-input v-model="searchInput" />
 */

defineProps({
  /**
   * @placeholder The placeholder text of the input field. Also used as the aria label.
   * When empty, falls back to the localized `common.search` string.
   */
  placeholder: {
    type: String,
    default: '',
  },
  /**
   * @bgClass The background color of the input field.
   */
  bgClass: {
    type: String,
    default: 'bg-surface',
  },
  /**
   * @size 'default' (24px icon, text-17) or 'compact' (20px icon, text-15).
   */
  size: {
    type: String as PropType<'default' | 'compact'>,
    default: 'default',
  },
})

/**
 * @model The v-model for the input field.
 */
const model = defineModel()
const searchInput = ref<HTMLElement | null>(null)
const inFocusInput = ref(false)

/**
 * clear the input value, set focus to the input field
 */
const clearInputValue = () => {
  searchInput.value?.focus()
  nextTick(() => {
    model.value = ''
  })
}
</script>
