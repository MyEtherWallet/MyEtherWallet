<template>
  <div>
    <img
      v-if="asset"
      :src="asset"
      :alt="props.alt"
      :height="props.height"
      :width="props.width"
      @error="handleImageError"
      class="w-10 h-10 flex-none rounded-lg mx-auto"
    />
    <div
      v-else
      class="w-10 h-10 rounded-lg flex items-center justify-center bg-grey-5 rounded-xl"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  img: {
    type: String,
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
  isLoaded: {
    type: Boolean,
    default: false,
  },
})

const asset = computed(() => {
  if (props.isLoaded) {
    return props.img
  }
  //TODO: Add a placeholder image
  return undefined
})

const handleImageError = () => {
  console.error('Error loading image: ', props.img)
}
</script>
