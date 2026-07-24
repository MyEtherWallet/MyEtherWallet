<template>
  <div ref="target" class="relative text-s-14 leading-p-130 font-medium">
    <label for="select" class="sr-only">
      {{ props.placeholder }}
    </label>
    <slot
      name="select-button"
      :toggleSelect="toggleSelect"
      :openSelect="openSelect"
    >
      <button class="rounded-full hoverNoBG p-2" @click="toggleSelect">
        <div class="flex items-center">
          <span>{{ selected ? selected.label : '' }}</span>
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
        :aria-label="$t('common.select_an_option')"
        v-show="openSelect"
        class="absolute top-full focus:outline-none z-[500] pt-2"
        :class="position"
      >
        <div
          class="p-1.5 min-w-[200px] max-w-full bg-white shadow-xl rounded-3xl border border-grey-10 overflow-hidden"
        >
          <div v-if="useVueRouter" class="grid grid-cols-1 gap-1">
            <router-link
              v-for="option in options"
              :key="option.value"
              class="flex items-center px-4 h-12 hover:bg-grey-5 hover:text-primary rounded-2xl text-s-14 font-medium text-grey-60 transition-colors"
              active-class="bg-grey-5 !text-primary"
              role="option"
              :id="option.value"
              :to="{ name: option.value }"
              @click="selectOption(option)"
            >
              {{ option.label }}
            </router-link>
          </div>
          <div v-else-if="useLink" class="grid grid-cols-1 gap-1">
            <a
              v-for="option in options"
              :key="option.value"
              class="flex items-center px-4 h-12 hover:bg-grey-5 hover:text-primary rounded-2xl text-s-14 font-medium text-grey-60 transition-colors"
              role="option"
              :id="option.value"
              :href="option.value"
              target="_blank"
              @click="selectOption(option)"
            >
              {{ option.label }}
            </a>
          </div>
          <div v-else class="grid grid-cols-1 gap-1">
            <button
              v-for="option in options"
              :key="option.value"
              :class="[
                {
                  'bg-grey-5 text-primary':
                    selected && option.value === selected.value,
                },
                'flex text-left items-center px-4 h-12 hover:bg-grey-5 hover:text-primary rounded-2xl text-s-14 font-medium text-grey-60 transition-colors',
              ]"
              role="option"
              :id="option.value"
              @click="selectOption(option)"
            >
              {{ option.label }}
              <check-icon
                v-if="selected && option.value === selected.value"
                class="ml-auto w-8 h-4 text-primary px-2 -mr-3"
              />
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
 *   placeholder="Select an option"/>
 *
 * @example with slot
 * <app-select
 *   v-model:selected="selectedOption"
 *   :options="options"
 *   placeholder="Select an option">
 *   <template #select-button>
 *    <button class="rounded-full hoverNoBG p-2" @click="selectedOption.value = true">
 *   </template>
 * </app-select>
 *
 * @example emit only
 * <app-select
 *   :emit-only="true" @select-option="selectHandler" />
 *
 */
import { ChevronDownIcon, CheckIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { type AppSelectOption } from '@/types/components/appSelect'
import { watch, onBeforeUnmount } from 'vue'
import { onClickOutside, useElementHover } from '@vueuse/core'

const emit = defineEmits<{
  (e: 'select-option'): void
}>()

const props = defineProps({
  /**
   * @placeholder The placeholder text of the button field. Also used as the aria label.
   */
  placeholder: {
    type: String,
  },
  emitOnly: {
    type: Boolean,
    default: false,
  },
  /**
   * @options The options for the select dropdown.
   */
  options: {
    type: Array as () => AppSelectOption[],
    required: true,
  },
  /**
   * @useVueRouter If true, the options will be rendered as router-links.
   */
  useVueRouter: {
    type: Boolean,
    default: false,
  },
  useLink: {
    type: Boolean,
    default: false,
  },
  /**
   * @hasOnHover If true, the dropdown will be opened on hover.
   */
  hasOnHover: {
    type: Boolean,
    default: false,
  },
  position: {
    type: String,
    default: '-left-4',
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
const selected = defineModel<AppSelectOption>('selected', { required: false })
/**
 * controls the open state of the select dropdown
 */
const openSelect = ref(false)

/**
 * @method toggleSelect
 * Toggles the open state of the select dropdown.
 */
const toggleSelect = () => {
  openSelect.value = !openSelect.value
  if (openSelect.value) {
    targetValue.value = target.value
  } else {
    targetValue.value = null
    if (timeout.value) {
      clearTimeout(timeout.value)
      timeout.value = null
    }
  }
}

/*
 * Closes the dropdown when clicking outside of it.
 */
onClickOutside(targetValue, () => {
  targetValue.value = null
  openSelect.value = false
  if (timeout.value) {
    clearTimeout(timeout.value)
    timeout.value = null
  }
})

/**
 * @method selectOption
 * Sets the selected option and closes the dropdown.
 */
const selectOption = (option: AppSelectOption) => {
  selected.value = option
  toggleSelect()
  if (props.emitOnly) {
    emit('select-option')
    return
  }
}

/** ------------------------------
 * Hover
 ------------------------------*/
const isHovered = useElementHover(target)
const timeout = ref<NodeJS.Timeout | null>(null)

watch(isHovered, isHovering => {
  if (props.hasOnHover) {
    if (isHovering) {
      if (timeout.value) {
        clearTimeout(timeout.value)
        timeout.value = null
      }
      openSelect.value = true
      targetValue.value = target.value
    } else {
      timeout.value = setTimeout(() => {
        openSelect.value = false
        targetValue.value = null
      }, 600)
    }
  }
})

onBeforeUnmount(() => {
  if (timeout.value) {
    clearTimeout(timeout.value)
  }
})
</script>
