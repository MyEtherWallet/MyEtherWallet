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
              ? 'block text-xs leading-[18px] tracking-[-0.24px] text-t-subtle truncate'
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
            'w-full bg-transparent focus:outline-none focus:ring-0 text-sm leading-5 placeholder:text-grey-subtle',
            disabled ? 'text-grey-subtle' : 'text-black',
          ]"
          autocomplete="off"
          @focus="setInFocusInput()"
          @blur="startOutOfFocusTimeout()"
          @input="onInput"
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
          <x-circle-icon class="w-5 h-5 text-primary" />
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
            class="w-5 h-5 text-primary"
          />
        </app-btn-icon>
      </div>
    </div>

    <!-- Feedback row — focus-independent; never rendered while disabled -->
    <transition name="fade">
      <div
        v-if="showFeedback"
        :id="feedbackId"
        class="flex items-center gap-1 h-6 px-4"
      >
        <exclamation-circle-icon class="w-5 h-5 shrink-0 text-error" />
        <p class="text-xs leading-[18px] text-error truncate">
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
  /** Figma "Style": grey fill (app bg) vs. white + border (cards/dialogs). */
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
})

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
// Large floats the label once the field is filled or focused; Small never
// shows a label row (spec.showLabel === false). Disabled hides the label row
// entirely, even when filled.
const isFloating = computed(
  () =>
    spec.value.showLabel &&
    !props.disabled &&
    (hasValue.value || inFocusInput.value),
)
const resolvedPlaceholder = computed(() => {
  const fallback = props.placeholder ?? props.label
  // Hide the (duplicate) placeholder on Large once the label has floated.
  return spec.value.showLabel && isFloating.value ? '' : fallback
})

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
 * Surface — bg + border colour by state. Border is always 2px on the Default
 * surface (transparent at rest) so the ring adds no height/content shift. The
 * error ring is focus-only; an unfocused errored field keeps its normal
 * border and is signalled by the feedback row alone.
 -------------------------*/
const surfaceClass = computed(() => {
  const base = 'box-border transition-colors'
  const ring = hasError.value ? 'border-error' : 'border-primary'

  if (props.surface === 'alternative') {
    if (props.disabled) return `${base} bg-white border border-border-default`
    if (inFocusInput.value) return `${base} bg-white border-2 ${ring}`
    // Resting border is 1px #e6e6e6; thickens to 2px grey on hover.
    return `${base} bg-white border border-border-default hover:border-2 hover:border-grey-subtle`
  }

  if (props.disabled) return `${base} bg-bgBase border-2 border-transparent`
  if (inFocusInput.value) return `${base} bg-bgBase border-2 ${ring}`
  return `${base} bg-bgBase border-2 border-transparent hover:border-grey-subtle`
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
