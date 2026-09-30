<script setup lang="ts" generic="T extends RadioValue">
import { computed, useId, type StyleValue } from 'vue'
import AppIcon from '@/components/icon/AppIcon.vue'
import type { RadioValue } from './types'

/**
 * Radio Button (design library, Figma `Radio Button` 3822:42489). Single-select
 * control that draws a check instead of a dot when selected.
 *
 * A real `<input type="radio">` sits visually hidden under the drawn circle, so
 * grouping (one `name` = one group), arrow-key navigation, form submission and
 * the screen-reader "1 of N" all come from the browser. Hover and focus are CSS;
 * Figma only defines them for Selected=False, so a selected radio gets no hover
 * halo. It does get the focus ring: tabbing into a group lands on the selected
 * option, and keyboard users need to see where they are.
 *
 * `class`/`style` style the row; every other attr (aria-describedby, required…)
 * goes to the input.
 *
 * @example
 * <AppRadio v-model="fee" name="fee" value="fast" label="Fast" />
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** This option's value. */
    value: T
    /** Group name. Radios sharing it form one group. */
    name: string
    disabled?: boolean
    label?: string
    id?: string
  }>(),
  { disabled: false, label: undefined, id: undefined },
)

const model = defineModel<T>()

const autoId = useId()
const inputId = computed(() => props.id ?? autoId)
const checked = computed(() => model.value === props.value)

const circleClass = computed(() => {
  if (props.disabled) {
    return checked.value
      ? 'bg-background-brand-disabled border-transparent'
      : 'bg-background-disabled border-border-disabled'
  }
  return checked.value
    ? 'bg-background-brand border-transparent'
    : 'bg-background-formfield border-border-strong group-hover/radio:ring-4 group-hover/radio:ring-background-default-hover'
})
</script>

<template>
  <label
    :for="inputId"
    :class="[
      'group/radio inline-flex items-start gap-2',
      disabled ? 'cursor-default' : 'cursor-pointer',
      $attrs.class,
    ]"
    :style="$attrs.style as StyleValue"
  >
    <input
      :id="inputId"
      v-bind="{ ...$attrs, class: undefined, style: undefined }"
      type="radio"
      class="peer sr-only"
      :name="name"
      :value="value"
      :checked="checked"
      :disabled="disabled"
      @change="model = value"
    />
    <span
      data-testid="radio-circle"
      aria-hidden="true"
      :class="[
        'flex size-5 shrink-0 items-center justify-center rounded-full border transition-shadow duration-150',
        'peer-focus-visible:ring-0 peer-focus-visible:outline-4 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-border-focus',
        circleClass,
      ]"
    >
      <AppIcon
        v-if="checked"
        name="check"
        size="xxs"
        class="size-3! text-icon-inverted"
      />
    </span>
    <span
      v-if="label || $slots.default"
      class="text-text-sm"
      :class="disabled ? 'text-text-disabled' : 'text-text-default'"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
