<template>
  <button
    type="button"
    role="switch"
    :aria-checked="model"
    :disabled="disabled"
    :class="[
      'app-toggle flex h-6 w-[43px] items-center rounded-full p-[3px] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed',
      model
        ? 'bg-background-brand hover:bg-background-brand-hover'
        : 'bg-background-toggle hover:bg-background-default-hover',
    ]"
    @click="toggle"
    @keydown.enter.prevent="toggle"
    @keydown.space.prevent="toggle"
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
const props = withDefaults(
  defineProps<{
    /** Prevents the switch value from being changed. */
    disabled?: boolean
  }>(),
  { disabled: false },
)

const emit = defineEmits<{
  /** Emits the new value after the switch changes. */
  change: [value: boolean]
}>()

const model = defineModel<boolean>({ required: true })

const toggle = () => {
  if (props.disabled) return

  const value = !model.value
  model.value = value
  emit('change', value)
}
</script>

<style scoped>
/* Used only by the dev preview to display CSS hover states side by side. */
.app-toggle.is-forced-hover[aria-checked='false'] {
  background-color: var(--color-background-default-hover);
}

.app-toggle.is-forced-hover[aria-checked='true'] {
  background-color: var(--color-background-brand-hover);
}
</style>
