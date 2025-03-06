<template>
  <div class="relative mb-7">
    <textarea
      ref="baseInput"
      type="text"
      v-model="model"
      v-bind="$attrs"
      :placeholder="props.placeholder"
      :class="[
        {
          '!border-error border-2': hasError,
        },
        {
          '!border-primary !border-2': inFocusInput && !hasError,
        },
        'grow focus:outline-none focus:ring-0 bg-white border border-1 border-grey-outline  text-sm rounded-input h-[160px] w-full px-7 pt-[24px] pb-[10px] text-xl transition-colors',
      ]"
      :aria-label="placeholder"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
      autocomplete="off"
    />
    <div class="flex gap-4">
      <p
        v-if="errorMessage"
        class="pl-4 pt-[1px] text-error text-[12px] leading-[23px]"
      >
        {{ errorMessage }}
      </p>
      <p
        v-else-if="hasRequiredError"
        class="pl-4 pt-[1px] text-error text-[12px] leading-[23px]"
      >
        required
      </p>
      <button
        @click="clearInputValue"
        class="rounded-full px-3 text-sm text-primary hoverOpacity ml-auto h-6"
      >
        clear
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'
import { defineProps } from 'vue'
import { useInFocusInput } from '@/composables/useInFocusInput'
/**
 * Text Field component
 *
 * @example Basic
 * <app-text-field
 *   v-model="model"
 *   placeholder="placeholder"
 *   class="mt-4 text-center" >
 * </app-text-field>
 *
 * @example With error message
 * <app-text-field
 *   v-model="model"
 *   placeholder="placeholder"
 *   :error-message="errorMessage"
 * />
 *
 * @example with custom height and text center
 * <app-text-field
 *   v-model="model"
 *   placeholder="placeholder"
 *   class="h-[600px] text-center" />
 *
 * @example with required field
 * <app-text-field
 *   v-model="model"
 *   placeholder="placeholder"
 *   is-required />
 */

const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  errorMessage: {
    type: String,
    required: false,
  },
  isRequired: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const model = defineModel<string>()
const baseInput = ref<HTMLElement | null>(null)

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
 *  Input
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
