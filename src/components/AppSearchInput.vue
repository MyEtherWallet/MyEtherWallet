<template>
  <div class="relative">
    <magnifying-glass-icon
      :class="[
        'absolute top-2 left-0 w-6 h-6 mx-3 cursor-pointer',
        inFocusInput ? 'text-primary' : 'text-info',
      ]"
      @click="searchInput?.focus()"
    />

    <input
      ref="searchInput"
      type="text"
      v-model="model"
      class="grow focus:outline-none focus:ring-0 bg-white border-none text-sm text-normal rounded-full h-10 w-full pl-[46px] py-1 text-[17px] transition-colors"
      :aria-label="placeholder"
      :placeholder="placeholder"
      @focus="inFocusInput = true"
      @blur="inFocusInput = false"
    />
    <div class="absolute top-1 right-3 flex align-center">
      <app-btn-icon
        @click="clearInputValue"
        :class="[
          model !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
        :label="$t('common.clear_icon')"
      >
        <x-circle-icon class="text-grey-50 w-6 h-6"
      /></app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { MagnifyingGlassIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { defineProps } from 'vue'

/**
 * @description AppSearchInput component, used to display a search input field with a clear button.
 *
 * @example
 * <app-search-input v-model="searchInput" />
 */

defineProps({
  /**
   * @placeholder The placeholder text of the input field. Also used as the aria label.
   */
  placeholder: {
    type: String,
    default: 'Search',
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
