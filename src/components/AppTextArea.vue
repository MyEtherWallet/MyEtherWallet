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
        'w-full h-40 px-4 py-3 rounded-12 resize-none text-text-sm text-text-default placeholder:text-text-placeholder focus:outline-none focus:ring-0',
        surfaceClass,
      ]"
      autocomplete="off"
      @focus="setInFocusInput()"
      @blur="startOutOfFocusTimeout()"
      @pointerdown="setActive()"
      @input="onInput"
    />
    <div class="flex items-center gap-1 min-h-6 px-4 mt-1">
      <template v-if="showFeedback">
        <AppIcon
          name="exclamation-circle"
          size="s"
          class="shrink-0 text-text-error"
        />
        <p
          :id="feedbackId"
          class="text-text-xs text-text-error min-w-0 break-words"
        >
          {{ errorMessage || $t('common.required') }}
        </p>
      </template>
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
import AppIcon from '@/components/icon/AppIcon.vue'
import { useInFocusInput } from '@/composables/useInFocusInput'
import { inputSurfaceClass, type InputSurface } from '@/components/inputSizes'

defineOptions({ inheritAttrs: false })

/**
 * Multi-line text field, restyled to match the design-library `Input`
 * (MEW-1971): same surface tokens, 12px radius and focus-only error ring, at
 * textarea height. No float label — a textarea has no filled/label state.
 *
 * @example Basic
 * <app-text-area v-model="model" placeholder="Message" />
 * @example On a white card/dialog
 * <app-text-area v-model="model" surface="alternative" placeholder="Message" />
 */
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
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

const {
  inFocusInput,
  isActive,
  setActive,
  setInFocusInput,
  startOutOfFocusTimeout,
} = useInFocusInput(baseInput)

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
  setActive()
  if (hasRequiredError.value) {
    hasRequiredError.value = false
  }
}

/**------------------------
 * Surface — shared with AppInput (see inputSurfaceClass)
 -------------------------*/
const surfaceClass = computed(() =>
  inputSurfaceClass({
    surface: props.surface,
    focused: inFocusInput.value,
    active: isActive.value,
    error: hasError.value,
  }),
)

const clearInputValue = () => {
  setActive()
  setInFocusInput()
  nextTick(() => {
    model.value = ''
  })
}
</script>
