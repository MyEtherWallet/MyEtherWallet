<template>
  <button
    type="button"
    :class="[
      'relative inline-flex items-center justify-center !box-border transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
      isLink ? 'rounded-[4px]' : 'rounded-24',
      isLink ? '' : sizeSpec.padding,
      sizeSpec.text,
      toneStyle,
      disabled ? disabledOpacity : '',
    ]"
    :disabled="disabled || isLoading"
    :aria-busy="isLoading"
    @click.stop="onClick"
    v-ripple
    :aria-disabled="disabled"
  >
    <div
      :class="[
        { hidden: !isLoading },
        'absolute inset-0 flex items-center justify-center',
      ]"
    >
      <app-spinner :size="sizeSpec.spinner" :color="spinnerColor" />
    </div>

    <span
      v-if="$slots.leading"
      :class="[
        'flex items-center shrink-0',
        sizeSpec.icon,
        { 'opacity-0': isLoading },
      ]"
    >
      <slot name="leading" />
    </span>

    <span
      :class="[
        'flex items-center justify-center',
        isLink ? '' : sizeSpec.labelPadding,
        { 'opacity-0': isLoading },
      ]"
    >
      <slot />
    </span>

    <span
      v-if="$slots.trailing"
      :class="[
        'flex items-center shrink-0',
        sizeSpec.icon,
        { 'opacity-0': isLoading },
      ]"
    >
      <slot name="trailing" />
    </span>
  </button>
</template>

<script setup lang="ts">
/**
 * AppBaseButton — the single button primitive.
 *
 * Implements the MEW design-library Button (Figma node 1726:3666): four types
 * (primary / secondary / tertiary / link) across two surfaces, with a `tone`
 * axis for danger and success. Sizes come from the shared `BTN_SIZE_SPEC`
 * table so geometry stays in one place.
 *
 * The former `isOutline` and `theme="neutral"` variants were removed with the
 * design refresh — both map to `type="secondary"`. `AppBtnText` was folded in
 * as `type="link"`.
 *
 * @example
 * <app-base-button type="secondary" size="medium" @click="onClick">
 *   Cancel
 * </app-base-button>
 */
import { computed, type PropType } from 'vue'
import AppSpinner from '@/components/spinner/AppSpinner.vue'
import { BTN_SIZE_SPEC, type BtnSize } from './buttonSizes'

const props = defineProps({
  /**
   * @type - Visual hierarchy. `link` renders inline with no padding or fill.
   *
   * NOTE: this is the design-system variant, not the DOM attribute — being a
   * declared prop it never falls through, so the template pins the native
   * `type="button"` itself to keep a variant named "primary" from ever acting
   * as an implicit form submit.
   */
  type: {
    type: String as PropType<'primary' | 'secondary' | 'tertiary' | 'link'>,
    default: 'primary',
  },
  /**
   * @surface - Which background the button sits on. `alternative` is for
   * buttons placed on white/elevated surfaces (cards, dialogs).
   */
  surface: {
    type: String as PropType<'default' | 'alternative'>,
    default: 'default',
  },
  /**
   * @tone - Semantic intent. `danger` is the Figma `Danger=True` variant;
   * `success` extends it for the perps long/short pairing, which needs green.
   */
  tone: {
    type: String as PropType<'default' | 'danger' | 'success'>,
    default: 'default',
  },
  /**
   * @size - See BTN_SIZE_SPEC. Maps to Figma `_base/Button` S / M / L / XL.
   */
  size: {
    type: String as PropType<BtnSize>,
    default: 'large',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})

const isLink = computed(() => props.type === 'link')

const sizeSpec = computed(() => BTN_SIZE_SPEC[props.size])

// White on solid fills (Figma Loading state); the default DL tone elsewhere.
const spinnerColor = computed(() =>
  props.type === 'primary' ? 'inverted' : 'default',
)

// Figma dims danger buttons slightly less than the rest when disabled.
const disabledOpacity = computed(() =>
  props.tone === 'danger' ? '!opacity-50' : '!opacity-40',
)

const toneStyle = computed(() => {
  const { type, surface, tone } = props
  const onAlt = surface === 'alternative'

  if (type === 'link') {
    if (tone === 'danger') return 'text-text-error hover:underline'
    if (tone === 'success') return 'text-text-success hover:underline'
    return 'text-text-brand hover:underline'
  }

  if (type === 'tertiary') {
    if (tone === 'danger')
      return 'bg-transparent text-text-error hover:bg-background-error-subtle active:bg-background-error-subtle-pressed'
    if (tone === 'success')
      return 'bg-transparent text-text-success hover:bg-background-success-subtle active:bg-background-success-subtle'
    return onAlt
      ? 'bg-transparent text-text-default hover:bg-background-default-hover active:bg-background-default-hover'
      : 'bg-transparent text-text-brand hover:bg-background-default-hover active:bg-background-default-hover'
  }

  if (type === 'secondary') {
    if (tone === 'danger')
      return 'bg-background-error-subtle text-text-error hover:bg-background-error-subtle-hover active:bg-background-error-subtle-pressed'
    if (tone === 'success')
      return 'bg-background-success-subtle text-text-success hover:brightness-95 active:brightness-90'
    return onAlt
      ? 'bg-background-alternative text-text-brand hover:bg-background-default-hover active:bg-background-default-pressed'
      : 'bg-background-default text-text-brand hover:bg-background-default-hover active:bg-background-default-pressed'
  }

  // primary
  if (tone === 'danger')
    return 'bg-background-error text-text-on-error active:brightness-95'
  if (tone === 'success')
    return 'bg-background-success text-text-on-success active:brightness-95'
  return 'bg-background-brand text-text-on-brand hover:bg-background-brand-hover active:bg-background-brand-pressed'
})

const emit = defineEmits(['click'])
const onClick = () => {
  if (!props.disabled && !props.isLoading) {
    emit('click')
  }
}
</script>
