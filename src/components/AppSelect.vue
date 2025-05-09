<template>
  <div class="relative text-s-17 leading-p-130 font-medium">
    <label for="select" class="sr-only">
      {{ props.placeholder }}
    </label>
    <slot name="select-button">
      <button class="rounded-full hoverNoBG p-2" @click="toggleSelect">
        <div class="flex items-center">
          <span>{{ showSelected }}</span>
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
        ref="target"
        role="listbox"
        aria-label="Select an option"
        v-show="openSelect"
        class="absolute -left-4 origin-top-right focus:outline-none"
      >
        <div
          class="px-3 py-3 min-w-60 max-w-full bg-white shadow-[0px_8px_16px_-6px_rgba(0,0,0,0.32)] rounded-xl"
        >
          <div class="grid grid-cols-1">
            <button
              v-for="option in options"
              :key="option.value"
              class="flex items-center py-3 px-2 hoverNoBG rounded-lg"
              role="option"
              :id="option.value"
              @click="selectOption(option)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * AppSelect component
 *
 * @example
 * <app-select
 *   v-model:selected="selectedOption"
 *   :options="options"
 *   placeholder="Select an option"
 */
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { defineProps, ref } from 'vue'
import { type AppSelectOption } from '@/types/components/appSelect'
import { computed } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  /**
   * @placeholder The placeholder text of the button field. Also used as the aria label.
   */
  placeholder: {
    type: String,
  },
  /**
   * @options The options for the select dropdown.
   */
  options: {
    type: Array as () => AppSelectOption[],
    required: true,
  },
})

/**
 * @target The target element for the dropdown.
 * This is used in outside click detection.
 */
const target = ref<HTMLElement | null>(null)
const targetValue = ref<HTMLElement | null>(null)
/**
 * @model The v-model for the input field.
 */
const selected = defineModel<AppSelectOption>('selected', { required: true })
/**
 * controls the open state of the select dropdown
 */
const openSelect = ref(false)

/**
 * @showSelected The text that is shown in the button field.
 * If a placeholder is provided, it will be shown before the selected option.
 */
const showSelected = computed(() => {
  return props.placeholder
    ? `${props.placeholder} ${selected.value?.label}`
    : selected.value.label
})

/**
 * @method toggleSelect
 * Toggles the open state of the select dropdown.
 */
const toggleSelect = () => {
  openSelect.value = !openSelect.value
  if (openSelect.value) {
    targetValue.value = target.value
  }
}

onClickOutside(targetValue, () => {
  targetValue.value = null
  openSelect.value = false
})

/**
 * @method selectOption
 * Sets the selected option and closes the dropdown.
 */
const selectOption = (option: AppSelectOption) => {
  selected.value = option
  toggleSelect()
}
</script>
