<template>
  <button
    type="button"
    :class="[
      'inline-flex items-center justify-center font-medium !box-border transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus',
      isLink ? 'rounded-[4px]' : 'rounded-[24px]',
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
    <div class="relative">
      <div :class="[{ hidden: !isLoading }, 'absolute inset-x-0']">
        <svg
          aria-hidden="true"
          :class="['animate-spin mx-auto text-current', sizeSpec.spinner]"
          viewBox="0 0 100 101"
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            class="opacity-30"
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentColor"
          />
        </svg>
      </div>
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
        sizeSpec.labelPadding,
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

// Figma dims danger buttons slightly less than the rest when disabled.
const disabledOpacity = computed(() =>
  props.tone === 'danger' ? '!opacity-50' : '!opacity-40',
)

const toneStyle = computed(() => {
  const { type, surface, tone } = props
  const onAlt = surface === 'alternative'

  if (type === 'link') {
    if (tone === 'danger') return 'text-error hover:underline'
    if (tone === 'success') return 'text-success hover:underline'
    return 'text-primary hover:underline'
  }

  if (type === 'tertiary') {
    if (tone === 'danger')
      return 'bg-transparent text-error hover:bg-error-subtle active:bg-error-subtle-pressed'
    if (tone === 'success')
      return 'bg-transparent text-success hover:bg-success-subtle active:bg-success-subtle'
    return onAlt
      ? 'bg-transparent text-black hover:bg-bgBase-hover active:bg-bgBase-hover'
      : 'bg-transparent text-primary hover:bg-bgBase-hover active:bg-bgBase-hover'
  }

  if (type === 'secondary') {
    if (tone === 'danger')
      return 'bg-error-subtle text-error hover:bg-error-subtle-hover active:bg-error-subtle-pressed'
    if (tone === 'success')
      return 'bg-success-subtle text-success hover:brightness-95 active:brightness-90'
    return onAlt
      ? 'bg-white text-primary hover:bg-bgBase-hover active:bg-bgBase-pressed'
      : 'bg-bgBase text-primary hover:bg-bgBase-hover active:bg-bgBase-pressed'
  }

  // primary
  if (tone === 'danger') return 'bg-error text-white active:brightness-95'
  if (tone === 'success') return 'bg-success text-white active:brightness-95'
  return 'bg-primary text-white hover:bg-primary-hover active:bg-primary-pressed'
})

const emit = defineEmits(['click'])
const onClick = () => {
  if (!props.disabled && !props.isLoading) {
    emit('click')
  }
}
</script>
