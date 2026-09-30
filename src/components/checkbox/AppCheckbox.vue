<script setup lang="ts">
import { computed, useAttrs, type StyleValue } from 'vue'
import AppIcon from '@components/icon/AppIcon.vue'

/**
 * Checkbox (design library, Figma component set 3822:42450, Type × State).
 * A real `<input type="checkbox">` sits visually hidden inside the `<label>`,
 * so keyboard, form submission and screen readers work natively; the drawn
 * 20px box is a sibling styled from it. Type (unselected / selected /
 * indeterminate) comes from `v-model` + `indeterminate`; hover, focus and
 * disabled are CSS states, never props. `indeterminate` wins visually, like
 * the native property it binds to.
 *
 * Attrs (id, name, value, required, aria-*) land on the input; `class` and
 * `style` stay on the label so layout utilities still apply.
 *
 * @example
 * <app-checkbox v-model="agreed" label="Remember me" />
 * @example select-all header
 * <app-checkbox v-model="allSelected" :indeterminate="someSelected && !allSelected" />
 */
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    indeterminate?: boolean
    disabled?: boolean
    label?: string
  }>(),
  { indeterminate: false, disabled: false, label: undefined },
)

const model = defineModel<boolean>({ default: false })

const attrs = useAttrs()
const split = computed(() => {
  const { class: cls, style, ...input } = attrs
  return { root: { class: cls, style: style as StyleValue }, input }
})

const isOn = computed(() => model.value || props.indeterminate)

// Hover draws a 4px halo flush to the box (ring = box-shadow, so the 20px box
// never shifts); focus draws a 2px outline 4px out. Focus wins over hover:
// peer-* variants sort after group-* in Tailwind, so ring-0 beats ring-4.
const boxClass = computed(() => {
  if (props.disabled) {
    return isOn.value
      ? 'bg-background-brand-disabled'
      : 'border border-border-disabled bg-background-disabled'
  }
  return [
    'group-hover:ring-4 group-hover:ring-background-default-hover peer-focus-visible:ring-0',
    isOn.value
      ? 'bg-background-brand group-hover:bg-background-brand-hover'
      : 'border border-border-strong bg-background-formfield',
  ]
})
</script>

<template>
  <label
    v-bind="split.root"
    class="group inline-flex items-start gap-2 text-text-sm"
    :class="
      disabled
        ? 'cursor-default text-text-disabled'
        : 'cursor-pointer text-text-default'
    "
  >
    <input
      v-bind="split.input"
      v-model="model"
      type="checkbox"
      class="peer sr-only"
      :indeterminate="indeterminate"
      :disabled="disabled"
    />
    <span
      aria-hidden="true"
      class="flex size-5 shrink-0 items-center justify-center rounded text-icon-inverted transition-colors duration-150 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-border-focus"
      :class="boxClass"
    >
      <span
        v-if="indeterminate"
        data-testid="checkbox-bar"
        class="h-0.5 w-2.5 rounded-full bg-icon-inverted"
      />
      <AppIcon v-else-if="model" name="check" size="xxs" />
    </span>
    <span v-if="label || $slots.default">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
