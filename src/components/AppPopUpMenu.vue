<template>
  <div ref="target" class="relative">
    <label for="select" class="sr-only">
      {{ props.placeholder }}
    </label>
    <slot name="menu-button" :toggleMenu="toggleMenu">
      <button
        class="rounded-full hoverNoBG p-2 text-s-17 leading-p-130 font-medium"
        @click="toggleMenu"
      >
        <div class="flex items-center">
          <span>{{ placeholder }}</span>
          <chevron-down-icon class="w-4 h-4 ml-1" />
        </div>
      </button>
    </slot>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        role="listbox"
        aria-label="Select an option"
        v-show="openSelect"
        :class="[
          'absolute focus:outline-none z-10',
          { 'left-0': props.location === PopupLocation.LEFT },
          { 'right-0': props.location === PopupLocation.RIGHT },
          { 'inset-x-0': props.location === PopupLocation.CENTER },
        ]"
      >
        <div
          class="min-w-60 max-w-full bg-white shadow-[0px_8px_16px_-6px_rgba(0,0,0,0.32)] rounded-xl"
        >
          <slot name="menu-content" :toggleMenu="toggleMenu" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * @file AppPopUpMenu.vue
 * @description A reusable customizable popup menu component that can be used to create dropdowns / popup menu.
 *
 * @props
 * - placeholder: The placeholder text for the button field, also used as the aria label.
 * - localtion: (left, right, center)
 *
 * @slot
 * - menu-button: Slot for the button that toggles the popup menu.
 * - menu-content: Slot for the content of the popup menu.
 *
 * @example
 * <app-pop-up-menu placeholder="Select an option" location="right">
 *   <template #menu-button="{ toggleMenu }">
 *    <div @click="toggleMenu"> Open Menu </div>
 *   </template>
 *   <template #menu-content="{ toggleMenu }">
 *    <ul>
 *      <li @click="toggleMenu">Option 1</li>
 *      <li @click="toggleMenu">Option 2</li>
 *    </ul>
 *   </template>
 *  * </app-pop-up-menu>
 */
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { defineProps, ref, type PropType } from 'vue'
import { onClickOutside } from '@vueuse/core'
enum PopupLocation {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}
const props = defineProps({
  /**
   * @placeholder The placeholder text of the button field. Also used as the aria label.
   */
  placeholder: {
    type: String,
  },
  /**
   * @location The location of the popup menu.
   * Can be 'left', 'right', or 'center'.
   * Default is 'right'.
   */
  location: {
    type: String as PropType<'left' | 'right' | 'center'>,
    default: 'right',
  },
})

/**
 * @target The target element for the dropdown.
 * This is used in outside click detection.
 */
const target = ref<HTMLElement | null>(null)
const targetValue = ref<HTMLElement | null>(null)
/**
 * controls the open state of the select dropdown
 */
const openSelect = ref(false)

/**
 * @method toggleMenu
 * Toggles the open state of the select dropdown.
 */
const toggleMenu = () => {
  openSelect.value = !openSelect.value
  if (openSelect.value) {
    targetValue.value = target.value
  } else {
    targetValue.value = null
  }
}

/*
 * Closes the dropdown when clicking outside of it.
 */
onClickOutside(targetValue, () => {
  targetValue.value = null
  openSelect.value = false
})
</script>
