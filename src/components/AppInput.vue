<template>
  <div class="w-full">
    <!-- Field box — fixed height, 2px box-border so the ring never shifts it -->
    <div
      :class="[
        'flex items-center gap-2 w-full rounded-12 px-4',
        spec.field,
        surfaceClass,
        { 'cursor-not-allowed': disabled },
      ]"
    >
      <div
        v-if="$slots.leading"
        :class="[
          'shrink-0 rounded-full overflow-hidden flex items-center justify-center',
          spec.avatar,
        ]"
      >
        <slot name="leading" />
      </div>

      <div class="flex flex-col justify-center grow min-w-0">
        <label
          :for="inputId"
          :class="
            isFloating
              ? [
                  'block text-xs font-semibold leading-[18px] tracking-[-0.24px] truncate',
                  disabled ? 'text-text-placeholder' : 'text-text-subtle',
                ]
              : 'sr-only'
          "
        >
          {{ label }}
        </label>
        <input
          :id="inputId"
          ref="baseInput"
          :type="inputType"
          v-model="model"
          :disabled="disabled"
          :placeholder="resolvedPlaceholder"
          :required="isRequired"
          :aria-invalid="!disabled && hasError"
          :aria-describedby="showFeedback ? feedbackId : undefined"
          :class="[
            'w-full bg-transparent focus:outline-none focus:ring-0 text-sm leading-5 placeholder:text-text-placeholder',
            disabled ? 'text-text-placeholder' : 'text-black',
          ]"
          autocomplete="off"
          @focus="setInFocusInput()"
          @blur="startOutOfFocusTimeout()"
          @input="onInput"
          @keyup.enter="onEnter"
        />
      </div>

      <div
        v-if="$slots.trailing || showClear || showReveal"
        :inert="disabled || undefined"
        :class="[
          'flex items-center gap-1 shrink-0',
          { 'opacity-40 pointer-events-none': disabled },
        ]"
      >
        <slot name="trailing" />
        <app-btn-icon
          v-if="showClear"
          @click="clearInputValue"
          :label="$t('common.clear_icon')"
        >
          <x-circle-icon class="w-5 h-5 text-text-brand" />
        </app-btn-icon>
        <app-btn-icon
          v-if="showReveal"
          @click="togglePasswordVisibility"
          :label="
            !showPassword
              ? $t('common.show_password')
              : $t('common.hide_password')
          "
        >
          <component
            :is="!showPassword ? EyeSlashIcon : EyeIcon"
            class="w-5 h-5 text-text-brand"
          />
        </app-btn-icon>
      </div>
    </div>

    <!-- Feedback row — focus-independent; never rendered while disabled -->
    <transition name="fade">
      <div
        v-if="showFeedback"
        :id="feedbackId"
        class="flex items-center gap-1 min-h-6 px-4"
      >
        <exclamation-circle-icon class="w-5 h-5 shrink-0 text-text-error" />
        <p class="text-xs leading-[18px] text-text-error min-w-0 break-words">
          {{ errorMessage || $t('common.required') }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  nextTick,
  computed,
  watch,
  useId,
  type PropType,
  type InputTypeHTMLAttribute,
} from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/solid'
import { XCircleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { useInFocusInput } from '@/composables/useInFocusInput'
import { INPUT_SIZE_SPEC, type InputSize } from '@/components/inputSizes'

/**
 * Shared text input, rebuilt against the design-library `Input` component
 * (MEW-1971). Design-system axes are props; visual states stay in CSS. Field
 * geometry lives in `inputSizes.ts`.
 *
 * @example
 * <app-input v-model="value" label="Address" />
 * <app-input v-model="value" label="Name" surface="alternative" size="small" />
 */
const props = defineProps({
  /** Field height + whether the float-label row renders. */
  size: {
    type: String as PropType<InputSize>,
    default: 'large',
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
  /** Float label (Large) and the associated a11y label for every size. */
  label: {
    type: String,
    required: true,
  },
  /** Actual input placeholder; falls back to `label`. */
  placeholder: {
    type: String,
    required: false,
  },
  errorMessage: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<InputTypeHTMLAttribute>,
    default: 'text',
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  // When true, pressing Enter does NOT emit `enter` — so callers can gate
  // submit-on-Enter on the same condition as their submit button, without
  // re-implementing the guard in every module that uses this input. (MEW-2185)
  submitDisabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{ enter: [] }>()

const onEnter = () => {
  if (!props.submitDisabled) emit('enter')
}

const model = defineModel<string>()
const baseInput = ref<HTMLInputElement | null>(null)
const inputId = useId()
const feedbackId = useId()

const spec = computed(() => INPUT_SIZE_SPEC[props.size])

/**------------------------
 * Focus State
 -------------------------*/
const { inFocusInput, setInFocusInput, startOutOfFocusTimeout } =
  useInFocusInput(baseInput)

/**------------------------
 * Value / label float
 -------------------------*/
const hasValue = computed(() => model.value != null && model.value !== '')
// The Figma `Filled` axis drives the label: Large floats it once the field
// has a value — focus alone keeps the plain placeholder, and a disabled
// filled field keeps its label (in disabled grey). Small never shows a label
// row (spec.showLabel === false).
const isFloating = computed(() => spec.value.showLabel && hasValue.value)
// While the label floats the field has a value, so the placeholder is never
// visible alongside it — no need to clear the fallback.
const resolvedPlaceholder = computed(() => props.placeholder ?? props.label)

/**------------------------
 * Error State
 -------------------------*/
const hasRequiredError = ref(false)
const hasError = computed(
  () =>
    (!!props.errorMessage && props.errorMessage !== '') ||
    hasRequiredError.value,
)
// Disabled fields never show the feedback row (no error variants in Figma).
const showFeedback = computed(() => !props.disabled && hasError.value)

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
 * Surface — bg + border colour by state. The border is always 2px on both
 * surfaces so hover/focus never shift the content. The Alternative surface's
 * resting 1px line is an inset ring drawn inside the transparent 2px border
 * (a real 1px border would nudge the text by 1px on hover). The error ring is
 * focus-only; an unfocused errored field keeps its normal border and is
 * signalled by the feedback row alone.
 -------------------------*/
const surfaceClass = computed(() => {
  const base = 'box-border transition-colors'
  const ring = hasError.value ? 'border-border-error' : 'border-border-brand'

  if (props.surface === 'alternative') {
    const rest = `${base} bg-white border-2 border-transparent ring-1 ring-inset ring-border-default`
    if (props.disabled) return rest
    if (inFocusInput.value) return `${base} bg-white border-2 ${ring}`
    // Resting line is 1px border-default; becomes the full 2px grey border on hover.
    return `${rest} hover:ring-0 hover:border-border-hover`
  }

  if (props.disabled)
    return `${base} bg-background-default border-2 border-transparent`
  if (inFocusInput.value)
    return `${base} bg-background-default border-2 ${ring}`
  return `${base} bg-background-default border-2 border-transparent hover:border-border-hover`
})

/**------------------------
 * Trailing actions (built-in clear + password reveal)
 -------------------------*/
const showClear = computed(() => hasValue.value && !props.disabled)
const showReveal = computed(() => props.type === 'password' && !props.disabled)

const showPassword = ref(false)
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

const clearInputValue = () => {
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
