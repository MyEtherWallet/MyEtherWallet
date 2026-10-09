<template>
  <div class="relative">
    <AppIcon
      name="magnifying-glass"
      :size="size === 'compact' ? 's' : 'm'"
      @click="searchInput?.focus()"
      :class="[
        'absolute left-0 mx-3 cursor-pointer',
        size === 'compact' ? 'top-2.5' : 'top-2',
        // Figma Searchbar keeps icon/subtle in every state (no brand on focus).
        'text-icon-subtle',
      ]"
    />

    <input
      ref="searchInput"
      type="text"
      v-model="model"
      :class="[
        'grow focus:outline-none focus:ring-0 border-none text-sm text-text-default rounded-full h-10 w-full py-1 transition-colors',
        size === 'compact' ? 'pl-10 text-[15px]' : 'pl-[46px] text-[17px]',
        bgClass,
        inputClass,
      ]"
      :aria-label="placeholder || $t('common.search')"
      :placeholder="placeholder || $t('common.search')"
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
      <app-btn-icon
        @click="clearInputValue"
        :class="[
          model !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
        :label="$t('common.clear_icon')"
      >
        <AppIcon
          name="x-mark"
          :size="size === 'compact' ? 's' : 'm'"
          class="text-icon-default"
      /></app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, type PropType } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
/**
 * @description AppSearchbar component, used to display a search input field with a clear button.
 *
 * @example
 * <app-searchbar v-model="searchInput" />
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
   * @bgClass The background color of the input field. Defaults to the Figma
   * Searchbar Default fill (background/formfield); inside a grey pill wrapper
   * (Figma Outline) pass `bg-background-alternative`.
   */
  bgClass: {
    type: String,
    default: 'bg-background-formfield',
  },
  /**
   * @size 'default' (24px icon, text-17) or 'compact' (20px icon, text-15).
   */
  size: {
    type: String as PropType<'default' | 'compact'>,
    default: 'default',
  },
  inputClass: {
    type: String,
    default: '',
  },
})

/**
 * @model The v-model for the input field.
 */
const model = defineModel()
const searchInput = ref<HTMLElement | null>(null)

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
