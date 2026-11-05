<template>
  <div :class="['flex w-full flex-col', heightClass, attrs.class]">
    <!-- Field — fills the height left after the feedback row; lines are inset rings -->
    <div
      :class="[
        'flex min-h-0 w-full flex-1 flex-col items-end gap-0.5 rounded-12 p-4 transition-shadow',
        fieldClass,
        { 'cursor-not-allowed': disabled },
      ]"
    >
      <label
        v-if="label"
        :for="fieldId"
        :class="
          isFloating
            ? [
                'block w-full truncate text-label-xs',
                disabled ? 'text-text-disabled' : 'text-text-subtle',
              ]
            : 'sr-only'
        "
      >
        {{ label }}
      </label>
      <textarea
        :id="fieldId"
        ref="textarea"
        v-model="model"
        v-bind="textareaAttrs"
        :disabled="disabled"
        :placeholder="placeholder ?? label"
        :aria-label="label ? undefined : placeholder"
        :aria-invalid="!disabled && hasError"
        :aria-describedby="feedbackMessage ? feedbackId : undefined"
        :class="[
          'min-h-0 w-full flex-1 resize-none bg-transparent text-text-base focus:outline-none',
          disabled
            ? 'text-text-disabled placeholder:text-text-disabled'
            : 'text-text-default placeholder:text-text-placeholder',
        ]"
        @pointerdown="setActive()"
        @focus="setInFocusInput()"
        @blur="startOutOfFocusTimeout()"
        @input="setActive()"
      />
      <AppBtnIcon
        v-if="actionIcon"
        :icon="actionIcon"
        :label="actionLabel ?? actionIcon"
        :disabled="disabled"
        size="s"
        class="text-icon-default"
        @click="emit('action', model ?? '')"
      />
    </div>

    <!-- Feedback row — error replaces the helper message -->
    <AppInputFeedback
      v-if="feedbackMessage"
      :id="feedbackId"
      :type="hasError ? 'error' : 'text'"
      :message="feedbackMessage"
      class="shrink-0"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, useAttrs, useId, useTemplateRef } from 'vue'
import AppBtnIcon from '@/components/AppBtnIcon.vue'
import type { IconName } from '@/components/icon/icons'
import AppInputFeedback from '@/components/input_feedback/AppInputFeedback.vue'
import type { InputSurface } from '@/components/inputSizes'
import { textAreaFieldClass } from '@/components/text_area/types'
import { useInFocusInput } from '@/composables/useInFocusInput'

defineOptions({ inheritAttrs: false })

/**
 * Text Area (design library, Figma 3094:65088). Multi-line field with the
 * Input label, placeholder and feedback pattern. Style is `surface`, as on
 * AppInput; hover/focus/active are tracked here, filled and error are derived.
 * `class` lands on the root, every other attribute (name, maxlength,
 * readonly, data-*) on the native `<textarea>`.
 *
 * Height is the whole block, feedback row included (Figma: 140). The field
 * takes what the row leaves, and long text scrolls inside it.
 *
 * @example <AppTextArea v-model="message" placeholder="Message" />
 * @example <AppTextArea v-model="signature" surface="alternative"
 *   height-class="h-[220px]" action-icon="copy" :action-label="t('common.copy')"
 *   @action="copy" />
 */
const props = withDefaults(
  defineProps<{
    /** Figma Style: 'default' grey fill for white surfaces, 'alternative'
     *  white fill for grey surfaces. */
    surface?: InputSurface
    /** Floats above the text once filled (as Input Large); otherwise only
     *  the accessible name. Falls back as the placeholder. */
    label?: string
    placeholder?: string
    /** Helper row (Figma `message`); hidden while an error shows. */
    message?: string
    errorMessage?: string
    disabled?: boolean
    /** Height of the whole block. Defaults to Figma's 140px, which is off the
     *  size scale. */
    heightClass?: string
    /** Trailing Button Icon, bottom-right inside the field (Figma
     *  `displayButtonIcon`, drawn with `copy`). Emits `action`; the parent
     *  decides what it does. */
    actionIcon?: IconName
    /** Accessible name for the action button. */
    actionLabel?: string
    id?: string
  }>(),
  {
    surface: 'default',
    label: undefined,
    placeholder: undefined,
    message: undefined,
    errorMessage: undefined,
    heightClass: 'h-[140px]',
    actionIcon: undefined,
    actionLabel: undefined,
    id: undefined,
  },
)

const emit = defineEmits<{ action: [value: string] }>()

const model = defineModel<string>()
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const autoId = useId()
const fieldId = computed(() => props.id ?? autoId)
const feedbackId = useId()

const attrs = useAttrs()
const textareaAttrs = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { class: _class, ...rest } = attrs
  return rest
})

const {
  inFocusInput,
  isActive,
  setActive,
  setInFocusInput,
  startOutOfFocusTimeout,
} = useInFocusInput(textarea)

const hasValue = computed(() => !!model.value)
const isFloating = computed(() => !!props.label && hasValue.value)
const hasError = computed(() => !props.disabled && !!props.errorMessage)

// Disabled keeps the helper message but has no error variant in Figma
const feedbackMessage = computed(() =>
  hasError.value ? props.errorMessage : props.message,
)

const fieldClass = computed(() =>
  textAreaFieldClass({
    surface: props.surface,
    filled: hasValue.value,
    error: hasError.value,
    disabled: props.disabled,
    focused: inFocusInput.value,
    active: isActive.value,
  }),
)
</script>
