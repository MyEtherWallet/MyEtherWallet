<template>
  <input
    name="amount-input"
    type="number"
    step="0.000000000000000001"
    required
    @input="handleChange"
  />
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
