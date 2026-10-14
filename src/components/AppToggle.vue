<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    :class="[
      'flex h-6 w-[43px] shrink-0 items-center rounded-full p-[3px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background-default disabled:pointer-events-none disabled:opacity-40',
      model
        ? 'bg-background-brand hover:bg-background-brand-hover'
        : 'bg-background-toggle hover:bg-background-default-hover',
    ]"
    @click="toggle"
  >
    <span
      aria-hidden="true"
      :class="[
        'size-[18px] rounded-full bg-background-alternative transition-transform duration-150',
        { 'translate-x-[19px]': model },
      ]"
    />
  </button>
</template>

<script setup lang="ts">
/**
 * Design-library Toggle (MEW-1974, Figma node 628-190): 43×24 switch whose
 * 18px knob slides between off and on. Hover is CSS only; label/description
 * text lives outside — pair it with a Cell or Content Group.
 *
 * @example
 * <app-toggle v-model="enabled" aria-label="Enable notifications" />
 */
const props = withDefaults(
  defineProps<{
    /** Prevents the switch value from being changed. Not in Figma yet. */
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  /** Emits the new value after the switch changes. */
  change: [value: boolean]
}>()

const model = defineModel<boolean>({ required: true })

// Native <button> already turns Enter / Space into a click.
const toggle = () => {
  if (props.disabled) return

  const value = !model.value
  model.value = value
  emit('change', value)
}
</script>
