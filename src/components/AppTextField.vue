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
        'w-full h-[160px] px-4 py-3 rounded-12 text-sm leading-5 text-black placeholder:text-grey-subtle focus:outline-none focus:ring-0',
        surfaceClass,
      ]"
      autocomplete="off"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @input="onInput"
    />
    <div class="flex items-center gap-1 min-h-6 px-4 mt-1">
      <template v-if="showFeedback">
        <exclamation-circle-icon class="w-5 h-5 shrink-0 text-error" />
        <p
          :id="feedbackId"
          class="text-xs leading-[18px] text-error min-w-0 break-words"
        >
          {{ errorMessage || $t('common.required') }}
        </p>
      </template>
      <button
        v-if="hasValue"
        @click="clearInputValue"
        class="text-s-14 font-medium text-primary hoverOpacity ml-auto px-2"
      >
        {{ $t('common.clear') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, useId, type PropType } from 'vue'
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline'
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
    (!!props.errorMessage && props.errorMessage !== '') ||
    hasRequiredError.value,
)
const showFeedback = computed(() => hasError.value)

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
  const ring = hasError.value ? 'border-error' : 'border-primary'

  if (props.surface === 'alternative') {
    if (inFocusInput.value) return `${base} bg-white border-2 ${ring}`
    return `${base} bg-white border border-border-default hover:border-2 hover:border-grey-subtle`
  }

  if (inFocusInput.value) return `${base} bg-bgBase border-2 ${ring}`
  return `${base} bg-bgBase border-2 border-transparent hover:border-grey-subtle`
})

const clearInputValue = () => {
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
