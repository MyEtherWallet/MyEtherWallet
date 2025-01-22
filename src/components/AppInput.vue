<template>
  <div class="relative mb-7">
    <input
      ref="baseInput"
      :type="inputType"
      v-model="model"
      :class="[
        {
          '!border-error border-2 focus:ring-error': hasError,
        },
        {
          '!border-primary !border-2 focus:ring-primary':
            inFocusInput && !hasError,
        },
        'grow focus:ring-none bg-white border border-1 border-grey-30  text-sm text-normal rounded-[20px] h-[58px] w-full pl-7 pl-7 pr-20 pt-[24px] pb-[10px] text-xl transition-all',
      ]"
      :required="isRequired"
      :aria-label="placeholder"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
    />
    <span
      :class="[
        'pointer-events-none absolute top-[16px] left-5 top-auto bottom-auto  transition-all pl-2 aria-hidden ',
        inFocusInput ? 'text-primary' : 'text-info',
        { 'text-[10px] translate-y-[-70%]': inFocusInput || model !== '' },
      ]"
    >
      {{ placeholder }}
    </span>
    <div class="absolute top-3 right-3 flex align-center">
      <AppBtnIconClose
        @click="clearInputValue"
        :class="[
          model !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
      />
      <AppBtnIcon
        v-if="type === 'password'"
        @click="togglePasswordVisibility"
        :aria-label="!showPassword ? 'Show Password' : 'Hide Password'"
      >
        <component :is="!showPassword ? EyeSlashIcon : EyeIcon" />
      </AppBtnIcon>
    </div>
    <p
      v-if="errorMessage"
      class="pl-4 pt-[1px] absolute text-error text-[12px] leading-[23px]"
    >
      {{ errorMessage }}
    </p>
    <p
      v-else-if="hasRequiredError"
      class="pl-4 pt-[1px] absolute text-error text-[12px] leading-[23px]"
    >
      required
    </p>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  type PropType,
  type InputTypeHTMLAttribute,
  computed,
  onBeforeUnmount,
} from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'

import { defineProps } from 'vue'
import { useTimeoutFn } from '@vueuse/core'

const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<InputTypeHTMLAttribute>,
    required: true,
    default: '',
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const model = defineModel()
const baseInput = ref<HTMLElement | null>(null)

/**------------------------
 * Password Visibility
 -------------------------*/
const showPassword = ref(false)

/**
 * Toggles the visibility of the password input field.
 *
 * This function sets the input field to be in focus and then toggles the
 * visibility of the password after the next DOM update cycle.
 *
 * @function togglePasswordVisibility
 */
const togglePasswordVisibility = () => {
  setInFocusInput()
  nextTick(() => {
    showPassword.value = !showPassword.value
  })
}

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
/**------------------------
 * Error State
 -------------------------*/
const hasRequiredError = ref(false)

const hasError = computed(
  () =>
    (props.errorMessage && props.errorMessage !== '') || hasRequiredError.value,
)

/**------------------------
 * Focus State
 -------------------------*/
const inFocusInput = ref(false)

/**
 * Destructures the `useTimeoutFn` function to handle the out-of-focus timeout for the input field.
 *
 * @constant {boolean} isPendingOutOfFocusTimeout - Indicates if the timeout is currently pending.
 * @function startOutOfFocusTimeout - Starts the out-of-focus timeout.
 * @function stopOutOfFocusTimeout - Stops the out-of-focus timeout.
 *
 * The timeout function sets `inFocusInput` to false and checks if the input is required and empty.
 * If the input is required and empty, it sets `hasRequiredError` to true.
 *
 * @param {number} 150 - The duration of the timeout in milliseconds.
 * @param {Object} { immediate: false } - Does not start the timeout immediately.
 */
const {
  isPending: isPendingOutOfFocusTimeout,
  start: startOutOfFocusTimeout,
  stop: stopOutOfFocusTimeout,
} = useTimeoutFn(
  () => {
    inFocusInput.value = false
    if (props.isRequired && model.value === '') {
      hasRequiredError.value = true
    }
  },
  150,
  { immediate: false },
)

/**
 * Sets the input field to be in focus.
 * If there is a pending out-of-focus timeout, it stops the timeout.
 * Sets the `inFocusInput` to true and focuses the `baseInput`.
 *
 * This function should be called when the input field needs to be focused.
 */
const setInFocusInput = () => {
  if (isPendingOutOfFocusTimeout.value) {
    stopOutOfFocusTimeout()
  }
  inFocusInput.value = true
  baseInput.value?.focus()
}

/* The `onBeforeUnmount` lifecycle hook ensures that the out-of-focus timeout
 * is stopped when the component is about to be unmounted.
 */
onBeforeUnmount(() => {
  stopOutOfFocusTimeout()
})

/**------------------------
 * Debounce Input
 -------------------------*/
const onInput = () => {
  if (hasRequiredError.value) {
    hasRequiredError.value = false
  }
}

const clearInputValue = () => {
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
