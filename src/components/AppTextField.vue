<template>
  <div class="w-full">
    <textarea
      ref="baseInput"
      v-model="model"
      v-bind="$attrs"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="isRequired"
      :aria-label="placeholder"
      :aria-invalid="hasError"
      :aria-describedby="showFeedback ? feedbackId : undefined"
      :class="[
        'w-full h-40 px-4 py-3 rounded-12 text-sm leading-5 text-black placeholder:text-text-placeholder focus:outline-none focus:ring-0',
        surfaceClass,
      ]"
      autocomplete="off"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
    />
    <div class="flex items-center min-h-6 pr-4 mt-1">
      <AppInputFeedback
        v-if="showFeedback"
        :id="feedbackId"
        :type="hasError ? 'error' : feedback?.type"
        :message="
          errorMessage ||
          (hasRequiredError ? $t('common.required') : feedback?.message)
        "
      />
      <button
        v-if="hasValue && !readonly"
        @click="clearInputValue"
        class="text-s-14 font-medium text-text-brand hoverOpacity ml-auto px-2"
      >
        {{ $t('common.clear') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, useId, type PropType } from 'vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import type { InputFeedback } from '@/components/input_feedback/types'
import { useInFocusInput } from '@/composables/useInFocusInput'

defineOptions({ inheritAttrs: false })

/**
 * Multi-line text field, restyled to match the design-library `Input`
 * (MEW-1971): same surface tokens, 12px radius and focus-only error ring, at
 * textarea height. No float label — a textarea has no filled/label state.
 *
 * @example Basic
 * <app-text-field v-model="model" placeholder="Message" />
 * @example On a white card/dialog
 * <app-text-field v-model="model" surface="alternative" placeholder="Message" />
 */
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
  },
  /**
   * Figma "Style": 'default' is a grey #f5f5f5 fill (for white surfaces —
   * it disappears on the grey app background); 'alternative' is white with a
   * 1px border (used on white cards/dialogs today, also works on grey).
   */
  surface: {
    type: String as PropType<'default' | 'alternative'>,
    default: 'default',
  },
  errorMessage: {
    type: String,
    required: false,
  },
  /** Success / warning / helper row; `errorMessage` wins when both are set. */
  feedback: {
    type: Object as PropType<InputFeedback>,
    required: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})

const model = defineModel<string>()
const baseInput = ref<HTMLElement | null>(null)
const feedbackId = useId()

const { inFocusInput, setInFocusInput, startOutOfFocusTimeout } =
  useInFocusInput(baseInput)

const hasValue = computed(() => model.value != null && model.value !== '')

/**------------------------
 * Error State
 -------------------------*/
const hasRequiredError = ref(false)
const hasError = computed(
  () =>
    !!props.errorMessage ||
    hasRequiredError.value ||
    props.feedback?.type === 'error',
)
const showFeedback = computed(() => hasError.value || !!props.feedback?.message)

watch(inFocusInput, value => {
  if (!value) {
    hasRequiredError.value = false
    if (props.isRequired && !hasValue.value) {
      hasRequiredError.value = true
    }
  }
})

const onInput = () => {
  if (hasRequiredError.value) {
    hasRequiredError.value = false
  }
}

/**------------------------
 * Surface — mirrors AppInput. Error ring is focus-only.
 -------------------------*/
const surfaceClass = computed(() => {
  const base = 'box-border transition-colors resize-none'
  const ring = hasError.value ? 'border-border-error' : 'border-border-brand'

  if (props.surface === 'alternative') {
    if (inFocusInput.value) return `${base} bg-white border-2 ${ring}`
    // Constant 2px border; the resting 1px line is an inset ring so hover never
    // shifts the text (mirrors AppInput).
    return `${base} bg-white border-2 border-transparent ring-1 ring-inset ring-border-default hover:ring-0 hover:border-border-hover`
  }

  if (inFocusInput.value)
    return `${base} bg-background-default border-2 ${ring}`
  return `${base} bg-background-default border-2 border-transparent hover:border-border-hover`
})

const clearInputValue = () => {
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
