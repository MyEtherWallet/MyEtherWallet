<template>
  <div v-element-visibility="[onElementVisibility, { threshold: 0.9 }]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { vElementVisibility } from '@vueuse/components'
import { ref, nextTick } from 'vue'

const props = defineProps({
  itemIndex: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits<{
  (e: 'change:item-visible', itemIndex: number, isVisible: boolean): void
}>()

const targetIsVisible = ref(false)

const onElementVisibility = (state: boolean) => {
  targetIsVisible.value = state
  nextTick(() => {
    emit('change:item-visible', props.itemIndex, targetIsVisible.value)
  })
}
</script>
