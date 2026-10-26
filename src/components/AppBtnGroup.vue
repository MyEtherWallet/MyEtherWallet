<template>
  <div
    ref="root"
    :class="[
      'flex w-full gap-4',
      isVertical
        ? 'flex-col items-stretch [&>*]:w-full [&>*]:shrink-0'
        : 'items-start justify-end [&>*]:flex-1 [&>*]:min-w-0',
      { 'p-4': hasPadding },
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
/**
 * AppBtnGroup — visual grouping of related actions.
 *
 * Implements the design-library Button Group (Figma node 1771:11996, component
 * set 1762:1095). It is a layout container only: pass AppBaseButtons through
 * the default slot and the group handles orientation, spacing and sizing.
 *
 * - `horizontal` — buttons share the width equally, aligned to the end.
 * - `vertical` — buttons stack full-width.
 *
 * Slot order follows the design: [tertiary?] → secondary → primary, so the
 * primary action lands on the right (horizontal) or bottom (vertical). The
 * optional tertiary ("Show Third Button" in Figma) is horizontal only.
 * Figma supports 2–3 buttons; other counts warn outside production.
 *
 * NOTE: not to be confused with AppSegmentedControl (formerly named
 * AppBtnGroup), which is the selectable tab/segmented control.
 *
 * @example
 * <app-btn-group>
 *   <app-base-button type="secondary" surface="alternative" @click="cancel">
 *     {{ $t('common.cancel') }}
 *   </app-base-button>
 *   <app-base-button @click="confirm">{{ $t('common.confirm') }}</app-base-button>
 * </app-btn-group>
 */
import { computed, onMounted, onUpdated, ref, type PropType } from 'vue'
import configs from '@/configs'

const props = defineProps({
  /**
   * @orientation - `horizontal` splits the row evenly; `vertical` stacks.
   */
  orientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
  /**
   * @hasPadding - Figma wraps the group in 16px padding. Turn off when the
   * parent (dialog footer, card) already provides its own.
   */
  hasPadding: {
    type: Boolean,
    default: true,
  },
})

// Children are sized by the container rather than by cloning slot content, so
// any button-like element can be dropped in and still share the row (or fill
// the column) — gap and padding are both size/4 (16px) per the design.
const isVertical = computed(() => props.orientation === 'vertical')

// Counts rendered elements, so v-if'd buttons that are off don't count.
const root = ref<HTMLElement | null>(null)
const warnOnButtonCount = () => {
  if (configs.BUILD_MODE === 'production' || !root.value) return
  const count = root.value.children.length
  if (count < 2 || count > 3) {
    console.warn(
      `[AppBtnGroup] Expects 2–3 buttons (Figma Button Group); got ${count}.`,
    )
  }
}
onMounted(warnOnButtonCount)
onUpdated(warnOnButtonCount)
</script>
