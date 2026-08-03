<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ modelValue: number; total: number; perPage: number }>()
const emit = defineEmits<{ 'update:modelValue': [page: number] }>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)))
const isFirst = computed(() => props.modelValue <= 1)
const isLast = computed(() => props.modelValue >= pageCount.value)

const go = (p: number) => {
  if (p >= 1 && p <= pageCount.value) emit('update:modelValue', p)
}
</script>

<template>
  <div data-test="pagination" class="flex items-center justify-center gap-2">
    <button data-test="prev" :disabled="isFirst" @click="go(props.modelValue - 1)">‹</button>
    <span data-test="page">{{ props.modelValue }} / {{ pageCount }}</span>
    <button data-test="next" :disabled="isLast" @click="go(props.modelValue + 1)">›</button>
  </div>
</template>
