<template>
  <div class="relative">
    <textarea
      ref="baseInput"
      type="text"
      v-model="model"
      v-bind="$attrs"
      :placeholder="props.placeholder"
      :readonly="props.readonly"
      :class="[
        {
          '!border-error border-2': hasError,
        },
        {
          '!border-primary !border-2': inFocusInput && !hasError,
        },
        'grow focus:outline-none focus:ring-0 bg-white border border-1 border-grey-10 text-s-17 rounded-20 h-[160px] w-full px-6 pt-5 pb-4 transition-colors placeholder:text-grey-30',
      ]"
      :aria-label="placeholder"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
      autocomplete="off"
    />
    <div class="flex items-center min-h-[32px] mt-1">
      <p v-if="errorMessage" class="pl-4 text-error text-s-12 leading-tight">
        {{ errorMessage }}
      </p>
      <p
        v-else-if="hasRequiredError"
        class="pl-4 text-error text-s-12 leading-tight"
      >
        {{ $t('common.required') }}
      </p>
      <button
        v-if="model && model !== ''"
        @click="clearInputValue"
        class="text-s-14 font-medium text-primary hoverOpacity ml-auto px-2"
      >
        {{ $t('common.clear') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'
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
  readonly: {
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
