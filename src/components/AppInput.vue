<template>
  <div class="w-full">
    <!-- Field box — fixed height; state lines are inset rings, so nothing shifts -->
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
                  'block text-label-xs truncate',
                  disabled ? 'text-text-disabled' : 'text-text-subtle',
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
            'w-full bg-transparent focus:outline-none focus:ring-0 text-text-sm',
            disabled
              ? 'text-text-disabled placeholder:text-text-disabled'
              : 'text-text-default placeholder:text-text-placeholder',
          ]"
          autocomplete="off"
          @pointerdown="setActive()"
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
          'flex items-center shrink-0',
          { 'opacity-40 pointer-events-none': disabled },
        ]"
      >
        <slot name="trailing" />
        <app-btn-icon
          v-if="showClear"
          @click="clearInputValue"
          :class="TRAILING_BTN_CLASS"
          :label="$t('common.clear_icon')"
        >
          <AppIcon name="x-circle" size="s" />
        </app-btn-icon>
        <app-btn-icon
          v-if="showReveal"
          @click="togglePasswordVisibility"
          :class="TRAILING_BTN_CLASS"
          :label="
            !showPassword
              ? $t('common.show_password')
              : $t('common.hide_password')
          "
        >
          <AppIcon
            :name="!showPassword ? 'eye-slash' : 'eye'"
            variant="filled"
            size="s"
          />
        </app-btn-icon>
      </div>
    </div>

    <!-- Feedback row — focus-independent; never rendered while disabled -->
    <transition name="fade">
      <AppInputFeedback
        v-if="showFeedback"
        :id="feedbackId"
        :type="hasError ? 'error' : feedback?.type"
        :message="
          errorMessage ||
          (hasRequiredError ? $t('common.required') : feedback?.message)
        "
      />
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
import AppIcon from '@/components/icon/AppIcon.vue'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import type { InputFeedback } from '@/components/input_feedback/types'
import { useInFocusInput } from '@/composables/useInFocusInput'
import {
  INPUT_SIZE_SPEC,
  inputSurfaceClass,
  type InputSize,
  type InputSurface,
} from '@/components/inputSizes'

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
   * Figma "Style": 'default' is the background/default fill (for white
   * surfaces — it disappears on the app background); 'alternative' is the
   * background/alternative fill with a 1px border/default line (cards/dialogs).
   */
  surface: {
    type: String as PropType<InputSurface>,
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
  /** Success / warning / helper row; `errorMessage` wins when both are set. */
  feedback: {
    type: Object as PropType<InputFeedback>,
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
const {
  inFocusInput,
  isActive,
  setActive,
  setInFocusInput,
  startOutOfFocusTimeout,
} = useInFocusInput(baseInput)

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
    !!props.errorMessage ||
    hasRequiredError.value ||
    (props.feedback?.type === 'error' && !!props.feedback.message),
)
// Disabled fields never show the feedback row (no error variants in Figma).
const showFeedback = computed(
  () => !props.disabled && (hasError.value || !!props.feedback?.message),
)

watch(inFocusInput, value => {
  if (!value) {
    hasRequiredError.value = false
    if (props.isRequired && !hasValue.value) {
      hasRequiredError.value = true
    }
  }
})

const onInput = () => {
  setActive()
  if (hasRequiredError.value) {
    hasRequiredError.value = false
  }
}

/**------------------------
 * Surface — bg + border by state (see inputSurfaceClass)
 -------------------------*/
const surfaceClass = computed(() =>
  inputSurfaceClass({
    surface: props.surface,
    focused: inFocusInput.value,
    active: isActive.value,
    error: hasError.value,
    disabled: props.disabled,
  }),
)

/**------------------------
 * Trailing actions (built-in clear + password reveal)
 -------------------------*/
// Figma Input trailing Button Icon: 20px glyph + 3px padding (26px, between the
// library S 22 and M 32 boxes), siblings packed with no gap. icon/default tint
// on the button; the glyph inherits it.
const TRAILING_BTN_CLASS = 'size-[26px]! text-icon-default'
const showClear = computed(() => hasValue.value && !props.disabled)
const showReveal = computed(() => props.type === 'password' && !props.disabled)

const showPassword = ref(false)
const togglePasswordVisibility = () => {
  setActive()
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
  setActive()
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
