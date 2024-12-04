<template>
  <img
    :src="asset"
    :alt="props.alt"
    :height="props.height"
    :width="props.width"
    @error="handleImageError"
    :class="{ 'opacity-0': !isLoaded }"
    class="transition-opacity duration-300"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PropType } from 'vue'

const props = defineProps({
  asyncImg: {
    type: [String, Function] as PropType<string | (() => Promise<string>)>,
    required: true,
  },
  height: {
    type: Number,
    default: 80,
  },
  width: {
    type: Number,
    default: 80,
  },
  alt: String,
})

const resolvedImg = ref('')
const isLoaded = ref(false)

if (typeof props.asyncImg === 'function') {
  props
    .asyncImg()
    .then((url: string) => {
      isLoaded.value = true
      resolvedImg.value = url
    })
    .catch((error: unknown) => {
      console.error('Failed to load image:', error)
      isLoaded.value = false
      resolvedImg.value = '' // Will fallback to placeholder
    })
}

const asset = computed(() => {
  if (isLoaded.value) {
    return resolvedImg.value
  }
  //TODO: Add a placeholder image
  return ''
})

const handleImageError = () => {
  isLoaded.value = false
}
</script>
