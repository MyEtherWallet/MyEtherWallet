<template>
  <div class="relative">
    <AppIcon
      name="magnifying-glass"
      :size="size === 'compact' ? 's' : 'm'"
      @click="searchInput?.focus()"
      :class="[
        // Figma Searchbar keeps icon/subtle in every state (no brand on focus).
        'absolute left-0 mx-3 cursor-pointer text-icon-subtle',
        size === 'compact' ? 'top-2.5' : 'top-2',
      ]"
    />

    <input
      ref="searchInput"
      type="text"
      v-model="model"
      :class="[
        'grow focus:outline-none focus:ring-0 border-none text-sm text-text-default rounded-full h-10 w-full py-1 transition-shadow',
        size === 'compact' ? 'pl-10 text-[15px]' : 'pl-[46px] text-[17px]',
        bgClass,
        // Keyboard Focus gets the DS brand ring (same rule as Input); clicking
        // in or typing is Active, so the icon and field stay as in Figma.
        inFocusInput && !isActive ? 'inset-ring-2 inset-ring-border-brand' : '',
        inputClass,
      ]"
      :aria-label="placeholder || $t('common.search')"
      :placeholder="placeholder || $t('common.search')"
      @pointerdown="setActive()"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="setActive()"
    />
    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
      <app-btn-icon
        @click="clearInputValue"
        :class="[
          // Empty or not yet bound (undefined) → no clear action.
          model ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
        :label="$t('common.clear_icon')"
      >
        <!-- Figma Searchbar clear: bare 16px cross -->
        <AppIcon name="x-mark" size="xxs" class="text-icon-default"
      /></app-btn-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, type PropType } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import { useInFocusInput } from '@/composables/useInFocusInput'
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
const {
  inFocusInput,
  isActive,
  setActive,
  setInFocusInput,
  startOutOfFocusTimeout,
} = useInFocusInput(searchInput)

/**
 * clear the input value, set focus to the input field
 */
const clearInputValue = () => {
  setActive()
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
