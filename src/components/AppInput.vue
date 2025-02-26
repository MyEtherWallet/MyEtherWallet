<template>
  <div class="relative min-h-[86px]">
    <input
      ref="baseInput"
      :type="inputType"
      v-model="model"
      :class="[
        {
          '!border-error border-2': hasError,
        },
        {
          '!border-primary !border-2': inFocusInput && !hasError,
        },
        'grow focus:outline-none focus:ring-0 bg-white border border-1 border-grey-30  text-sm text-normal rounded-[20px] h-[58px] w-full pl-7 pl-7 pr-20 pt-[24px] pb-[10px] text-xl transition-colors',
      ]"
      :required="isRequired"
      :aria-label="placeholder"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
      auotcomplete="off"
    />
    <span
      :class="[
        'pointer-events-none absolute top-[17px] left-5 bottom-auto transition-all pl-2 aria-hidden',
        inFocusInput ? (hasError ? 'text-error' : 'text-primary') : 'text-info',
        { 'text-[10px] translate-y-[-70%]': inFocusInput || model !== '' },
      ]"
    >
      {{ placeholder }}
    </span>
    <div class="absolute top-3 right-3 flex align-center">
      <app-btn-icon-close
        @click="clearInputValue"
        :class="[
          model !== '' ? 'opacity-100' : 'hidden',
          'transition-opacity opacity-0',
        ]"
      />
      <app-btn-icon
        v-if="type === 'password'"
        @click="togglePasswordVisibility"
        :label="!showPassword ? 'Show Password' : 'Hide Password'"
      >
        <component :is="!showPassword ? EyeSlashIcon : EyeIcon" />
      </app-btn-icon>
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
  watch,
} from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import AppBtnIconClose from '@/components/AppBtnIconClose.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { useInFocusInput } from '@/composables/useInFocusInput'

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
    default: 'text',
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
const { inFocusInput, setInFocusInput, startOutOfFocusTimeout } =
  useInFocusInput(baseInput)

watch(inFocusInput, value => {
  if (!value) {
    hasRequiredError.value = false
    if (props.isRequired && model.value === '') {
      hasRequiredError.value = true
    }
  }
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
